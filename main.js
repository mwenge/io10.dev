import {setUpEditor} from "./app/program.js";
import {setUpOutput} from "./app/output.js";
import * as ps from "./app/pipelines.js";
import { asyncRun } from "./app/pyodide-py-worker.js";

// Set up the editor.
const editor = setUpEditor(ps.pipeline.currentPipe().program());
// Set up the input and output panes.
const outputWrapper = setUpOutput(output, ps.pipeline.currentPipe().output());
const inputWrapper = setUpOutput(input, ps.pipeline.currentPipe().input(), true);
ps.setUpPanes(editor, inputWrapper, outputWrapper, determineLanguageAndRun);

const context = {
  A_rank: [0.8, 0.4, 1.2, 3.7, 2.6, 5.8],
};

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
  ps.pipeline.updateLanguage(fileType);
  return lang;
}

async function determineLanguageAndRun() {
  let lang = await determineLanguage();
  // Python is our default
  if (!lang) lang = cmLangs["*.py"];
  console.log("Running as", lang);
  const result = await lang.run();
}

async function evaluateSQL() {
}

async function evaluatePython() {
  try {
    let input = inputWrapper.getValue();
    console.log("input", input);
    let program = editor.getValue();
    const { results, error, output } = await asyncRun(program, input, context);
    if (output) {
      outputWrapper.updateContent(output);
      let updatedData = {
        program: program,
        input: input,
        output: output,
      }; 
      await ps.pipeline.updatePipeData(updatedData);
    } else if (error) {
      console.log("pyodideWorker error: ", error);
      outputWrapper.updateContent(error);
    }
  } catch (e) {
    console.log(
      `Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`
    );
  }
}

