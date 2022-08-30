export async function asyncRunAwk(input, code) {
  // Create a standalone lua environment from the factory
  let output = '';
  let error = '';
  // Run a lua string
  try {
    output = fn_mawk(input, `'${code}'`);
  } catch(e) {
    error = e;
  }
  return { output: output, results: '', error: error};
};

