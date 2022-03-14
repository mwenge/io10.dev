
function setUpOutput(div, content = "Output appears here") {
  // Add the command pane
  var commandsElm = document.createElement('textarea');
  commandsElm.textContent = content;
  div.appendChild(commandsElm);
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
    theme: selectedTheme,
    extraKeys: {
      "Shift-Tab": false,
      "Ctrl-Space": "autocomplete",
    }
  });
  return editor;
}

export {setUpOutput};
