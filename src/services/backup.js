// EASY: Intermediate command construction & template interpolation
const cp = require('child_process');

function executeBackup(req) {
  const targetDir = req.query.dir;
  const archiveName = `backup_${Date.now()}_${req.query.tag}.tar.gz`;
  const backupCmd = `tar -czf /backups/${archiveName} ${targetDir}`;
  cp.exec(backupCmd);
}

module.exports = { executeBackup };
