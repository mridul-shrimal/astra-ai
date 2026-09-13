const http = require('http');
const server = http.createServer((req, res) => {
  res.end('OK');
});
server.listen(5000, '0.0.0.0', () => {
  console.log('Test server listening on 0.0.0.0:5000');
});
setTimeout(() => process.exit(0), 30000);