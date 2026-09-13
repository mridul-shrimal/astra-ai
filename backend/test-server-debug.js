const http = require('http');
const server = http.createServer((req, res) => {
  res.end('OK');
});
server.listen(5000, '0.0.0.0', () => {
  console.log('Listening on 0.0.0.0:5000');
  console.log('Address:', server.address());
});
setTimeout(() => process.exit(0), 60000);