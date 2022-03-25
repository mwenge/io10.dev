// A pipe is a program/script with its input and output. A sequence of pipes
// make up a pipeline.
const defaultData = 
  {
    program: `# Welcome to ioio.xyz.
#  Current Pipeline
#    - Alt-A: add a new step to a pipeline.
#    - Alt-D: delete the current step from a pipeline.
#    - Alt-Left: navigate to the previous step in the pipeline.
#    - Alt-Right: navigate to the next step in the pipeline.
#    - Ctrl-O: add a file to the current step in the pipeline.
#  Other Pipelines
#    - Press Alt-Up to create a new pipeline or navigate to the next pipeline.
#    - Press Alt-Down to navigate to the previous pipeline.
#    - Click on the pipeline name in the bottom left to give it a meaningful name of your own.

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

async function getPipe(id, input="", program = defaultData.program, output = "") {
  let data = await localforage.getItem(id);
  if (!data) {
    data = {...defaultData};
    await localforage.setItem(id, data);
  }
  const rangeIterator = {
    program: function() {
      return data.program;
    },
    input: function() {
      return data.input;
    },
    output: function() {
      return data.output;
    },
    files: function() {
      return data.files ? data.files : [];
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
      await localforage.setItem(id, data);
    },
    updateInput: async function(p) {
      data.input = p;
      await localforage.setItem(id, data);
    },
    updateData: async function(p) {
      data = {...p};
      await localforage.setItem(id, data);
    },
  };
  return rangeIterator;
}
export { getPipe };
