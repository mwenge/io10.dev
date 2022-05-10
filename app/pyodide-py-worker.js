const pyodideWorker = new Worker("./app/pyodide-worker.js");

const callbacks = {};
let textOutput = "";

let interruptBuffer = new Uint8Array(1);
if (crossOriginIsolated) {
 	console.log("cross origin isolated");
	interruptBuffer = new Uint8Array(new SharedArrayBuffer(1));
	pyodideWorker.postMessage({ cmd: "setInterruptBuffer", interruptBuffer });
}

function interruptPythonExecution() {
	interruptBuffer[0] = 2;
}

pyodideWorker.onmessage = (event) => {
  // Stdout comes in as an ArrayBuffer
  if (event.data instanceof ArrayBuffer) {
    let dec = new TextDecoder();
    textOutput = dec.decode(event.data)
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

export { asyncRun, interruptPythonExecution };
