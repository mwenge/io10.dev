import { getPipeline } from "./pipeline.js";
import { updatePipelineOnAwesomeBar } from "./awesomebar-pipeline.js";
import {setUpEditor} from "./program.js";
import {setUpOutput} from "./output.js";
import { asyncRun } from "./pyodide-py-worker.js";

let savedPipelines = localStorage.getItem("pipelines");
if (!savedPipelines) {
  localStorage.setItem("pipelines", JSON.stringify(["New Pipeline 1"]));
  localStorage.setItem("pipelinePrettyNames", JSON.stringify(["New Pipeline 1"]));
}
let pipelines = JSON.parse(localStorage.pipelines);
let pipelinePrettyNames = JSON.parse(localStorage.pipelinePrettyNames);
let currentPipelineIndex = pipelines.length - 1;
let pipeline = await getPipeline(pipelines[currentPipelineIndex]);
updatePipelineOnAwesomeBar(pipeline.currentPipeline(),
  pipeline.currentPipeIndex(),
  pipelinePrettyNames[currentPipelineIndex]); 

function updatePipelinePrettyName(name) {
  pipelinePrettyNames[currentPipelineIndex] = name;
  localStorage.setItem("pipelinePrettyNames", JSON.stringify(pipelinePrettyNames));
  updatePipelineOnAwesomeBar(pipeline.currentPipeline(),
    pipeline.currentPipeIndex(),
    pipelinePrettyNames[currentPipelineIndex]); 
};
document.getElementById("pipeline-name").addEventListener('keydown', (event) => {
  const keyName = event.key;
  if (keyName == 'Enter') {
    event.preventDefault();
    event.stopPropagation();
    updatePipelinePrettyName(event.target.textContent);
    event.target.blur();
  }
});

// Helper functions to navigate pipes
function updateDisplayedPipe(pipe) {
  if (!pipe) { return; }
  editor.getDoc().setValue(pipe.program());
  inputWrapper.updateContent(pipe.input(), pipeline.currentPipeIndex() == 0);
  outputWrapper.updateContent(pipe.output());
  updatePipelineOnAwesomeBar(pipeline.currentPipeline(),
    pipeline.currentPipeIndex(),
    pipelinePrettyNames[currentPipelineIndex]); 
}
async function insertBefore() {
  let pipe = await pipeline.insertBefore();
  updateDisplayedPipe(pipe);
}
async function insertAfter() {
  let pipe = await pipeline.insertAfter();
  updateDisplayedPipe(pipe);
}
async function previousPipe() {
  let pipe = await pipeline.moveToPreviousPipe();
  updateDisplayedPipe(pipe);
}
async function nextPipe() {
  let pipe = await pipeline.moveToNextPipe();
  updateDisplayedPipe(pipe);
}

// Set up the editor.
const editor = setUpEditor(pipeline.currentPipe().program());
editor.setOption("extraKeys", {
      "Ctrl-Enter": determineLanguageAndRun,
      "Alt-Right": nextPipe,
      "Alt-Left": previousPipe,
      "Alt-A": insertAfter,
      "Alt-B": insertBefore,
      "Shift-Tab": false,
      "Ctrl-Space": "autocomplete",
    });

// Set up the input and output panes.
const outputWrapper = setUpOutput(output, pipeline.currentPipe().output());
const inputWrapper = setUpOutput(input, pipeline.currentPipe().input(), true);

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
  pipeline.updateLanguage(fileType);
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
      await pipeline.updatePipeData(updatedData);
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

