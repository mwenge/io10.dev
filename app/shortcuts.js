export function setUpShortcuts(editor, inputWrapper, outputWrapper) {
  program.addEventListener('keydown', (event) => {
    // Ignore the event if we're not navigating the cell elements.
    let w = editor.getWrapperElement();
    if (w.className != document.activeElement.className) {
      return;
    }
    const keyName = event.key;
    if (keyName == 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      editor.focus();
    }
    if (keyName == 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();
      var n = input.children[1];
      n.focus();
    }
  });

  input.addEventListener('keydown', (event) => {
    // Ignore the event if we're not navigating the cell elements.
    let w = inputWrapper.editor().getWrapperElement();
    if (w.className != document.activeElement.className) {
      return;
    }
    const keyName = event.key;
    if (keyName == 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      inputWrapper.editor().focus();
    }
    if (keyName == 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();
      var n = output.children[1];
      n.focus();
    }
    if (keyName == 'ArrowLeft') {
      event.preventDefault();
      event.stopPropagation();
      var n = program.children[1];
      n.focus();
    }
  });

  output.addEventListener('keydown', (event) => {
    // Ignore the event if we're not navigating the cell elements.
    let w = outputWrapper.editor().getWrapperElement();
    if (w.className != document.activeElement.className) {
      return;
    }
    const keyName = event.key;
    if (keyName == 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      outputWrapper.editor().focus();
    }
    if (keyName == 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      var n = input.children[1];
      n.focus();
    }
    if (keyName == 'ArrowLeft') {
      event.preventDefault();
      event.stopPropagation();
      var n = program.children[1];
      n.focus();
    }
  });
}
