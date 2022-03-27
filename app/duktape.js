
export function asyncRunJS(input, code) {
	let output = '';
	if (typeof Duktape !== 'object') {
		throw new Error('initialization failed (Duktape is undefined)');
	}
	if (!Duktape.initSuccess) {
		throw new Error('initialization failed (initSuccess is false)');
	}
	Duktape.printHandler = function(msg) {
		output += msg + '\n';
	}
  let input_array = 'var input = ' + JSON.stringify(input.split('\n')) + ';';
  let res = null;
  try {
  	res = Duktape.dukweb_eval(input_array + code);
  } catch(e) {
    output = e;
  }
  console.log("res", res, "output", output);
  return { output: output, results: res, error: res == 'undefined' ? '' : res };
};
