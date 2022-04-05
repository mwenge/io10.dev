
export function asyncRunJS(input, code) {
	function looseJsonParse(obj) {
			return Function('"use strict";' + obj + '')();
	}
	let output = '';
  let input_array = 'var input = ' + JSON.stringify(input.split('\n')) + ';';
  let result = null;
  let error = null;
  try {
  	result = looseJsonParse(input_array + code);
  } catch(e) {
    error = e;
  }
  console.log("res", result, "output", output);
  return { output: result, results: '', error: error};
};
