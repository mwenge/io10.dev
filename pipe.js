// A pipe is a program/script with its input and output. A sequence of pipes
// make up a pipeline.
let defaultProgram = 'import sys\nl = [1,2,3]\ndef f():\n\tprint(sys.stdin.readline())\nf()';
async function getPipe(id, input="", program = defaultProgram, output = "") {
  let data = await localforage.getItem(id);
  if (!data) {
    data = {program:program, input: input, output: output};
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
    data: function() {
      return data;
    },
    id: function() {
      return id;
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
