let worker;
const callbacks = {};
let output;
setUpWorker();
let outputWrapper;

function setUpWorker() {
  worker = new Worker("3rdparty/awk/awk_web_worker.js");
  worker.onmessage = (event) => {
    console.log("event data", event.data);
    if (event.data.event == "notification") {
      outputWrapper.editor().getDoc().setValue("Doing: " + event.data.type_name);
      return;
    }
    if (event.data.event == "stdout") {
      output += event.data.stdout_text;
      return;
    }
    const { id, ...data } = event.data;
    const onSuccess = callbacks[id];
    console.log("onsuccess", onSuccess);
    if (!onSuccess) {
      return;
    }
    delete callbacks[id];
    data.output = output;
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

const asyncRunAwk = (() => {
  let id = 0; // identify a Promise
  return (code, input, files, o) => {
    // the id could be generated more carefully
    output = "";
    outputWrapper = o;
    id = (id + 1) % Number.MAX_SAFE_INTEGER;
    return new Promise((onSuccess) => {
      callbacks[id] = onSuccess;
      worker.postMessage({ 'type': 'run_awk', 'awk_program': code, 'input_data': input, files: files, 'id': id });
    });
  };
})();

export { asyncRunAwk, interruptExecution };
