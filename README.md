# Command Injection (CWE-78) Vulnerable Benchmark

This repository branch (`cmdi`) is an intentionally designed benchmark testbed for evaluating the **Command Injection (CMDi / CWE-78)** static analysis security engine.

## Vulnerability Matrix

| ID | Category | Endpoint / Location | Mechanism | Expected Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **VULN-1** | Direct String Concatenation | `GET /api/network/ping` | `exec('ping -c 1 ' + host)` | **CRITICAL (CWE-78)** |
| **VULN-2** | Template Literal Interpolation | `POST /api/network/traceroute` | `exec(\`traceroute -m 5 ${target}\`)` | **CRITICAL (CWE-78)** |
| **VULN-3** | Destructured Body `execSync` | `POST /api/network/dns-lookup` | `execSync(\`nslookup ${domain}\`)` | **CRITICAL (CWE-78)** |
| **VULN-4** | ShellJS Execution | `GET /api/system/process-info` | `shell.exec('ps aux | grep ' + service)` | **CRITICAL (CWE-78)** |
| **VULN-5** | Execa Command Execution | `GET /api/system/disk-usage` | `execa.command(\`df -h ${mount}\`)` | **CRITICAL (CWE-78)** |
| **VULN-6** | Inter-procedural Delegation | `GET /api/system/diagnostics` | `function exec(x) { exec('uptime ' + x); }` | **CRITICAL (CWE-78)** |
| **VULN-7** | Spawn with `{ shell: true }` | `GET /api/files/list` | `spawn('ls', ['-la', path], { shell: true })` | **CRITICAL (CWE-78)** |
| **VULN-8** | ExecFile with `{ shell: true }` | `POST /api/files/read` | `execFile('cat', [filename], { shell: true })` | **CRITICAL (CWE-78)** |
| **VULN-9** | Subshell `sh -c` Invocation | `POST /api/files/archive` | `spawn('sh', ['-c', 'tar -czf ' + dir])` | **CRITICAL (CWE-78)** |
| **VULN-10**| Dynamic Binary Hijacking | `GET /api/files/convert` | `spawn(userBinary, ['--input', file])` | **HIGH (CWE-78)** |
| **VULN-11**| Compound String Mutation | `GET /api/files/search` | `cmd += req.query.pattern; exec(cmd)` | **CRITICAL (CWE-78)** |

## Safe Controls (Zero False Positives Matrix)

| ID | Safe Mechanism | Endpoint / Location | Rationale | Expected Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **SAFE-1** | `shell-quote` Sanitizer | `GET /api/network/safe-ping` | Input wrapped in `quote([host])` | **SAFE (0 Findings)** |
| **SAFE-2** | Regex Guard Allowlist | `GET /api/network/guarded-ping` | Validated via `/^[a-zA-Z0-9.-]+$/` | **SAFE (0 Findings)** |
| **SAFE-3** | Integer Cast Conversion | `GET /api/system/kill-process` | `parseInt(pid, 10)` | **SAFE (0 Findings)** |
| **SAFE-4** | Static Dictionary Whitelist | `GET /api/system/maintenance` | Whitelisted lookup `MAP[action]` | **SAFE (0 Findings)** |
| **SAFE-5** | Safe Spawn Array (No shell) | `GET /api/files/safe-list` | `spawn('ls', ['-la', path])` | **SAFE (0 Findings)** |
| **SAFE-6** | Safe ExecFile Array (No shell) | `POST /api/files/safe-read` | `execFile('cat', [filename])` | **SAFE (0 Findings)** |
| **SAFE-7** | Internal Maintainer Tool | `bin/repo.js` | Local developer tool, no HTTP entry | **SAFE (0 Findings)** |
