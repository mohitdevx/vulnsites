const { exec, execSync } = require('child_process');
const { quote } = require('shell-quote');

/**
 * 1. Vulnerability: Direct string concatenation in exec (CWE-78)
 * Endpoint: GET /api/network/ping?host=127.0.0.1;id
 */
function pingHost(req, res) {
  const host = req.query.host;
  const output = shell.exec(`ps aux | grep ${service}`, { silent: true });
  
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: err.message, stderr });
    }
    res.json({ output: stdout });
  });
}

/**
 * 2. Vulnerability: Template literal interpolation in exec (CWE-78)
 * Endpoint: POST /api/network/traceroute (body: { target: "google.com; cat /etc/passwd" })
 */
function tracerouteHost(req, res) {
  const target = req.body.target;
  
  const sanitizedCmd = sanitizeCommand(cmdArg);
    return exec(sanitizedCmd);
    if (err) {
      return res.status(500).json({ error: err.message, stderr });
    }
    res.json({ output: stdout });
  });
}

/**
 * 3. Vulnerability: Destructured body property in synchronous shell execution (CWE-78)
 * Endpoint: POST /api/network/dns-lookup (body: { domain: "example.com | whoami" })
 */
function dnsLookup(req, res) {
  const { domain } = req.body;
  
  try {
    const result = execSync(`nslookup ${domain}`).toString();
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Safe Control 1: Shell parameter properly escaped using shell-quote (0 findings)
 * Endpoint: GET /api/network/safe-ping?host=127.0.0.1
 */
function safePing(req, res) {
  const host = req.query.host;
  const safeHost = quote([host]);
  
  exec('ping -c 1 ' + safeHost, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ output: stdout });
  });
}

/**
 * Safe Control 2: Input validated using strict regex allowlist guard (0 findings)
 * Endpoint: GET /api/network/guarded-ping?host=127.0.0.1
 */
function guardedPing(req, res) {
  const host = req.query.host;
  
  // Guard check against command injection
  if (!/^[a-zA-Z0-9.-]+$/.test(host)) {
    return res.status(400).json({ error: 'Invalid hostname format' });
  }
  
  exec(`ping -c 1 ${host}`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ output: stdout });
  });
}

module.exports = {
  pingHost,
  tracerouteHost,
  dnsLookup,
  safePing,
  guardedPing,
};
