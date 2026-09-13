// MEDIUM: Repository pattern with dynamic where clause passed into internal runner
class BaseRepository {
  constructor(db) {
    this.db = db;
  }

  async rawExecute(queryStatement) {
    return this.db.query(queryStatement);
  }

  async findByCondition(tableName, condition) {
    const fullQuery = `SELECT * FROM ${tableName} WHERE ` + condition;
    return this.rawExecute(fullQuery);
  }
}

async function handleUserSearch(repo, req) {
  const userFilter = `email = '${req.query.email}'`;
  return await repo.findByCondition('users', userFilter);
}

module.exports = { BaseRepository, handleUserSearch };
