#!/usr/bin/env bash
set -e
cd /home/mohit/Desktop/vulnsites

git config user.name "Scanner Benchmark"
git config user.email "benchmark@vul-scan.local"

# --- MAIN BRANCH ---
git checkout -B main
cat << 'JSON' > package.json
{
  "name": "benchmark-vulnerable-app",
  "version": "1.0.0",
  "description": "Deterministic multi-tier security benchmark for testing SAST AST scanning engines",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js"
  },
  "dependencies": {
    "express": "^4.21.2"
  }
}
JSON

cat << 'MD' > README.md
# Vulnerability Scanner Benchmark Suite

This repository contains intentional vulnerability patterns across multiple difficulty tiers to evaluate AST static analysis scanner precision and depth.

## Difficulty Branches
1. **`very-easy`**: Direct single-statement sinks (`innerHTML = ... + ...`, `execSync(...)`, `db.query(...)`).
2. **`easy`**: Intermediate variables and template string interpolation (`${...}`).
3. **`medium`**: Inter-procedural flow, function parameters, and wrapper abstractions.
4. **`hard`**: Destructured / aliased imports, computed property names, and array joins.
5. **`extremely-hard`**: Curried functions, higher-order closures, and dynamic method dispatch.
6. **`insane`**: Proxy interceptors, custom tagged template simulators, and Function constructors.
MD

mkdir -p src
cat << 'JS' > src/index.js
const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', benchmark: 'ready' });
});

app.listen(3000, () => {
  console.log('Benchmark server running on port 3000');
});
JS

git add .
git commit -m "Initialize benchmark repository baseline"

# --- BRANCH: very-easy ---
git checkout -b very-easy
mkdir -p src/controllers
cat << 'JS' > src/controllers/userController.js
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
JS

cat << 'JS' > src/controllers/orderController.js
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
JS

cat << 'JS' > src/controllers/systemController.js
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
JS

git add .
git commit -m "Add very-easy tier: direct sinks with simple binary concatenation"

# --- BRANCH: easy ---
git checkout -b easy main
mkdir -p src/views src/db src/services
cat << 'JS' > src/views/render.js
// EASY: Intermediate variables & template literals in XSS sinks
function renderUserProfile(container, req) {
  const name = req.query.name;
  const cardSnippet = `
    <div class="user-card">
      <h3>${name}</h3>
      <p>Active Account</p>
    </div>
  `;
  container.innerHTML = cardSnippet;
}

function renderBanner(req, res) {
  const alertText = req.query.announcement;
  const bannerHtml = "<div class='alert-banner'>" + alertText + "</div>";
  res.send(bannerHtml);
}

module.exports = { renderUserProfile, renderBanner };
JS

cat << 'JS' > src/db/orders.js
// EASY: Intermediate query construction & multi-part clauses
async function findOrders(pool, req) {
  const status = req.query.status;
  const orderClause = "ORDER BY " + req.query.sort;
  const sql = `SELECT id, amount, status FROM sales WHERE status = '${status}' ` + orderClause;
  return await pool.query(sql);
}

module.exports = { findOrders };
JS

cat << 'JS' > src/services/backup.js
// EASY: Intermediate command construction & template interpolation
const cp = require('child_process');

function executeBackup(req) {
  const targetDir = req.query.dir;
  const archiveName = `backup_${Date.now()}_${req.query.tag}.tar.gz`;
  const backupCmd = `tar -czf /backups/${archiveName} ${targetDir}`;
  cp.exec(backupCmd);
}

module.exports = { executeBackup };
JS

git add .
git commit -m "Add easy tier: intermediate variables and template string interpolations"

# --- BRANCH: medium ---
git checkout -b medium main
mkdir -p src/helpers src/repositories src/runners
cat << 'JS' > src/helpers/domHelper.js
// MEDIUM: Inter-procedural flow with helper wrapper function
function setSafeContent(element, content) {
  // Sink is isolated in a utility function
  element.innerHTML = content;
}

function displayFeedback(req) {
  const target = document.querySelector('#feedback-container');
  const userFeedback = "<div class='comment'>" + req.body.message + "</div>";
  setSafeContent(target, userFeedback);
}

module.exports = { setSafeContent, displayFeedback };
JS

cat << 'JS' > src/repositories/baseRepository.js
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
JS

cat << 'JS' > src/runners/taskRunner.js
// MEDIUM: Spawn wrapper with shell: true option passed via parameter object
const { spawn } = require('child_process');

function spawnWithShell(binary, argumentList) {
  return spawn(binary, argumentList, { shell: true });
}

function handleArchiveTask(req) {
  const userArgs = ['-czf', req.query.archiveName, req.query.sourcePath];
  return spawnWithShell('tar', userArgs);
}

module.exports = { spawnWithShell, handleArchiveTask };
JS

git add .
git commit -m "Add medium tier: inter-procedural wrapper functions and repository patterns"

# --- BRANCH: hard ---
git checkout -b hard main
mkdir -p src/utils src/storage src/executors
cat << 'JS' > src/utils/template.js
// HARD: Computed property names, aliasing and Array joins
function populateCard(domElement, userParam) {
  const parts = ['inner', 'HTML'];
  const propKey = parts.join('');
  
  const payloadSegments = [
    '<div class="profile">',
    userParam,
    '</div>'
  ];
  
  // Property computed at runtime
  domElement[propKey] = payloadSegments.join('');
}

module.exports = { populateCard };
JS

cat << 'JS' > src/storage/queryBuilder.js
// HARD: Dynamic clauses generated via Object.entries and Array.map
async function searchEntities(knex, queryFilters) {
  const pairs = Object.entries(queryFilters).map(([k, v]) => `${k} = '${v}'`);
  const whereSql = pairs.join(' AND ');
  const rawStatement = 'SELECT * FROM inventory WHERE ' + whereSql;
  return knex.raw(rawStatement);
}

module.exports = { searchEntities };
JS

cat << 'JS' > src/executors/sysExec.js
// HARD: Aliased import and array-joined command string
const { execSync: executeSystemBinary } = require('child_process');

function fetchRemoteResource(remoteUrl) {
  const commandTokens = ['curl', '-s', remoteUrl];
  const fullCommand = commandTokens.join(' ');
  return executeSystemBinary(fullCommand, { encoding: 'utf8' });
}

module.exports = { fetchRemoteResource };
JS

git add .
git commit -m "Add hard tier: aliased imports, computed properties, and array joins"

# --- BRANCH: extremely-hard ---
git checkout -b extremely-hard main
mkdir -p src/renderers src/database src/runtime
cat << 'JS' > src/renderers/factory.js
// EXTREMELY HARD: Curried higher-order functions with deferred execution
const createRenderer = (targetElement) => (propertyName) => (contentPayload) => {
  targetElement[propertyName] = contentPayload;
};

function renderDeferredUserCard(container, req) {
  const inject = createRenderer(container)('innerHTML');
  const cardMarkup = `<div><span>Author: ${req.query.author}</span></div>`;
  inject(cardMarkup);
}

module.exports = { createRenderer, renderDeferredUserCard };
JS

cat << 'JS' > src/database/dynamicDriver.js
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
JS

cat << 'JS' > src/runtime/invoker.js
// EXTREMELY HARD: Dynamically resolved module string and indirect reflection
function executeDynamicCommand(userInput) {
  const moduleName = ['child_', 'process'].join('');
  const cp = require(moduleName);
  const methodName = ['ex', 'ec'].join('');
  return cp[methodName](`git log --grep="${userInput}"`);
}

module.exports = { executeDynamicCommand };
JS

git add .
git commit -m "Add extremely-hard tier: currying, dynamic dispatch, and reflection"

# --- BRANCH: insane ---
git checkout -b insane main
mkdir -p src/interceptor src/sql src/engine
cat << 'JS' > src/interceptor/proxyDOM.js
// INSANE: Proxy DOM interception & base64 dynamic decoding
function createDOMProxy(target) {
  return new Proxy(target, {
    set(obj, prop, val) {
      return Reflect.set(obj, prop, val);
    }
  });
}

function applyUnsafeUpdate(container, req) {
  const proxy = createDOMProxy(container);
  const decodedHtml = Buffer.from(req.query.rawB64 || '', 'base64').toString('utf8');
  proxy['innerHTML'] = decodedHtml;
}

module.exports = { createDOMProxy, applyUnsafeUpdate };
JS

cat << 'JS' > src/sql/taggedTemplate.js
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
JS

cat << 'JS' > src/engine/dynamicRunner.js
// INSANE: Dynamic code evaluation using Function constructor
function evaluateCommand(inputParameter) {
  const runner = new Function(
    'param',
    'const cp = require("child_process"); return cp.execSync("cat /var/log/" + param);'
  );
  return runner(inputParameter);
}

module.exports = { evaluateCommand };
JS

git add .
git commit -m "Add insane tier: Proxy traps, tagged template simulators, and Function constructors"

git checkout main
echo "Benchmark repository configured successfully with branches:"
git branch -a
