let worker;
import { getDataAndSeparator } from "./delimiters.js";

const callbacks = {};
let textOutput = "";
setUpWorker();

function setUpWorker() {
  worker = new Worker("3rdparty/sql.js/worker.sql-wasm.js");
  // Open a database
  worker.postMessage({ action: 'open' });
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

const asyncRunSQL = (() => {
  let id = 0; // identify a Promise
  return (sql) => {
    console.log(worker);
    // the id could be generated more carefully
    id = (id + 1) % Number.MAX_SAFE_INTEGER;
    return new Promise((onSuccess) => {
      callbacks[id] = onSuccess;
      worker.postMessage({ action: 'exec', sql: sql, id: id });
    });
  };
})();

const asyncCreateTable = (() => {
  let id = 0; // identify a Promise
  return (data, fileName) => {
    // the id could be generated more carefully
    id = (id + 1) % Number.MAX_SAFE_INTEGER;
    // FIXME: this interface is awful.
    let [[[d,f]], sep, header] = getDataAndSeparator(data, fileName);
    return new Promise((onSuccess) => {
      callbacks[id] = onSuccess;
      worker.postMessage({
        action: 'createVSVTable',
        buffer: d,
        fileName: fileName,
        separator: sep,
        quick: true,
        id: id,
        header: header,
      });
    });
  };
})();
export { asyncCreateTable, asyncRunSQL, interruptExecution };
