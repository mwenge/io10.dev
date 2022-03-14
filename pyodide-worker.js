// webworker.js

// Setup your project to serve `py-worker.js`. You should also serve
// `pyodide.js`, and all its associated `.asm.js`, `.data`, `.json`,
// and `.wasm` files as well:
importScripts("3rdparty/pyodide/pyodide.js");

let stdinIterator = null;
function* getStdinLine(stdin) {
  stdin = stdin.split('\n');
  while (stdin.length > 0) {
    yield stdin.shift();
  }
}

async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide({
    indexURL: "3rdparty/pyodide",
    stdout: (text) => {self.postMessage({text:text});},
    stdin: () => { return stdinIterator.next().value; },
  });
  await self.pyodide.loadPackage(["numpy", "pytz"]);
}
let pyodideReadyPromise = loadPyodideAndPackages();

self.onmessage = async (event) => {
  // make sure loading is done
  await pyodideReadyPromise;
  // Don't bother yet with this line, suppose our API is built in such a way:
  const { id, python, stdin, ...context } = event.data;
  stdinIterator = getStdinLine(stdin);
  // The worker copies the context in its own "memory" (an object mapping name to values)
  for (const key of Object.keys(context)) {
    self[key] = context[key];
  }
  // Now is the easy part, the one that is similar to working in the main thread:
  try {
    await self.pyodide.loadPackagesFromImports(python);
    console.log("running", python);
    let results = await self.pyodide.runPythonAsync(python);
    self.postMessage({ results, id });
  } catch (error) {
    self.postMessage({ error: error.message, id });
  }
};
