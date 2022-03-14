const engines = new Map([
  ["py", runPython()],
  ["sql", runSQL()],
]);


var runPython = function (code) {
  return function (code) {
    const result = await runPythonEngine(code);
  }
}();
