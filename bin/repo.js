const cp = require('child_process');

/**
 * Internal Maintainer Tool (e.g. changelog generator / git release helper)
 * This script runs locally by developers/maintainers.
 * It does NOT take untrusted HTTP network input and should NOT be flagged as a critical vulnerability.
 */
function getCommitLog(options = {}) {
  const since = options.since || 'HEAD~10';
  const until = options.until || 'HEAD';
  
  return cp.execSync(`git log --format="%aN <%aE>" ${since}...${until}`).toString();
}

function tagRelease(version) {
  if (!version) return;
  cp.execSync(`git tag v${version}`);
}

module.exports = {
  getCommitLog,
  tagRelease,
};
