export async function asyncRunLua(input, code) {
  // Create a standalone lua environment from the factory
  let output = '';
  // Run a lua string
  output = await fengari.load(code)();
  console.log("lua output", output)
  return { output: output, results: '', error: ''};
};

