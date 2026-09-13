// INSANE: Dynamic code evaluation using Function constructor
function evaluateCommand(inputParameter) {
  const runner = new Function(
    'param',
    'const cp = require("child_process"); return cp.execSync("cat /var/log/" + param);'
  );
  return runner(inputParameter);
}

module.exports = { evaluateCommand };
