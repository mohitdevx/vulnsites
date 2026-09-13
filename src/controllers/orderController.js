// VERY EASY: Direct SQL Injection sinks
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/search', async (req, res) => {
  const orderId = req.query.id;
  // Direct binary concatenation in SQL query
  const query = "SELECT * FROM orders WHERE id = " + orderId;
  const result = await db.query(query);
  res.json(result);
});

router.post('/raw', async (req, res) => {
  const category = req.body.category;
  // Direct template literal in prisma raw query
  await prisma.$queryRawUnsafe(`SELECT * FROM products WHERE category = '${category}'`);
  res.json({ status: 'queried' });
});

module.exports = router;
