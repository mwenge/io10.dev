import {setUpEditor} from "./app/program.js";
import {setUpOutput} from "./app/output.js";
import * as ps from "./app/pipelines.js";
import { asyncRun } from "./app/pyodide-py-worker.js";
import { asyncRunSQL, asyncCreateTable } from "./app/sql.js-worker.js";

// Set up the editor.
const editor = setUpEditor(ps.pipeline.currentPipe().program());
// Set up the input and output panes.
const outputWrapper = setUpOutput(output, ps.pipeline.currentPipe().output());
const inputWrapper = setUpOutput(input, ps.pipeline.currentPipe().input(), true);
ps.setUpPanes(editor, inputWrapper, outputWrapper, determineLanguageAndRun);

// Update the syntax highlighting to suit the language being used.
setInterval(determineLanguage, 10000);
const guessLang = new GuessLang();
const cmLangs = {
  "*.py" : { syntax: "text/x-python", run: evaluatePython },
  "*.sql" : { syntax: "text/x-mysql", run: evaluateSQL },
};
async function determineLanguage() {
  const result = await guessLang.runModel(editor.getValue());
  const fileType = (result.length) ? "*." + result[0].languageId : "";
  if (!(fileType in cmLangs)) { return null; }

  const lang = cmLangs[fileType];
  editor.setOption("mode", lang.syntax);
  if (ps.pipeline.lang() == lang) return;
  ps.pipeline.updateLanguage(fileType);
  ps.updateAwesomeBar();
  return lang;
}

// Determine what the language is and the run the script.
async function determineLanguageAndRun() {
  let lang = await determineLanguage();
  // Python is our default
  if (!lang) lang = cmLangs["*.py"];
  console.log("Running as", lang);
  const result = await lang.run();
}

// Helper for running SQL
var enc = new TextEncoder(); // always utf-8
async function evaluateSQL() {
  try {
    let input = inputWrapper.getValue();
    let buffInput = enc.encode(input);

    // Drop the table if it already exists.
    let tableName = ps.pipeline.currentPipe().id() + ".tsv";
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
      }; 
      await ps.pipeline.updatePipeData(updatedData);
    }
    if (error) {
      console.log("sqlworker error: ", error);
      outputWrapper.updateContent(error);
    }
  } catch (e) {
    console.log(
      `Error in sqlworker at ${e.filename}, Line: ${e.lineno}, ${e.message}`
    );
  }
}

// Helper for running Python
async function evaluatePython() {
  try {
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
    }
  } catch (e) {
    console.log(
      `Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`
    );
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
    ps.pipeline.currentPipe().addFile(f.name);
	}
	r.readAsArrayBuffer(f);
}
