import { getPipeline } from "./pipeline.js";

let savedPipelines = localStorage.getItem("pipelines");
if (!savedPipelines) {
  localStorage.setItem("pipelines", JSON.stringify(["Example Pipeline"]));
}
let pipelines = JSON.parse(localStorage.pipelines);
let pipeline = await getPipeline(pipelines[pipelines.length - 1]);
console.log(pipeline);

function setUpEditor() {
  // Add the command pane
  var commandsElm = document.createElement('textarea');
  commandsElm.textContent = pipeline.currentPipe().program;
  program.appendChild(commandsElm);
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // let selectedTheme = "default";
  // Use dark theme by default
  let selectedTheme = "3024-night";
  if (prefersDarkScheme.matches) {
    selectedTheme = "3024-night";
  }
  // Add syntax highlihjting to the textarea
  var editor = CodeMirror.fromTextArea(commandsElm, {
    mode: 'text/x-mysql',
    viewportMargin: Infinity,
    indentWithTabs: true,
    smartIndent: true,
    lineNumbers: true,
    matchBrackets: true,
    autofocus: true,
    theme: selectedTheme,
    extraKeys: {
      "Ctrl-Enter": determineLanguageAndRun,
      "Shift-Tab": false,
      "Ctrl-Space": "autocomplete",
    }
  });
  return editor;
}

import {setUpOutput} from "./output.js";
let editor = setUpEditor();
let outputWrapper = setUpOutput(output);
let inputWrapper = setUpOutput(input, "input from stdin");

import { asyncRun } from "./pyodide-py-worker.js";

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
    console.log("input", inputWrapper.getValue());
    const { results, error, output } = await asyncRun(editor.getValue(), inputWrapper.getValue(), context);
    if (output) {
      console.log("pyodideWorker return output: ", output);
      outputWrapper.getDoc().setValue(output);
    } else if (error) {
      console.log("pyodideWorker error: ", error);
      outputWrapper.getDoc().setValue(error);
    }
  } catch (e) {
    console.log(
      `Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`
    );
  }
}

