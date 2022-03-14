// A pipe is a program/script with its input and output. A sequence of pipes
// make up a pipeline.
let defaultProgram = 'import sys\nl = [1,2,3]\ndef f():\n\tprint(sys.stdin.readline())\nf()';
async function getPipe(id, program = defaultProgram, input = "", output = "") {
  let pipe = await localforage.getItem(id);
  if (!pipe) {
    pipe = {program:program, input: input, output: output};
    await localforage.setItem(id, pipe);
  }
  const rangeIterator = {
    program: function() {
      return pipe.program;
    },
    input: function() {
      return pipe.input;
    },
    output: function() {
      return pipe.output;
    },
    pipe: function() {
      return pipe;
    },
    id: function() {
      return id;
    },
    updatePipe: async function(p) {
      pipe = {...p};
      await localforage.setItem(id, pipe);
    },
  };
  return rangeIterator;
}
export { getPipe };
