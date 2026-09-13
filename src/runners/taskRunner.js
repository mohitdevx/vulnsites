// MEDIUM: Spawn wrapper with shell: true option passed via parameter object
const { spawn } = require('child_process');

function spawnWithShell(binary, argumentList) {
  return spawn(binary, argumentList, { shell: true });
}

function handleArchiveTask(req) {
  const userArgs = ['-czf', req.query.archiveName, req.query.sourcePath];
  return spawnWithShell('tar', userArgs);
}

module.exports = { spawnWithShell, handleArchiveTask };
