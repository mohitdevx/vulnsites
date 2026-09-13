// EASY: Intermediate query construction & multi-part clauses
async function findOrders(pool, req) {
  const status = req.query.status;
  const orderClause = "ORDER BY " + req.query.sort;
  const sql = `SELECT id, amount, status FROM sales WHERE status = '${status}' ` + orderClause;
  return await pool.query(sql);
}

module.exports = { findOrders };
