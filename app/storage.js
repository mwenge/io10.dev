let suffices = ["-program", "-input", "-output", "-metadata"];
let zip = (...rows) => [...rows[0]].map((_,c) => rows.map(row => row[c]));
let cachedData = new Map();
export async function getData(id) {
  if (cachedData.has(id+"-program")) {
    let p = cachedData.get(id+"-program");
    let i = cachedData.get(id+"-input");
    let o = cachedData.get(id+"-output");
    let m = cachedData.get(id+"-metadata");
    return {files: m.files, lang:m.lang, program:p, input: i, output: o};
  }
  let metadata = await localforage.getItem(id+"-metadata");
  if (!metadata) {
    return null;
  }
  cachedData.set(id+"-metadata", metadata);
  let program = await localforage.getItem(id+"-program");
  cachedData.set(id+"-program", program);
  let input = await localforage.getItem(id+"-input");
  cachedData.set(id+"-input", input);
  let output = await localforage.getItem(id+"-output");
  cachedData.set(id+"-output", output);
  return {...metadata, program: program, input: input, output: output};
}
export function getDoc(id) {
  if (cachedData.has(id+"-doc")) {
    return cachedData.get(id+"-doc");
  }
  return null;
}

// Intentionally fire and forget.
export async function setData(id, data) {
  setMetadata(id, { files: data.files, lang: data.lang });
  setProgram(id, data.program);
  setOutput(id, data.output);
}
export async function setMetadata(id, p) {
  cachedData.set(id+"-metadata", p);
  localforage.setItem(id+"-metadata", p);
}
export async function setProgram(id, p, doc) {
  cachedData.set(id+"-program", p);
  cachedData.set(id+"-doc", doc);
  localforage.setItem(id+"-program", p);
}
export async function setInput(id, p) {
  cachedData.set(id+"-input", p);
  localforage.setItem(id+"-input", p);
}
export async function setOutput(id, p) {
  cachedData.set(id+"-output", p);
  localforage.setItem(id+"-output", p);
}

// Intentionally fire and forget.
export async function deleteData(id, files) {
  let slots = zip(Array(suffices.length).fill(id), suffices);
  slots.forEach(id => cachedData.delete(id.join('')));
  slots.forEach(id => localforage.removeItem(id.join('')));
  if (files) files.forEach(id => localforage.removeItem(id));
}

