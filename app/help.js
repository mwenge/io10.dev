const keyboard_shortcuts = [
	['Ctrl', 'Enter', 'Run Current Step'],
	['Alt', '&#8592;/&#8594;', 'Previous/Next Step'],
	['Alt', 'R', 'Run Pipeline'],
	['Alt', 'A/B', 'Insert Step After/Before'],
	['Ctrl', 'O', 'Load File'],
	['Alt', '&#8595;/&#8593;', 'Previous/Next Pipeline'],
	['Alt', 'C', 'Delete Current Step'],
	['Alt', 'D', 'Delete Pipeline'],
	['Ctrl', 'D', 'Interrupt Exection'],
	['Ctrl', 'O', 'Load Pipeline from Zip Fie'],
	['Ctrl', 'S', 'Save Pipeline as Zip Fie'],
];

const tips = [
"<div class=\"lozenge\">Tip: <kbd class=\"ctrl\">Ctrl</kbd>+<kbd class=\"enter\">Enter</kbd> Run Current Step</div>",
"<div class=\"lozenge \">Tip: <kbd class=\"alt\">Alt</kbd>+<kbd>&#8592;/&#8594;</kbd> Previous/Next Step</div>",
"<div class=\"lozenge \">Tip: <kbd class=\"alt\">Alt</kbd>+<kbd>R</kbd> Run Pipeline</div>",
"<div class=\"lozenge \">Tip: <kbd class=\"alt\">Alt</kbd>+<kbd>A/B</kbd> Insert Step After/Before</div>",
"<div class=\"lozenge \">Tip: <kbd class=\"ctrl\">Ctrl</kbd>+<kbd>O</kbd> Load File</div>",
"<div class=\"lozenge \">Tip: <kbd class=\"alt\">Alt</kbd>+<kbd>&#8595;/&#8593;</kbd> Previous/Next Pipeline</div>",
"<div class=\"lozenge\">Tip: <kbd class=\"alt\">Alt</kbd>+<kbd>C</kbd> Delete Current Step</div>",
"<div class=\"lozenge\">Tip: <kbd class=\"alt\">Alt</kbd>+<kbd>Q</kbd> Delete Pipeline</div>",
"<div class=\"lozenge \">Tip: <kbd class=\"ctrl\">Ctrl</kbd>+<kbd>D</kbd> Interrupt Execution</div>",
"<div class=\"lozenge \">Tip: <kbd class=\"ctrl\">Ctrl</kbd>+<kbd>O</kbd> Load Pipeline</div>",
"<div class=\"lozenge \">Tip: <kbd class=\"ctrl\">Ctrl</kbd>+<kbd>S</kbd> Save Pipeline as Zip File</div>",
"<div class=\"lozenge\">Tip: Click on pipeline name to change it.</div>",
];


const help_menu = 
"<div class=\"lozenge\"><kbd class=\"enter\">F1</kbd> Help</div>";

help.innerHTML = ''
tips.slice(0,7).forEach(tip => {
  help.innerHTML += tip.replace(/Tip:/g, '');
});
help.innerHTML += help_menu;


[help, helppanel].forEach(elem => {
  elem.addEventListener("click", function(e) {
    if (helppanel.style.display == 'block') {
      helppanel.style.display = 'none'
    } else {
      helppanel.style.display = 'block'
    }
  });
});


