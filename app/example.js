export const examplePipeline = [
  {
    key: "Example Pipeline-1",
    program: `
-- Example Pipeline-1
SELECT colid, count(*) colsum
FROM "Example Pipeline-1.tsv" A 
GROUP BY 1
`,
    input: `jdkljdskaldsajkl
dsajkldsjakl
dsajkldsjakldsa
`,
    output: '',
    lang: "*.sql",
  },
  {
    key: "Example Pipeline-2",
    program: `
# Example Pipeline-2
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
  },
];

