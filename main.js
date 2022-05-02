import {setUpEditor} from "./app/program.js";
import {setUpOutput} from "./app/output.js";
import * as ps from "./app/pipelines.js";
import { asyncRunJS } from "./app/js.js";
import { asyncRunLua } from "./app/lua.js";

const cmLangs = {
  "*.py" : { lang: "*.py",  syntax: "text/x-python", run: evaluatePython, interrupt: interruptPythonExecution},
  "*.sql" : { lang: "*.sql",  syntax: "text/x-mysql", run: evaluateSQL, interrupt: interruptSQLExecution },
  "*.js" : { lang: "*.js",  syntax: "text/javascript", run: evaluateJS },
  "*.lua" : { lang: "*.lua",  syntax: "text/x-lua", run: evaluateLua },
  "*.r" : { lang: "*.r",  syntax: "text/x-rsrc", run: evaluateR, interrupt: interruptRExecution },
};
// Set up the editor.
const editor = setUpEditor(ps.pipeline.currentPipe().program());
// Set up the input and output panes.
const outputWrapper = setUpOutput(output, ps.pipeline.currentPipe().output());
const inputWrapper = setUpOutput(input, await ps.pipeline.currentPipe().input(),
  ps.pipeline.currentPipeIndex() ? false : true);

// Set up the keyboard shortcuts and the editor panel options.
ps.setPanes(editor, inputWrapper, outputWrapper, cmLangs);
editor.setOption("extraKeys", {
      "Ctrl-Enter": determineLanguageAndRun,
      "Alt-Right": ps.nextPipe,
      "Alt-Left": ps.previousPipe,
      "Alt-A": ps.insertAfter,
      "Alt-B": ps.insertBefore,
      "Alt-C": ps.deleteCurrent,
      "Alt-Up": ps.nextPipeline,
      "Alt-Down": ps.prevPipeline,
      "Alt-Q": ps.deletePipeline,
      "Alt-R": runPipeline,
      "Ctrl-O": ps.openFile,
      "Ctrl-D": interruptExecution,
      "Ctrl-S": download,
      "Ctrl-G": uploadToGoogle,
      "Shift-Tab": false,
      "Ctrl-Space": "autocomplete",
    });
let syntaxDirty = false;
editor.on("change",function(cm,change){
  syntaxDirty = true;
});

[inputWrapper, outputWrapper].forEach(x => {
  let extraKeys = x.editor().getOption("extraKeys");
  x.editor().setOption("extraKeys", {
      ...extraKeys,
      "Ctrl-Enter": determineLanguageAndRun,
      "Alt-Right": ps.nextPipe,
      "Alt-Left": ps.previousPipe,
      "Alt-A": ps.insertAfter,
      "Alt-B": ps.insertBefore,
      "Alt-C": ps.deleteCurrent,
      "Alt-Up": ps.nextPipeline,
      "Alt-Down": ps.prevPipeline,
      "Alt-Q": ps.deletePipeline,
      "Alt-R": runPipeline,
      "Ctrl-O": ps.openFile,
      "Ctrl-D": interruptExecution,
      "Ctrl-S": download,
    });
});

function interruptPythonExecution() {
  import("./app/pyodide-py-worker.js").then((py) => {
    py.interruptPythonExecution();
  });
}
function interruptSQLExecution() {
  import("./app/sql.js-worker.js").then((sql) => {
    sql.interruptExecution();
  });
}
function interruptRExecution() {
  import("./app/R.js-worker.js").then((r) => {
    r.interruptExecution();
  });
}

const shebangs = {
  "#!/bin/python" : "*.py",
  "#!/bin/py" : "*.py",
  "#!/bin/javascript" : "*.js",
  "#!/bin/js" : "*.js",
  "#!/bin/sql" : "*.sql",
  "#!/bin/r" : "*.r",
  "#!/bin/lua" : "*.lua",
};
function langFromShebang(p) {
  for (var k of Object.keys(shebangs)) {
    if (p.startsWith(k) && shebangs[k] in cmLangs) {
      return cmLangs[shebangs[k]];
    }
  }
  return null;
}
function preprocessedProgram(p) {
  let program = p.program();
  if (langFromShebang(program))
    program = program.slice(program.indexOf('\n') + 1);
  return program;
}
// Update the syntax highlighting to suit the language being used.
// Detection is a bit off sometimes so we use workarounds.
setInterval(determineLanguage, 2000, false);
const guessLang = new GuessLang();
async function determineLanguage(force = true) {
  if (!force) {
    if (!syntaxDirty) {
      return;
    }
    syntaxDirty = false;
  }
  if (runningPipe) {
    return;
  }
  let p = editor.getValue();
  let lang = langFromShebang(p);
  if (!lang) { 
    // Strip comments, which confuse guesslang.
    let program = p.split('\n')
      .filter(x => !x.startsWith('--') && !x.startsWith('#') && !x.startsWith('//'))
      .join('\n');
    const result = await guessLang.runModel(program);
    const fileType = (result.length) ? "*." + result[0].languageId : "";
    if (!(fileType in cmLangs)) { return null; }
    lang = cmLangs[fileType];
  }
  editor.setOption("mode", lang.syntax);
  if (ps.pipeline.lang() == lang.lang) return;
  ps.pipeline.updateLanguage(lang.lang);
  ps.updateAwesomeBar();
  return lang;
}

let runningPipe = null;
function runPipeline() {
  if (runningPipe) {
    return;
  }
  running.style.display = "block";
  running.textContent = "Busy";
  setTimeout(runPipelineImpl, 0);
}
async function runPipelineImpl() {
  // Determine what the language is and the run the script.
  async function run() {
    let lang = await determineLanguage();
    // Python is our default
    if (!lang) lang = cmLangs[ps.pipeline.lang()];
    updateProgress("Running..");
    await lang.run();
  }
  let pipe = await ps.moveToFirstPipe();
  while (pipe) {
    runningPipe = pipe;
    try {
      await run();
    } catch(error) {
      console.error(`Failed to fetch: ${error}`);
      break;
    }
    pipe = await ps.nextPipe();
  }
  runningPipe = null;
  running.style.display = "none";
  await ps.updateDisplayedPipe(await ps.pipeline.refreshCurrentPipe());
}

// Determine what the language is and the run the script.
async function interruptExecution() {
  let lang = await determineLanguage();
  // Python is our default
  if (!lang) lang = cmLangs[ps.pipeline.lang()];
  if (!lang.interrupt) return;
  lang.interrupt();
}

async function updateProgress(progress) {
  if (ps.pipeline.currentPipe().id() != runningPipe.id()) {
    return;
  }
  outputWrapper.editor().getDoc().setValue(progress);
  await runningPipe.updateOutput(progress);
}

function determineLanguageAndRun() {
  if (runningPipe) {
    return;
  }
  runningPipe = ps.pipeline.currentPipe();
  updateProgress("Running..");
  runningPipe.updateProgram(editor.getValue(), editor.getDoc());
  running.style.display = "block";
  running.textContent = "Busy";
  setTimeout(determineLanguageAndRunImpl, 0);
}
// Determine what the language is and the run the script.
async function determineLanguageAndRunImpl() {
  let lang = await determineLanguage();
  // Python is our default
  if (!lang) lang = cmLangs[ps.pipeline.lang()];
  updateProgress("Running as " + lang.lang + "..");
  console.log("Running as", lang);

  // If this is the first pipe in the pipeline, make sure the
  // input is up to date.
  if (!ps.pipeline.currentPipeIndex()) {
    ps.pipeline.updateInput(inputWrapper.getValue());
  }
  try {
    updateProgress("Running ..");
    await lang.run();
  } catch(e) {
    console.error(`Failed to fetch 1: ${e}`);
    outputWrapper.editor().replaceRange('\n' + e, {line: Infinity});
  }
  running.style.display = "none";
  running.textContent = "Busy";
  runningPipe = null;
  // Refresh the current pipe with the results (if necessary) and update
  // the display.
  await ps.updateDisplayedPipe(await ps.pipeline.refreshCurrentPipe());
}

// Helper for running SQL
var enc = new TextEncoder(); // always utf-8
let sqlLoaded = 0;
async function evaluateSQL() {
  if (!sqlLoaded) {
    updateProgress("Loading SQLite Engine for the first time..");
    sqlLoaded=1;
  }
  await import("./app/sql.js-worker.js").then(async (sql) => {
    console.assert(runningPipe);
    console.log("evaluating sql");
    let input = await runningPipe.input();
    let buffInput = enc.encode(input);

    // Drop the table if it already exists.
    let tableName = "input.txt";
    await sql.asyncRunSQL("DROP TABLE \"" + tableName + "\";");

    // Write the standard input to a TSV table first.
    updateProgress("Loading input as a table..");
    await localforage.setItem(tableName, enc.encode(buffInput).buffer);
    let res = await sql.asyncCreateTable(buffInput, tableName);
    if (res.error) {
      await runningPipe.updateOutput("Error creating input.txt table: " + res.error);
      throw new Error("=> Error occurred while running SQL.");
    }

    // Load the files associated with the pipe to tables.
    let files = runningPipe.files();
    await Promise.all(files.map(async (f) => {
      await sql.asyncRunSQL("DROP TABLE \"" + f + "\";");
    }));
    await Promise.all(files.map(async (f) => {
      updateProgress("Loading " + f + " as a table..");
      let data = await localforage.getItem(f);
      await sql.asyncCreateTable(new Uint8Array(data), f);
    }));

    // Now run the query against it.
    let program = preprocessedProgram(runningPipe);
    updateProgress("Running Query..");
    const { results, error } = await sql.asyncRunSQL(program);

    // Convert the output into tab-separated rows.
    if (results) {
      // First the header row.
      let output = results[0].columns.map((e,i,a) => (e + (i == (a.length - 1) ? '\n' : '\t')));
      // Then the results row.
      output = output.concat(results[0].values.flatMap((e) => {
        return e.map((e,i,a) => (e + (i == (a.length - 1) ? '\n' : '\t')));
      }));
      output = output.join('');
      await runningPipe.updateOutput(output);
    }
    if (error) {
      console.log("sqlworker error: ", error);
      await runningPipe.updateOutput(error);
      throw new Error("=> Error occurred while running SQL.");
    }
  });
}

let RLoaded = 0;
// Helper for running Python
async function evaluateR() {
  if (!RLoaded) {
    updateProgress("Loading R for the first time..");
    RLoaded=1;
  }
  await import("./app/R.js-worker.js").then(async (R) => {
    console.assert(runningPipe);
    let input = await runningPipe.input();
    let program = preprocessedProgram(runningPipe);

    // Get any files and add the input to 'input.txt'.
    let files = runningPipe.files();
    await localforage.setItem("input.txt", enc.encode(input).buffer);

    const { results, error, output } = await R.asyncRunR(program, input, files);
    let stdout = '';
    if (error) {
      stdout += error;
    }
    if (results) {
      stdout += results;
    }
    if (output) {
      stdout += output;
    }
    await runningPipe.updateOutput(stdout);
    if (error) {
      console.log("R Worker error: ", error);
      throw new Error("=> Error occured while running R");
    }
  })
}

let pythonLoaded = 0;
// Helper for running Python
async function evaluatePython() {
  if (!pythonLoaded) {
    updateProgress("Loading Python for the first time..");
    pythonLoaded=1;
  }
  await import("./app/pyodide-py-worker.js").then(async (py) => {
    console.assert(runningPipe);
    let input = await runningPipe.input();
    let program = preprocessedProgram(runningPipe);

    // Get any files and add the input to 'input.txt'.
    let files = runningPipe.files();
    await localforage.setItem("input.txt", enc.encode(input).buffer);

    const { results, error, output } = await py.asyncRun(program, input, files.concat(["input.txt"]));
    let stdout = '';
    if (error) {
      stdout += error;
    }
    if (results) {
      stdout += results;
    }
    if (output) {
      stdout += output;
    }
    await runningPipe.updateOutput(stdout);
    if (error) {
      console.log("pyodideWorker error: ", error);
      throw new Error("=> Error occured while running Python");
    }
  })
}

// Helper for running Javascript
async function evaluateJS() {
  let input = await runningPipe.input();
  let program = preprocessedProgram(runningPipe);
  let files = runningPipe.files();
  const { results, error, output } = await asyncRunJS(input, program);
  let stdout = '';
  if (error) {
    stdout += error;
  }
  if (results) {
    stdout += results;
  }
  if (output) {
    stdout += output;
  }
  await runningPipe.updateOutput(stdout);
  if (error) {
    console.log("jsWorker error: ", error);
    throw new Error("test error inside js");
  }
}

// Helper for running Javascript
async function evaluateLua() {
  let input = await runningPipe.input();
  let program = preprocessedProgram(runningPipe);
  let files = runningPipe.files();
  const { results, error, output } = await asyncRunLua(input, program);
  let stdout = '';
  if (error) {
    stdout += error;
  }
  if (results) {
    stdout += results;
  }
  if (output) {
    stdout += output;
  }
  await runningPipe.updateOutput(stdout);
  if (error) {
    console.log("luaWorker error: ", error);
    throw new Error("test error inside lua");
  }
}
// Allow the user to add a file. Doing so associates the file with the current
// pipe only. 
var fileUpload = document.getElementById('file-upload');
fileUpload.oninput = function () {
  if (runningPipe) {
    return;
  }
  runningPipe = ps.pipeline.currentPipe();
  running.style.display = "block";
  running.textContent = "Busy";

  var f = fileUpload.files[0];
  if (!f) { return; };
  running.textContent = "Loading " + f.name;
  if (f.name.endsWith(".zip")) {
    upload(f);
    runningPipe = null;
    return;
  }
  var r = new FileReader();
  r.onload = async function () {
    await localforage.setItem(f.name, r.result);
    await runningPipe.addFile(f.name);
    ps.updateAwesomeBar();
    runningPipe = null;
    running.textContent = `loaded ${f.name}`;
  }
  r.readAsArrayBuffer(f);
}

async function createZipFile() {
  async function zipFile(pipe) {
    let p = {};
    p.key = pipe.id();

    // Zip the program, input, and output.
    p.entries = [];
    p.entries.push({fileName: (++count).toString().padStart(3, '0') + " - input.txt", name: 'input'});
    zip.file((count).toString().padStart(3, '0')  + " - input.txt", await pipe.input());
    p.entries.push({fileName: (++count).toString().padStart(3, '0')  + " - program"
      + pipe.lang().replace('*',''), name: 'program'});
    zip.file((count).toString().padStart(3, '0')  + " - program" + pipe.lang().replace('*',''), pipe.program());
    p.entries.push({fileName: (++count).toString().padStart(3, '0')  + " - output.txt", name: 'output'});
    zip.file((count).toString().padStart(3, '0')  + " - output.txt", await pipe.output());

    // Zip any files associated with the pipe.
    p.metadata = {files: pipe.files(), lang: pipe.lang()};
    pipe.files().forEach(async (f) => {
      zip.file(f, await localforage.getItem(f));
    });
    return p;
  }

  let count = 0;
  var zip = new JSZip();
  let manifest = {};
  manifest.pipelineName = ps.pipelines[ps.currentPipelineIndex]; 
  manifest.pipelineArray = localStorage.getItem(manifest.pipelineName); 
  manifest.pipes = [];

  let curPipe = -1;
  let pipe = await ps.pipeline.getNextPipe(curPipe);

  while (pipe) {
    try {
      let p = await zipFile(pipe);
      manifest.pipes.push(p);
    } catch(error) {
      console.error(`Failed to zip: ${error}`);
      break;
    }
    pipe = await ps.pipeline.getNextPipe(++curPipe);
  }
  zip.file("manifest.json", JSON.stringify(manifest, null, '\t'));
  let zippedFile = await zip.generateAsync({type:"blob"});
  return zippedFile;
}
// Download the current pipeline as a zip file. 
async function download() {
  if (runningPipe) {
    return;
  }
  let zipFile = await createZipFile();
  saveAs(zipFile, ps.pipelinePrettyName() + ".zip");
}

// Upload a zip file and load it as a pipeline.
async function upload(f) {
  var r = new FileReader();
  r.onload = async function () {
    let zip;
    try {
      zip = await JSZip.loadAsync(r.result)
    } catch(e) {
      console.log(e);
      running.style.display = "block";
      running.textContent = "Not a valid zip file";
      return;
    }
    let m;
    try {
      m = await zip.file("manifest.json").async("string");
    } catch(e) {
      console.log(e);
      running.style.display = "block";
      running.textContent = "Not a Valid pipeline file";
      return;
    }
    let manifest = JSON.parse(m);
    localStorage.setItem(manifest.pipelineName, manifest.pipelineArray);
    await manifest.pipes.forEach(async(p) => {
      await localforage.setItem(p.key + "-metadata", p.metadata);
      await p.metadata.files.forEach(async (file) => {
        let fc = await zip.file(file).async("arraybuffer");
        await localforage.setItem(file, fc);
      });
      await p.entries.forEach(async(e) => {
        let fc = await zip.file(e.fileName).async("string");
        await localforage.setItem(p.key + "-" + e.name, fc);
      });
    });
    await ps.addPipeline(manifest.pipelineName);
    running.textContent = "Loaded pipeline file successfully";
  }
  r.readAsArrayBuffer(f);
}

// Recalculate chunk size when zooming in or out.
window.onzoom = async function(e) {
  await ps.updateDisplayedPipe(await ps.pipeline.refreshCurrentPipe());
}
// detect resize
window.onresize = function(e) {
  var event = window.event || e;
  if(typeof(oldresize) === 'function' && !oldresize.call(window, event)) {
    return false;
  }
  if(typeof(window.onzoom) === 'function') {
    return window.onzoom.call(window, event);
  }
};

async function uploadToGoogle() {
  if (runningPipe) {
    return;
  }

  running.style.display = "block";
  running.textContent = "Creating Zip File";
  let zipFile = await createZipFile();
  let zipFileName = ps.pipelinePrettyName() + ".zip";

  running.textContent = "Signing into Google";
  if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
    gapi.auth2.getAuthInstance().signIn();
  }

	// Get the folder ID for 'io10' and store the zip in that.
	let folderName = "io10";
	let result = await gapi.client.drive.files.list({
			q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
			fields: 'nextPageToken, files(id, name)',
			spaces: 'drive',
	});
	let folder = result.result.files.filter(x => x.name === folderName);
	var folderId = folder.length?folder[0].id:0;
	// 'io10' folder doesn't exist: create it.
	if (!folderId) {
		var fileMetadata = {
			'name': 'io10',
			'mimeType': 'application/vnd.google-apps.folder'
		};
		let createResult = await gapi.client.drive.files.create({
			resource: fileMetadata,
			fields: 'id'
		});
		console.log('Folder Id: ', createResult);
		folderId = createResult.id;
	}

	// Store the zip file.
	var file = new Blob([zipFile], {type: 'application/zip'});
	var metadata = {
			'name': zipFileName, // Filename at Google Drive
			'mimeType': 'application/zip', // mimeType at Google Drive
			'parents': [folderId], // Folder ID at Google Drive
	};

  running.textContent = "Uploading to Google";
	var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
	var form = new FormData();
	form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
	form.append('file', file);

	fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
			method: 'POST',
			headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
			body: form,
	}).then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        running.textContent = `Saved '${zipFileName}' to Google Drive`;
        return response.json();
      } else {
        throw Error(response.statusText);
      }
  }).catch((error) => {
      running.textContent = `Error Saving '${zipFileName}' to Google Drive: ${error}`;
	});
}
