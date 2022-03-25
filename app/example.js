export const examplePipeline = [
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
--                                +--------------------------------------+  
--        +-------+     +-------+ |  +-------+    +-------+    +-------+ |
--        |       |     |       | |  |       |    |       |    |       | |
--        | Input |-----| *.py  |----| Output|----- *.sql |----|Output | |
--        |       |     |       | |  |       |    |       |    |       | |
--        +-------+     +-------+ |  +-------+    +-------+    +-------+ |
--                                |                   |                  |
--                                |               +-------+              |
--                                |               |       |              |
--                                |               | File  |              |
--                                |               |       |              |
--                                |               +-------+              |
--                                +--------------------------------------+
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
];

