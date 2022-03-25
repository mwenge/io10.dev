// A pipe is a program/script with its input and output. A sequence of pipes
// make up a pipeline.
const defaultData = 
  {
    key: "Example Pipeline-0",
    program: `# Welcome to ioio.xyz.
#   This is a data pipeline utility. It allows you to create a series of steps in Python and SQL that
#   transforms one or more inputs into a final output.
#   
#   The first two steps in this example pipeline look like this:
#   
#       +-------+     +-------+    +-------+    +-------+    +-------+
#       |       |     |       |    |       |    |       |    |       |
#       | Input |-----| *.py  |----| Output|----- *.sql |----|Output |
#       |       |     |       |    |       |    |       |    |       |
#       +-------+     +-------+    +-------+    +-------+    +-------+
#  
#   On this screen we are at the first step of the pipeline. The input is at the top right. As we
#   navigate the output of the previous step becomes our input. 
#  
#       +-----------+-------+
#       |           |       |
#       |           | Input |
#       |           |       |
#       +  *.py     +-------+
#       |           |       |
#       |           | Output|
#       |           |       |
#       +-----------+-------+
#  
#   Let's start by running the Python program below to generate its output. 
#    - Press Ctrl-Enter to run the program. 
#    - Then press Alt-Right to navigate to the next step in the pipeline.
#  
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
