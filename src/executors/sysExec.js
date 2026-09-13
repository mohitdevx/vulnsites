// HARD: Aliased import and array-joined command string
const { execSync: executeSystemBinary } = require('child_process');

function fetchRemoteResource(remoteUrl) {
  const commandTokens = ['curl', '-s', remoteUrl];
  const fullCommand = commandTokens.join(' ');
  return executeSystemBinary(fullCommand, { encoding: 'utf8' });
}

module.exports = { fetchRemoteResource };
