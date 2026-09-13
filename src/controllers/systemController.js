// VERY EASY: Direct Command Injection sinks
const express = require('express');
const router = express.Router();
const { execSync, exec } = require('child_process');

router.get('/ping', (req, res) => {
  const host = req.query.host;
  // Direct shell execution concatenation
  const output = execSync("ping -c 1 " + host);
  res.send(output.toString());
});

router.get('/dns', (req, res) => {
  const domain = req.query.domain;
  exec("nslookup " + domain, (err, stdout) => {
    res.send(stdout);
  });
});

module.exports = router;
