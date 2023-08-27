function createKeyString(ev) {
  let keyText = "";
  keyText += (ev.ctrlKey ? 'Ctrl-' : '');
  keyText += (ev.altKey ? 'Alt-' : '');
  keyText += ev.key;
  return keyText;
}

export function setUpShortcuts(editor, inputWrapper, outputWrapper, keyMap) {
  function maybeExecuteCommand(event) {
    // If the keystrokes match a command, run it.
    const keyText = createKeyString(event);
    if (keyText in keyMap) {
      keyMap[keyText]();
      event.preventDefault();
      event.stopPropagation();
    }
  }
  program.addEventListener('keydown', (event) => {
    // Ignore the event if we're not navigating the cell elements.
    let w = editor.getWrapperElement();
    if (w.className != document.activeElement.className) {
      return;
    }
    const keyName = event.key;
    if (keyName == 'Enter' && !event.ctrlKey) {
      event.preventDefault();
      event.stopPropagation();
      editor.focus();
      return;
    }
    if (keyName == 'ArrowRight' && !event.altKey) {
      event.preventDefault();
      event.stopPropagation();
      var n = output.children[1];
      n.focus();
      return;
    }
    if (keyName == 'Escape') {
      return;
    }
    maybeExecuteCommand(event);
  });

  output.addEventListener('keydown', (event) => {
    // Ignore the event if we're not navigating the cell elements.
    let w = outputWrapper.editor().getWrapperElement();
    if (w.className != document.activeElement.className) {
      return;
    }
    const keyName = event.key;
    if (keyName == 'Enter' && !event.ctrlKey) {
      event.preventDefault();
      event.stopPropagation();
      outputWrapper.editor().focus();
      return;
    }
    if (keyName == 'ArrowLeft' && !event.altKey) {
      event.preventDefault();
      event.stopPropagation();
      var n = program.children[1];
      n.focus();
      return;
    }

    if (keyName == 'Escape') {
      return;
    }
    maybeExecuteCommand(event);
  });
}
