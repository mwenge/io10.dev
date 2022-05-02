// Breaks the content of the file into `contentLength` chunks
// that we can navigate back and forth through. Avoids displaying
// large files all at once.
function contentChunker(content, chunkLength) {
  function* chunkContent(c) {
    let i = 0;
    while (i < c.length) {
      let p = i;
      let chunk = '';
      for (var j = 0; j < chunkLength; j++) {
        let p = i;
        i = c.indexOf('\n', p);
        if (i < 0) {
          chunk += c.slice(p);
          i = c.length;
          break;
        }
        i++;
        chunk += c.slice(p,i);
      }
      yield chunk;
    }
  }
  let chunkIt = chunkContent(content, chunkLength);
  let chunkedContent = [chunkIt.next().value];
  let current = 0;
  const chunkIterator = {
    first: function() {
      current = [0];
      return chunkedContent[current];
    },
    next: function() {
      if (current < chunkedContent.length - 1) {
        return chunkedContent[++current];
      }
      let {value, done} = chunkIt.next();
      if (done) return chunkedContent[current];
      current++;
      chunkedContent.push(value);
      return value;
    },
    previous: function() {
      if (!current) return chunkedContent[current];
      current--;
      return chunkedContent[current];
    },
    currentChunk: function() {
      return chunkedContent[current];
    },
    currentFirstLine: function() {
      return current ? current * chunkLength : 1;
    },
  };
  return chunkIterator;
}

function calculateChunkLength() {
  let ph = document.getElementById("output").clientHeight;
  let lh = document.getElementsByClassName("CodeMirror-line")[0].clientHeight;
  let chunkLength = ph / (lh);
  return parseInt(chunkLength, 10) - 1;
}
// Set up the input/output pane.
function setUpOutput(div, c = "Output appears here", editable) {
  let content = c ? c : "";
  let isEditable = editable;
  let chunkLength = calculateChunkLength();
  let chunker = contentChunker(content, chunkLength);
  let commandsElm = document.createElement('textarea');
  if (isEditable) {
    commandsElm.textContent = content;
  } else {
    commandsElm.textContent = chunker.currentChunk();
  }

  div.appendChild(commandsElm);

  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  // let selectedTheme = "default";
  // Use dark theme by default
  let selectedTheme = "io";
  if (prefersDarkScheme.matches) {
    selectedTheme = "io";
  }

  function first() {
    if (isEditable) return;
    let currentChunk = chunker.first();
    if (!currentChunk) return;
    editor.setValue(currentChunk);
    editor.setOption("firstLineNumber", chunker.currentFirstLine());
  }
  function next() {
    if (isEditable) return;
    let currentChunk = chunker.next();
    if (!currentChunk) return;
    editor.setValue(currentChunk);
    editor.setOption("firstLineNumber", chunker.currentFirstLine());
  }
  function previous() {
    if (isEditable) return;
    let currentChunk = chunker.previous();
    if (!currentChunk) return;
    editor.setValue(currentChunk);
    editor.setOption("firstLineNumber", chunker.currentFirstLine());
  }
  // Add syntax highlihjting to the textarea
  let editor = CodeMirror.fromTextArea(commandsElm, {
    viewportMargin: Infinity,
    indentWithTabs: true,
    smartIndent: true,
    lineNumbers: true,
    lineWrapping: false,
    matchBrackets: true,
    scrollbarStyle: 'simple',
    theme: selectedTheme,
    extraKeys: {
      "Shift-Tab": false,
      "Ctrl-Space": "autocomplete",
      "Ctrl-Home": first,
      "PageDown": next,
      "PageUp": previous,
    }
  });

  const output = {
    editor: function() {
      return editor;
    },
    getDoc: function() {
      return editor.getDoc();
    },
    getValue: function() {
      if (isEditable) {
        return editor.getValue();
      }
      return content;
    },
    updateContent: function(c, editable=false) {
      let chunkLength = calculateChunkLength();
      content = c;
      isEditable = editable;
      if (isEditable) {
        editor.setValue(c);
        return;
      }
      chunker = contentChunker(c, chunkLength);
      let currentChunk = chunker.currentChunk();
      if (!currentChunk) currentChunk = "";
      editor.setValue(currentChunk);
      editor.setOption("firstLineNumber", chunker.currentFirstLine());
    },
  }
  return output;
}

export {setUpOutput, contentChunker};
