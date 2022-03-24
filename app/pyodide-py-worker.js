const pyodideWorker = new Worker("./app/pyodide-worker.js");

const callbacks = {};
let textOutput = "";

pyodideWorker.onmessage = (event) => {
  if (event.data.text) {
      textOutput += event.data.text + '\n';
    return;
  }
  const { id, ...data } = event.data;
  const onSuccess = callbacks[id];
  if (!onSuccess) {
    return;
  }
  delete callbacks[id];
  data.output = textOutput;
  onSuccess(data);
};

const asyncRun = (() => {
  let id = 0; // identify a Promise
  return (script, stdin, files) => {
    // the id could be generated more carefully
    id = (id + 1) % Number.MAX_SAFE_INTEGER;
    return new Promise((onSuccess) => {
      textOutput = "";
      callbacks[id] = onSuccess;
      pyodideWorker.postMessage({
        files: files,
        python: script,
        stdin: stdin,
        id,
      });
    });
  };
})();

export { asyncRun };
