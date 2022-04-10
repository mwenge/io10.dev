function setUpEditor(content) {
  // Add the command pane
  var commandsElm = document.createElement('textarea');
  commandsElm.textContent = content;
  program.appendChild(commandsElm);
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // let selectedTheme = "default";
  // Use dark theme by default
  let selectedTheme = "blackboard";
  if (prefersDarkScheme.matches) {
    selectedTheme = "blackboard";
  }
  // Add syntax highlihjting to the textarea
  var editor = CodeMirror.fromTextArea(commandsElm, {
    mode: 'text/x-mysql',
    viewportMargin: Infinity,
    indentWithTabs: true,
    scrollbarStyle: 'simple',
    smartIndent: true,
    lineNumbers: true,
    matchBrackets: true,
    autofocus: true,
    theme: selectedTheme,
  });
  return editor;
}

export {setUpEditor};
