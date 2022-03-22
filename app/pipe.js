// A pipe is a program/script with its input and output. A sequence of pipes
// make up a pipeline.
const defaultData = 
  {
    key: "Example Pipeline-0",
    program: `
#Example Pipeline-0
import sys
w = sys.stdin.readline();
print("colid" + '\t' + "colval")
for i in range(0,20):
  print(str(1) + '\t' + w.strip() +str(i))
    `,
    input: `jdkljdskaldsajkl
dsajkldsjakl
dsajkldsjakldsa
`,
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
