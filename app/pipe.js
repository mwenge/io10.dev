// A pipe is a program/script with its input and output. A sequence of pipes
// make up a pipeline.
import * as storage from "./storage.js";
const defaultData = 
  {
    program: `# Keyboard Commands.
#  Current Pipeline
#    - Ctrl-Enter: Run the current step.
#    - Alt-R: Run the entire pipeline from the start.
#    - Alt-Left: Navigate to the previous step in the pipeline.
#    - Alt-Right: Navigate to the next step in the pipeline.
#    - Alt-A: Add a new step to a pipeline.
#    - Alt-D: Delete the current step from a pipeline.
#    - Ctrl-O: Add a file to the current step in the pipeline.
#
#  Input/Output
#    - PageUp/PageDown: Page up and down through input/output.
#    - Ctrl-Home: Move back to start of input/output
#
#  Other Pipelines
#    - Alt-Up: Create a new pipeline or navigate to the next pipeline.
#    - Alt-Down: Navigate to the previous pipeline.
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
    files: [],
  };

async function getPipe(prevID, id) {
  let data = await storage.getData(id);
  if (!data) {
    data = {...defaultData};
    storage.setData(id, data);
  }
  const rangeIterator = {
    program: function() {
      return data.program;
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
      storage.setMetadata(id, { files: data.files, lang: data.lang });
    },
    delete: async function(p) {
      storage.deleteData(id);
    },
    updateProgram: async function(p) {
      data.program = p;
      storage.setProgram(id, data.program);
    },
    updateInput: async function(p) {
      data.input = p;
      storage.setInput(id, data.input);
    },
    updateData: async function(p) {
      data = {...p};
      storage.setData(id, data);
    },
  };
  return rangeIterator;
}
export { getPipe };
