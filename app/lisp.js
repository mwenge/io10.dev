export async function asyncRunLisp(input, code) {
  let output = '';
  let error = '';
  // Run a lisp string
  try {
    // Create a standalone lisp environment from the factory
    let {exec} = lips;
    output = await exec(code, true);
    output = output.filter(x=>x).join('\n');
  } catch(e) {
    error = e;
  }
  return { output: output, results: '', error: error};
};

