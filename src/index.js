const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', benchmark: 'ready' });
});

app.listen(3000, () => {
  console.log('Benchmark server running on port 3000');
});
