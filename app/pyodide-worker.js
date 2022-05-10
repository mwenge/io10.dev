// webworker.js

// Setup your project to serve `py-worker.js`. You should also serve
// `pyodide.js`, and all its associated `.asm.js`, `.data`, `.json`,
// and `.wasm` files as well:
importScripts("https://cdn.jsdelivr.net/pyodide/v0.19.1/full/pyodide.js");
importScripts("../3rdparty/localforage.min.js");

let stdinIterator = null;
function* getStdinLine(stdin) {
  stdin = stdin.split('\n');
  while (stdin.length > 0) {
    yield stdin.shift();
  }
}

async function loadFile(f) {
  let data = await localforage.getItem(f);
  await self.pyodide.FS.writeFile(f, new Uint8Array(data));
}

let stdout;
async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.19.1/full/",
    stdout: (text) => {
      if (text == "Python initialization complete")
        return;
      stdout += text + '\n';
    },
    stdin: () => { return stdinIterator.next().value; },
  });
}
let pyodideReadyPromise = loadPyodideAndPackages();

self.onmessage = async (event) => {
  // make sure loading is done
  await pyodideReadyPromise;

	// Handle Ctrl-C
	if (event.data.cmd === "setInterruptBuffer") {
		self.pyodide.setInterruptBuffer(event.data.interruptBuffer);
		return;
	}

  // Don't bother yet with this line, suppose our API is built in such a way:
  const { id, python, stdin, files } = event.data;
  stdout = '';
  // Load all the files, and wait until they're all loaded.
  await Promise.all(files.map(async (f) => {
    await loadFile(f);
  }));
  stdinIterator = getStdinLine(stdin);
  // Now is the easy part, the one that is similar to working in the main thread:
  try {
    await self.pyodide.loadPackagesFromImports(python);
    let results = await self.pyodide.runPythonAsync(python);

    // Make sure the stdout transfer is 'zero copy'
    let enc = new TextEncoder();
    let stdoutBuffer = enc.encode(stdout)
    self.postMessage(stdoutBuffer.buffer, [stdoutBuffer.buffer] );

    // Post the results.
    self.postMessage({ results, id });
  } catch (error) {
    self.postMessage({ error: error.message, id });
  }
};
