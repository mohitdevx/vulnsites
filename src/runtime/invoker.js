// EXTREMELY HARD: Dynamically resolved module string and indirect reflection
function executeDynamicCommand(userInput) {
  const moduleName = ['child_', 'process'].join('');
  const cp = require(moduleName);
  const methodName = ['ex', 'ec'].join('');
  return cp[methodName](`git log --grep="${userInput}"`);
}

module.exports = { executeDynamicCommand };
