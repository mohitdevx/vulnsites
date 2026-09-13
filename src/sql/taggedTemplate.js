// INSANE: Tagged template simulator looking safe but concatenating raw values
function safeSql(strings, ...values) {
  // Looks like a safe parameterized tagged template, but naively concatenates!
  return strings.reduce((acc, str, i) => {
    const val = values[i] !== undefined ? values[i] : '';
    return acc + str + val;
  }, '');
}

async function querySecureVault(db, req) {
  const userToken = req.headers['x-auth-token'];
  const unsafeQuery = safeSql`SELECT * FROM secrets WHERE token = '${userToken}'`;
  return await db.query(unsafeQuery);
}

module.exports = { safeSql, querySecureVault };
