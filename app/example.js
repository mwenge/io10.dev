export const examplePipeline = [
  {
    key: "Example Pipeline-0",
    program: `# Welcome to ioio.xyz.
#   This is a data analysis notebook that allows you to mix Python, Javascript and SQL and structure
#   your work as a pipeline of inputs and outputs.
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
    input: ``,
    output: '',
    lang: "*.py",
  },
  {
    key: "Example Pipeline-1",
    program: `--  Now we're at the second step of our pipeline:
-- 
--   Notice that the input pane in the top right contains the output of our previous step.
--   Here we'll learn how to run a SQL query on this input.
--  
--                              +--------------------------------------+  
--      +-------+     +-------+ |  +-------+    +-------+    +-------+ |
--      |       |     |       | |  |       |    |       |    |       | |
--      | Input |-----| *.py  |----| Output|----- *.sql |----|Output | |
--      |       |     |       | |  |       |    |       |    |       | |
--      +-------+     +-------+ |  +-------+    +-------+    +-------+ |
--                              +--------------------------------------+
-- 
--  The table containing the input in the top-right pane is always available as a table called "input.tsv",
--  so our query is as follows. Press Ctrl-Enter to run the query, then navigate to the
--  the next step by pressing Alt-Right.
--
SELECT colid, count(*) colsum
FROM "input.tsv" A 
GROUP BY 1
`,
    input: ``,
    output: '',
    lang: "*.sql",
  },
  {
    key: "Example Pipeline-2",
    program: `# Welcome to the third step in our pipeline.
# 
# This time we're going to use a file as an extra input to the step:
#
#
#                               +--------------------------------------+  
#       +-------+     +-------+ |  +-------+    +-------+    +-------+ |
#       |       |     |       | |  |       |    |       |    |       | |
#       | Input |-----| *.sql |----| Output|----- *.py  |----|Output | |
#       |       |     |       | |  |       |    |       |    |       | |
#       +-------+     +-------+ |  +-------+    +-------+    +-------+ |
#                               |                   |                  |
#                               |               +-------+              |
#                               |               |       |              |
#                               |               | File  |              |
#                               |               |       |              |
#                               |               +-------+              |
#                               +--------------------------------------+
#
# The file, 'file.tsv', has already been loaded for this example. Loading
# a file of your own is simple: press Ctrl-O and select the file. It will
# then be available with it's original name to your Python script.
#
import sys
l = open('file.tsv', 'r')
print("colid" + '\t' + "colval")
print(l.readline())
    `,
    input: ``,
    output: '',
    files: ['file.tsv'],
    lang: "*.py",
  },
  {
    key: "Example Pipeline-3",
    program: `-- Welcome to the fourth step in our pipeline.
--  
--  We're going to use an extra file again in this step, but this time as 
--  a table in a SQL query.
-- 
--                              +--------------------------------------+  
--      +-------+     +-------+ |  +-------+    +-------+    +-------+ |
--      |       |     |       | |  |       |    |       |    |       | |
--      | Input |-----| *.py  |----| Output|----- *.sql |----|Output | |
--      |       |     |       | |  |       |    |       |    |       | |
--      +-------+     +-------+ |  +-------+    +-------+    +-------+ |
--                              |                   |                  |
--                              |               +-------+              |
--                              |               |       |              |
--                              |               | File  |              |
--                              |               |       |              |
--                              |               +-------+              |
--                              +--------------------------------------+
-- 
--  As in the previous step, the file, 'table.csv', has already been loaded for this example.
-- 
-- Now that you've seen the basics, you can start creating pipelines of your own.
--   - Press Alt-Up to create a new pipeline.
--   - Click on the pipeline name in the bottom left to give it a meaningful name of your own.
--   - Use Alt-Up and Alt-Down to navigate between your pipelines.
--   - Use Alt-A to add a new step to a pipeline.
--   - Use Alt-D to delete the current step from a pipeline.
--   - Use Alt-Left and Alt-Right to navigate between the steps on the current pipeline.
--
SELECT *
FROM "table.csv" A 
`,
    input: ``,
    output: '',
    files: ['table.csv'],
    lang: "*.sql",
  },
  {
    key: "Example Pipeline-4",
    program: `// Welcome to the fifth step in our pipeline.
//  
//  This time we're using Javascript.
// 
// 
//                              +--------------------------------------+  
//      +-------+     +-------+ |  +-------+    +-------+    +-------+ |
//      |       |     |       | |  |       |    |       |    |       | |
//      | Input |-----| *.sql |----| Output|----| *.js  |----|Output | |
//      |       |     |       | |  |       |    |       |    |       | |
//      +-------+     +-------+ |  +-------+    +-------+    +-------+ |
//                              +--------------------------------------+
// 
// The output from the previous step is stored in an array of strings called 'input'.
// We reference it below in the loop.
// 
// Now that you've seen the basics, you can start creating pipelines of your own.
//   - Use Alt-Left and Alt-Right to navigate between the steps on the current pipeline.
//   - Press Alt-Up to create a new pipeline.
//   - Use Alt-Up and Alt-Down to navigate between your pipelines.
//   - Use Alt-A to add a new step to a pipeline.
var l = [1,2,3,4,5,6];
for (var k = 0; k < l.length; k++) {
    print(2,'\t',l);
    print(input[k]);
}
`,
    input: ``,
    output: '',
    files: [],
    lang: "*.js",
  },
];

