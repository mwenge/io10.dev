import {setUpEditor} from "./app/program.js";
import {setUpOutput} from "./app/output.js";
import * as ps from "./app/pipelines.js";
import { asyncRun } from "./app/pyodide-py-worker.js";
import { asyncRunJS } from "./app/duktape.js";
import { asyncRunSQL, asyncCreateTable } from "./app/sql.js-worker.js";

// Set up the editor.
const editor = setUpEditor(ps.pipeline.currentPipe().program());
// Set up the input and output panes.
const outputWrapper = setUpOutput(output, ps.pipeline.currentPipe().output());
const inputWrapper = setUpOutput(input, ps.pipeline.currentPipe().input(), true);
ps.setUpPanes(editor, inputWrapper, outputWrapper, determineLanguageAndRun, runPipeline);

// Update the syntax highlighting to suit the language being used.
// Detection is a bit off sometimes so we use workarounds.
setInterval(determineLanguage, 2000);
const guessLang = new GuessLang();
const cmLangs = {
  "*.py" : { lang: "*.py",  syntax: "text/x-python", run: evaluatePython },
  "*.sql" : { lang: "*.sql",  syntax: "text/x-mysql", run: evaluateSQL },
  "*.js" : { lang: "*.js",  syntax: "text/javascript", run: evaluateJS },
  "*.cs" : { lang: "*.js",  syntax: "text/javascript", run: evaluateJS },
  "*.ts" : { lang: "*.js",  syntax: "text/javascript", run: evaluateJS },
};
async function determineLanguage() {
  const result = await guessLang.runModel(editor.getValue());
  const fileType = (result.length) ? "*." + result[0].languageId : "";
  if (!(fileType in cmLangs)) { return null; }

  const lang = cmLangs[fileType];
  editor.setOption("mode", lang.syntax);
  if (ps.pipeline.lang() == lang.lang) return;
  ps.pipeline.updateLanguage(lang.lang);
  ps.updateAwesomeBar();
  return lang;
}

async function runPipeline() {
  // Determine what the language is and the run the script.
  async function run() {
    let lang = await determineLanguage();
    // Python is our default
    if (!lang) lang = cmLangs[ps.pipeline.lang()];
    console.log("Running as", lang);
    await lang.run();
  }
  let pipe = await ps.moveToFirstPipe();
  while (pipe) {
    try {
      await run();
    } catch(error) {
      console.error(`Failed to fetch: ${error}`);
      break;
    }
    pipe = await ps.nextPipe();
  }
}

// Determine what the language is and the run the script.
async function determineLanguageAndRun() {
  let lang = await determineLanguage();
  // Python is our default
  if (!lang) lang = cmLangs[ps.pipeline.lang()];
  console.log("Running as", lang);
  try {
    await lang.run();
  } catch(e) {
    console.error(`Failed to fetch 1: ${e}`);
  }
}

// Helper for running SQL
var enc = new TextEncoder(); // always utf-8
async function evaluateSQL() {
  let input = inputWrapper.getValue();
  let buffInput = enc.encode(input);

  // Drop the table if it already exists.
  let tableName = "input.tsv";
  await asyncRunSQL("DROP TABLE \"" + tableName + "\";");

  // Write the standard input to a TSV table first.
  const { vsvtable } = await asyncCreateTable(buffInput, tableName);

  // Load the files associated with the pipe to tables.
  let files = ps.pipeline.currentPipe().files();
  await Promise.all(files.map(async (f) => {
    await asyncRunSQL("DROP TABLE \"" + f + "\";");
  }));
  await Promise.all(files.map(async (f) => {
    let data = await localforage.getItem(f);
    await asyncCreateTable(new Uint8Array(data), f);
  }));

  // Now run the query against it.
  let program = editor.getValue();
  const { results, error } = await asyncRunSQL(program);

  // Convert the output into tab-separated rows.
  if (results) {
    // First the header row.
    let output = results[0].columns.map((e,i,a) => (e + (i == (a.length - 1) ? '\n' : '\t')));
    // Then the results row.
    output = output.concat(results[0].values.flatMap((e) => {
      return e.map((e,i,a) => (e + (i == (a.length - 1) ? '\n' : '\t')));
    }));
    output = output.join('');
    outputWrapper.updateContent(output);
    let updatedData = {
      program: program,
      input: input,
      output: output,
      files: files,
    }; 
    await ps.pipeline.updatePipeData(updatedData);
  }
  if (error) {
    console.log("sqlworker error: ", error);
    outputWrapper.updateContent(error);
    throw new Error("test error inside sql");
  }
}

// Helper for running Python
async function evaluatePython() {
  let input = inputWrapper.getValue();
  let program = editor.getValue();
  let files = ps.pipeline.currentPipe().files();
  const { results, error, output } = await asyncRun(program, input, files);
  if (output) {
    outputWrapper.updateContent(output);
    let updatedData = {
      program: program,
      input: input,
      output: output,
      files: files,
    }; 
    await ps.pipeline.updatePipeData(updatedData);
  }
  if (error) {
    console.log("pyodideWorker error: ", error);
    outputWrapper.updateContent(error);
    throw new Error("test error inside python");
  }
}

// Helper for running Javascript
async function evaluateJS() {
  let input = inputWrapper.getValue();
  let program = editor.getValue();
  let files = ps.pipeline.currentPipe().files();
  const { results, error, output } = await asyncRunJS(program);
  if (output) {
    outputWrapper.updateContent(output);
    let updatedData = {
      program: program,
      input: input,
      output: output,
      files: files,
    }; 
    await ps.pipeline.updatePipeData(updatedData);
  }
  if (error) {
    console.log("jsWorker error: ", error);
    outputWrapper.updateContent(error +'\n');
    throw new Error("test error inside js");
  }
}

// Allow the user to add a file. Doing so associates the file with the current
// pipe only. 
var fileUpload = document.getElementById('file-upload');
fileUpload.onchange = function () {
	var f = fileUpload.files[0];
  if (!f) { return; }
	var r = new FileReader();
	r.onload = async function () {
    await localforage.setItem(f.name, r.result);
    await ps.pipeline.currentPipe().addFile(f.name);
    ps.updateAwesomeBar();
	}
	r.readAsArrayBuffer(f);
}
