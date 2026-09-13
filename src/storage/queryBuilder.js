// HARD: Dynamic clauses generated via Object.entries and Array.map
async function searchEntities(knex, queryFilters) {
  const pairs = Object.entries(queryFilters).map(([k, v]) => `${k} = '${v}'`);
  const whereSql = pairs.join(' AND ');
  const rawStatement = 'SELECT * FROM inventory WHERE ' + whereSql;
  return knex.raw(rawStatement);
}

module.exports = { searchEntities };
