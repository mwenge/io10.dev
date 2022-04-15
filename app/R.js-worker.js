let worker;
const callbacks = {};
setUpWorker();

function setUpWorker() {
  worker = new Worker("3rdparty/webR/worker.R.bin.js");
  worker.onmessage = (event) => {
    console.log("event data", event.data);
    if (event.data.progress) {
      return;
    }
    const { id, ...data } = event.data;
    const onSuccess = callbacks[id];
    console.log("onsuccess", onSuccess);
    if (!onSuccess) {
      return;
    }
    delete callbacks[id];
    onSuccess(data);
  };
}

function interruptExecution() {
  Object.keys(callbacks).forEach(function(id) {
    const onSuccess = callbacks[id];
    if (!onSuccess) {
      return;
    }
    delete callbacks[id];
    let data = {};
    data.error = "Cancelled";
    onSuccess(data);
  });
  worker.terminate();
  setUpWorker();
}

const asyncRunR = (() => {
  let id = 0; // identify a Promise
  return (code, input, files) => {
    // the id could be generated more carefully
    id = (id + 1) % Number.MAX_SAFE_INTEGER;
    return new Promise((onSuccess) => {
      callbacks[id] = onSuccess;
      worker.postMessage({ action: 'exec', code: code, input: input, files: files, id: id });
    });
  };
})();

export { asyncRunR, interruptExecution };
