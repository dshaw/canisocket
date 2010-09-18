var http        = require('http'),
    sys         = require('sys'),
    // npm  
    static      = require('node-static'),
    ws          = require('websocket-server');

// config
var fileServer  = new static.Server('./public')
    port        = parseInt(process.env.PORT) || 8888,
    debug       = true,
    connections = {};

/**
 * Server
 */
var server = ws.createServer({ debug: true }, http.createServer());

server.on("listening", function() {
  console.log('Server listening on port :' + port);
  console.log("Listening for web socket connections on port :" + port);
});

server.on('request', function(request, response) {
  request.on('end', function() {
    fileServer.serve(request, response);
  });
}).listen(port);

server.on('connection', function(connection) {
  server.send(connection.id, 'Yes you can!');
});

server.on('close', function(connection) {
  console.log(connection.id + ' closed');
});
