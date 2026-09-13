// VERY EASY: Direct DOM and reflected XSS sinks
const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
  const username = req.query.username;
  // Direct reflected XSS sink in response
  res.send("<h1>User Profile: " + username + "</h1>");
});

router.post('/preview', (req, res) => {
  // Direct DOM innerHTML assignment
  document.getElementById('preview-box').innerHTML = "<div>" + req.body.bio + "</div>";
  document.write("<p>Generated preview for " + req.body.bio + "</p>");
  res.json({ success: true });
});

module.exports = router;
