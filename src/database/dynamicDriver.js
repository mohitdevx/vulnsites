// EXTREMELY HARD: Dynamic method dispatch & curried query builder
const getMethodName = () => 'query';

function buildQuery(tableName) {
  return function(whereExpression) {
    return `SELECT * FROM ${tableName} WHERE ${whereExpression}`;
  };
}

async function executeDynamicSearch(driver, req) {
  const action = getMethodName();
  const queryStr = buildQuery('members')(`account_id = ${req.query.id}`);
  return driver[action](queryStr);
}

module.exports = { executeDynamicSearch };
