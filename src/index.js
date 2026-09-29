const express = require('express');
const networkController = require('./controllers/networkController');
const systemController = require('./controllers/systemController');
const fileController = require('./controllers/fileController');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Network Utility Endpoints
app.get('/api/network/ping', networkController.pingHost);
app.post('/api/network/traceroute', networkController.tracerouteHost);
app.post('/api/network/dns-lookup', networkController.dnsLookup);
app.get('/api/network/safe-ping', networkController.safePing);
app.get('/api/network/guarded-ping', networkController.guardedPing);

// System Utility Endpoints
app.get('/api/system/process-info', systemController.getProcessInfo);
app.get('/api/system/disk-usage', systemController.getDiskUsage);
app.get('/api/system/diagnostics', systemController.runDiagnostics);
app.get('/api/system/kill-process', systemController.killProcess);
app.get('/api/system/maintenance', systemController.runMaintenanceAction);

// File Manager Endpoints
app.get('/api/files/list', fileController.listDirectory);
app.post('/api/files/read', fileController.readFileContent);
app.post('/api/files/archive', fileController.archiveDirectory);
app.get('/api/files/convert', fileController.runFileConverter);
app.get('/api/files/search', fileController.searchLogs);
app.get('/api/files/safe-list', fileController.safeListDirectory);
app.post('/api/files/safe-read', fileController.safeReadFile);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', benchmark: 'CMDi (CWE-78) Testbed' });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[CMDi Benchmark] Server listening on port ${PORT}`);
  });
}

module.exports = app;
