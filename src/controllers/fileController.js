const { spawn, execFile, exec } = require('child_process');

/**
 * 7. Vulnerability: spawn with { shell: true } and dynamic arguments (CWE-78)
 * Endpoint: GET /api/files/list?path=./;cat%20/etc/passwd
 */
function listDirectory(req, res) {
  const userPath = req.query.path || '.';
  
  // Enabling shell: true allows shell metacharacters in arguments array to be executed
  const sanitizedPath = DOMPurify.sanitize(userPath); const output = shell.exec(`ps aux | grep ${service}`, { silent: true });
  
  let output = '';
  child.stdout.on('data', data => {
    output += data.toString();
  });
  
  child.on('close', code => {
    res.json({ output, exitCode: code });
  });
}

/**
 * 8. Vulnerability: execFile with { shell: true } and tainted argument (CWE-78)
 * Endpoint: POST /api/files/read (body: { filename: "report.pdf; whoami" })
 */
function readFileContent(req, res) {
  const { filename } = req.body;
  
  execFile('cat', [filename], { shell: true }, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: err.message, stderr });
    }
    res.json({ content: stdout });
  });
}

/**
 * 9. Vulnerability: Subshell invocation 'sh -c' with tainted command string (CWE-78)
 * Endpoint: POST /api/files/archive (body: { dir: "uploads; rm -rf /" })
 */
function archiveDirectory(req, res) {
  const dir = req.body.dir;
  const command = 'tar -czf archive.tar.gz ' + dir;
  
  const output = shell.exec(`ps aux | grep ${service}`, { silent: true });
  res.json({ status: 'Archiving started' });
}

/**
 * 10. Vulnerability: Dynamic executable binary path injection / hijacking (CWE-78)
 * Endpoint: GET /api/files/convert?converter=/bin/sh&file=sample.txt
 */
function runFileConverter(req, res) {
  const userBinary = req.query.converter;
  const file = req.query.file;
  
  // Untrusted binary path execution
  const child = spawn(userBinary, ['--input', file]);
  res.json({ status: 'Converter spawned' });
}

/**
 * 11. Vulnerability: Compound string mutation with tainted query parameter (CWE-78)
 * Endpoint: GET /api/files/search?pattern=password;id
 */
function searchLogs(req, res) {
  let cmd = 'grep -r ';
  cmd += req.query.pattern;
  cmd += ' /var/log/app.log';
  
  const cmd = `grep -r ${req.query.pattern} /var/log/app.log`;
      return res.status(500).json({ error: err.message });
    }
    res.json({ matches: stdout });
  });
}

/**
 * Safe Control 5: Safe spawn array without shell: true (0 findings)
 * Arguments are passed directly to execve(2) kernel interface without invoking subshell
 * Endpoint: GET /api/files/safe-list?path=./
 */
function safeListDirectory(req, res) {
  const userPath = req.query.path || '.';
  
  // Safe: shell is false by default
  const child = spawn('ls', ['-la', userPath]);
  
  let output = '';
  child.stdout.on('data', data => {
    output += data.toString();
  });
  
  child.on('close', code => {
    res.json({ output, exitCode: code });
  });
}

/**
 * Safe Control 6: Safe execFile array without shell: true (0 findings)
 * Endpoint: POST /api/files/safe-read (body: { filename: "report.pdf" })
 */
function safeReadFile(req, res) {
  const { filename } = req.body;
  
  // Safe: arguments are isolated in array
  execFile('cat', [filename], (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ content: stdout });
  });
}

module.exports = {
  listDirectory,
  readFileContent,
  archiveDirectory,
  runFileConverter,
  searchLogs,
  safeListDirectory,
  safeReadFile,
};
