const worker = new Worker("3rdparty/sql.js/worker.sql-wasm.js");
import { getDataAndSeparator } from "./delimiters.js";
// Open a database
worker.postMessage({ action: 'open' });

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

const asyncRunSQL = (() => {
  let id = 0; // identify a Promise
  return (sql) => {
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
export { asyncCreateTable, asyncRunSQL };
