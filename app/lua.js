export async function asyncRunLua(input, code) {
  // Create a standalone lua environment from the factory
  let output = '';
  let error = '';
  let input_array = 'local input = {"' + input.split('\n').join('","') + '"}\n';
  code = input_array + code;
  // Run a lua string
  try {
    output = await fengari.load(code)();
  } catch(e) {
    error = e;
  }
  return { output: output, results: '', error: error};
};

