export const examplePipelines = [
  { 
    name: "Introduction - Part One",
    pipeline:
  [
  {
    key: "Example Pipeline-0",
    program: `# Welcome to io10.dev.
#   This is a data analysis utility that structures your work as a pipeline
#   of inputs and outputs. Each step in the pipeline can use a different
#   language and can side-load files into the pipeline.
#   The first two steps in this example pipeline look like this:
#   
#       +-------+     +-------+    +-------+    +-------+    +-------+
#       |       |     |       |    |       |    |       |    |       |
#       | Input |-----| *.py  |----| Output|----- *.sql |----|Output |
#       |       |     |       |    |       |    |       |    |       |
#       +-------+     +-------+    +-------+    +-------+    +-------+
#  
#   On this screen we are at the first step of the pipeline. The input is at the
#   top right. As we navigate the output of the previous step becomes our input. 
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
#   io10.dev supports Python, SQL, Javascript, R, and Lua.
#
#   Everything is run and stored locally in your browser.
#
#   No data leaves your computer.
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
    input: `input line 1
input line 2
input line 3`,
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
--  The table containing the input in the top-right pane is always available as a table called "input.txt",
--  so our query is as follows. Press Ctrl-Enter to run the query, then navigate to the
--  the next step by pressing Alt-Right.
--
SELECT colid, count(*) colsum
FROM "input.txt" A 
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
# The file, 'file.txt', has already been loaded for this example. Loading
# a file of your own is simple: press Ctrl-O and select the file. It will
# then be available with it's original name to your Python script.
# This also works for: SQL and R.
#
import sys
l = open('file.txt', 'r')
print("colid" + '\t' + "colval")
print(l.readline())
    `,
    input: ``,
    output: '',
    files: ['file.txt'],
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
// In this Javascript snippet we filter for entries where 'dept' contains 'IT'.
// We use the 'return' statement to return the script's output
// 
var filtered = input.filter(x => x.split('\t')[4] == 'IT');
var output =  input[0]+'\\n' + filtered.join('\\n');
return output;
`,
    input: ``,
    output: '',
    files: [],
    lang: "*.js",
  },
  {
    key: "Example Pipeline-5",
    program: `// Welcome to the sixth step in our pipeline.
//
// Hopefully by now it will be clear that Alt in combination with Left and Right allows
// you to navigate between the steps in a pipeline.
// 
// To naviagate between pipelines we use Alt-Up and Alt-Down. Alt-Up will create a new pipeline
// if one doesn't already exist there. 
//
// So in summary for pipeline navigation.:
//   - Use Alt-Left and Alt-Right to navigate between the steps on the current pipeline.
//   - Press Alt-Up to create a new pipeline.
//   - Use Alt-Up and Alt-Down to navigate between your pipelines.
//   - Use Alt-A to add a new step to a pipeline.
//
// One useful thing: at any time you can run all the steps in the pipeline from the start by
// using Alt-R. Why not try it now? The pipeline will run from the start and end up back here
// at the end.
//
// Now that you've seen the basics, let's look at a little more advanced usage.
// Use Alt-Up to navigate to the next pipeline containing the next stage of the tutorial.
//
`,
    input: ``,
    output: '',
    files: [],
    lang: "*.js",
  },
  ]
  },
  { 
    name: "Introduction - Part Two",
    pipeline:
  [
  {
    key: "Introduction Part Two-0",
    program: `# 
# Let's run some R. We have a file loaded called 'testfile.csv'. Let's read it in and print it out.
# Reminder: press Ctrl-Enter to run! :) 
data <- read.csv("testfile.csv")
print(data)
    `,
    input: ``,
    output: '',
    lang: "*.r",
    files: ['testfile.csv'],
  },
  {
    key: "Introduction Part Two-1",
    program: `--  Now we're at the second step of our pipeline, this time we use Lua:
-- Input is available as 'input' local variable.
--
-- Once you've run this you can use Alt-Up to start creating your own pipelines. If you
-- find any bugs please click on the link at the bottom left to go to the project page
-- in github, where you can report them.
-- I hope you find io10.dev useful!
local output = {}
local colors = { "red", "green", "blue" }

for k, v in pairs(colors) do
  table.insert(output, input[k] .. "\\t" .. k .. ":" .. v .. "\\n")
end
table.sort(output)
return table.concat(output, '')
`,
    input: ``,
    output: '',
    lang: "*.lua",
  },
  ]
  },
];

export const exampleFiles = [
  {
  name: 'table.csv',
  data: `id,name,salary,start_date,dept
1,Rick,623.3,2012-01-01,IT
2,Dan,515.2,2013-09-23,Operations
3,Michelle,611,2014-11-15,IT
4,Ryan,729,2014-05-11,HR
5,Gary,843.25,2015-03-27,Finance
6,Nina,578,2013-05-21,IT
7,Simon,632.8,2013-07-30,Operations
8,Guru,722.5,2014-06-17,Finance`,
  },
  {
  name: 'testfile.csv',
  data: `id,name,salary,start_date,dept
1,Rick,623.3,2012-01-01,IT
2,Dan,515.2,2013-09-23,Operations
3,Michelle,611,2014-11-15,IT
4,Ryan,729,2014-05-11,HR
5,Gary,843.25,2015-03-27,Finance
6,Nina,578,2013-05-21,IT
7,Simon,632.8,2013-07-30,Operations
8,Guru,722.5,2014-06-17,Finance`,
  },
];
