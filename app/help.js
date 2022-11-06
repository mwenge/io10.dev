const tips = [
"<div class=\"lozenge\">Tip: <kbd class=\"ctrl\">Ctrl</kbd>+<kbd class=\"enter\">Enter</kbd> Run Current Step</div>",
"<div class=\"lozenge lozenge-alt\">Tip: <kbd class=\"alt\">Alt</kbd>+<kbd>&#8592;/&#8594;</kbd> Previous/Next Step</div>",
"<div class=\"lozenge lozenge-alt\">Tip: <kbd class=\"alt\">Alt</kbd>+<kbd>A/B</kbd> Insert Step After/Before</div>",
"<div class=\"lozenge lozenge-alt\">Tip: <kbd class=\"ctrl\">Ctrl</kbd>+<kbd>D</kbd> Interrupt Execution</div>",
"<div class=\"lozenge lozenge-alt\">Tip: <kbd class=\"alt\">Alt</kbd>+<kbd>R</kbd> Run Pipeline</div>",
"<div class=\"lozenge lozenge-alt\">Tip: <kbd class=\"ctrl\">Ctrl</kbd>+<kbd>O</kbd> Add File or Load Saved Pipeline</div>",
"<div class=\"lozenge lozenge-alt\">Tip: <kbd class=\"ctrl\">Ctrl</kbd>+<kbd>S</kbd> Save Pipeline as Zip File</div>",
"<div class=\"lozenge lozenge-alt\">Tip: <kbd class=\"alt\">Alt</kbd>+<kbd>&#8595;/&#8593;</kbd> Previous/Next Pipeline</div>",
"<div class=\"lozenge\">Tip: <kbd class=\"alt\">Alt</kbd>+<kbd>C</kbd> Delete Current Step</div>",
"<div class=\"lozenge\">Tip: <kbd class=\"alt\">Alt</kbd>+<kbd>Q</kbd> Delete Pipeline</div>",
];

let curTip = 0;
help.innerHTML = tips[0];
function getNextTip() {
  curTip++;
  help.innerHTML = tips[curTip % tips.length];
}

document.addEventListener('keydown', (event) => {
  if (!event.altKey && !event.ctrlKey) {
    return;
  }
  if (['Alt', 'Control'].includes(event.key)) {
    return;
  }
  getNextTip();
});

