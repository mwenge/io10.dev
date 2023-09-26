// A pipe is a program/script with its input and output. A sequence of pipes
// make up a pipeline.
import * as storage from "./storage.js";
import * as tips from "./tips.js";
const defaultData = 
  {
    program: `
import sys
w = sys.stdin.readline();
print("colid" + '\t' + "colval")
for i in range(0,20):
  print(str(1) + '\t' + w.strip() +str(i))
`,
    input: ``,
    output: '',
    lang: "*.py",
  };

async function getPipe(prevID, id) {
  let data = await storage.getData(id);
  if (!data) {
    data = {};
    let randomTip = Math.floor(Math.random() * tips.tips.length);
    data.program = tips.tips[randomTip] + defaultData.program;
    data.input = defaultData.input;
    data.output = defaultData.output;
    data.lang = defaultData.lang;
    data.files = [];
    data.generatedFiles = [];
    storage.setData(id, data);
  }
  const rangeIterator = {
    program: function() {
      return data.program;
    },
    doc: function() {
      return storage.getDoc(id);
    },
    input: async function() {
      if (!prevID) {
        return data.input;
      }
      let o = await storage.getData(prevID);
      return o.output;
    },
    output: function() {
      return data.output;
    },
    lang: function() {
      return data.lang;
    },
    files: function() {
      return data.files ? data.files : [];
    },
    generatedFiles: function() {
      return data.generatedFiles ? data.generatedFiles : [];
    },
    data: function() {
      return data;
    },
    id: function() {
      return id;
    },
    addFile: async function(f) {
      if (!data.files) {
        data.files = [f];
      } else {
        data.files.push(f);
      }
      storage.setMetadata(id, { files: data.files, lang: data.lang, generatedFiles: data.generatedFiles });
    },
    addGeneratedFiles: async function(fs) {
      data.generatedFiles = fs;
      storage.setMetadata(id, { files: data.files, lang: data.lang, generatedFiles: data.generatedFiles });
    },
    delete: async function(p) {
      storage.deleteData(id, data.files);
    },
    updateLang: async function(p) {
      data.lang = p;
      storage.setMetadata(id, { files: data.files, lang: data.lang });
    },
    updateProgram: async function(p, doc) {
      data.program = p;
      storage.setProgram(id, data.program, doc);
    },
    updateInput: async function(p) {
      data.input = p;
      storage.setInput(id, data.input);
    },
    updateOutput: async function(p) {
      data.output = p;
      storage.setOutput(id, data.output);
    },
  };
  return rangeIterator;
}
export { getPipe };
