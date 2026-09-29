const shell = require('shelljs');
const execa = require('execa');
const { exec } = require('child_process');

/**
 * Helper function for diagnostics (Inter-procedural sink delegation)
 */
function executeDiagnosticCommand(cmdArg) {
  return exec('uptime ' + cmdArg);
}

/**
 * 4. Vulnerability: ShellJS execution with tainted parameter (CWE-78)
 * Endpoint: GET /api/system/process-info?service=nginx;id
 */
function getProcessInfo(req, res) {
  const service = req.query.service;
  const output = shell.exec('ps aux | grep ' + service, { silent: true });
  
  res.json({ output: output.stdout });
}

/**
 * 5. Vulnerability: Execa command execution with template literal (CWE-78)
 * Endpoint: GET /api/system/disk-usage?mount=/;id
 */
async function getDiskUsage(req, res) {
  const mount = req.query.mount;
  
  try {
    const { stdout } = await execa.command(`df -h ${mount}`);
    res.json({ stdout });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * 6. Vulnerability: Inter-procedural helper delegation with untrusted HTTP input (CWE-78)
 * Endpoint: GET /api/system/diagnostics?flags=-p;whoami
 */
function runDiagnostics(req, res) {
  const flags = req.query.flags;
  
  executeDiagnosticCommand(flags);
  res.json({ message: 'Diagnostics initiated' });
}

/**
 * Safe Control 3: Integer cast guarantees no shell metacharacters can be injected (0 findings)
 * Endpoint: GET /api/system/kill-process?pid=1234
 */
function killProcess(req, res) {
  const pid = parseInt(req.query.pid, 10);
  
  exec('kill -9 ' + pid, (err, stdout) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, pid });
  });
}

// Whitelist dictionary mapping for allowed system maintenance actions
const ALLOWED_MAINTENANCE_COMMANDS = {
  sync: 'sync',
  cleartmp: 'rm -rf /tmp/cache_*',
  uptime: 'uptime',
};

/**
 * Safe Control 4: Static whitelist dictionary lookup (0 findings)
 * Endpoint: GET /api/system/maintenance?action=uptime
 */
function runMaintenanceAction(req, res) {
  const action = req.query.action;
  const command = ALLOWED_MAINTENANCE_COMMANDS[action];
  
  if (!command) {
    return res.status(400).json({ error: 'Action not allowed' });
  }
  
  exec(command, (err, stdout) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ output: stdout });
  });
}

module.exports = {
  getProcessInfo,
  getDiskUsage,
  runDiagnostics,
  killProcess,
  runMaintenanceAction,
};
