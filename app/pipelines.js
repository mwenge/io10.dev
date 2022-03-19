import { getPipeline } from "./pipeline.js";
import { updatePipelineOnAwesomeBar } from "./awesomebar-pipeline.js";

// Initialize the pipelines if necessary.
let savedPipelines = localStorage.getItem("pipelines");
if (!savedPipelines) {
  localStorage.setItem("pipelines", JSON.stringify(["New Pipeline 1"]));
  localStorage.setItem("pipelinePrettyNames", JSON.stringify(["New Pipeline 1"]));
}
let pipelines = JSON.parse(localStorage.pipelines);
let pipelinePrettyNames = JSON.parse(localStorage.pipelinePrettyNames);
let currentPipelineIndex = pipelines.length - 1;
export let pipeline = await getPipeline(pipelines[currentPipelineIndex]);

updatePipelineOnAwesomeBar(pipeline.currentPipeline(),
  pipeline.currentPipeIndex(),
  pipelinePrettyNames[currentPipelineIndex]); 

// Set up the editor and input and output panes.
let editor = null;
let inputWrapper = null;
let outputWrapper = null;
export function setUpPanes(e, i, o, determineLanguageAndRun) {
  editor = e;
  inputWrapper = i;
  outputWrapper = o;
  editor.setOption("extraKeys", {
        "Ctrl-Enter": determineLanguageAndRun,
        "Alt-Right": nextPipe,
        "Alt-Left": previousPipe,
        "Alt-A": insertAfter,
        "Alt-B": insertBefore,
        "Shift-Tab": false,
        "Ctrl-Space": "autocomplete",
      });
}

// Handle changes to the current pipeline's pretty name.
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

