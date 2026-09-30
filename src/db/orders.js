// EASY: Intermediate query construction & multi-part clauses
async function findOrders(pool, req) {
  const status = req.query.status;
  const ALLOWED_SORTS = { amount: "amount", status: "status", id: "id" };
  const orderColumn = ALLOWED_SORTS[req.query.sort] || "id";
  const sql = "SELECT id, amount, status FROM sales WHERE status = $1 ORDER BY " + orderColumn;
  return await pool.query(sql, [status]);
}

module.exports = { findOrders };
