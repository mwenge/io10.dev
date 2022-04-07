const worker = new Worker("3rdparty/webR/worker.R.bin.js");

const callbacks = {};
let textOutput = "";

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
  data.output = textOutput;
  onSuccess(data);
};

const asyncRunR = (() => {
  let id = 0; // identify a Promise
  return (code, input) => {
    // the id could be generated more carefully
    id = (id + 1) % Number.MAX_SAFE_INTEGER;
    return new Promise((onSuccess) => {
      callbacks[id] = onSuccess;
      worker.postMessage({ action: 'exec', code: code, input: input, id: id });
    });
  };
})();

export { asyncRunR };
