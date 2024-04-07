const numTokens = (t,s) => t.map(x=>s.includes(x) ? 1 : 0).reduce((a, b) => a + b, 0)
const sql_tokens_single = ["select ","from ","where ","group by ",", sum(",",sum(","count("];
const py_tokens_single = ["import sys","import os","print(","enumerate(","numpy", "def ", "None"];
const js_tokens_single = ["const ","let ", "var ",");","function ",".slice"];

const py_tokens_multiple = ["import ","print(","for ", ];
const js_tokens_multiple = ["try ","catch ", ");"];

export function languageTieBreak(program) {
  let prog = program.toLowerCase();

  if (numTokens(sql_tokens_single, prog) > 0) {
    return "*.sql"
  }

  if (numTokens(py_tokens_single, prog) > 0) {
    return "*.py"
  }

  if (numTokens(js_tokens_single, prog) > 0) {
    return "*.js"
  }

  return "*.py"
}

