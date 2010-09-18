var http        = require('http'),
    sys         = require('sys');

// vendorized for heroku
require.paths.unshift('./vendor');

// npm
var static      = require('node-static'),
    ws          = require('websocket-server');

// config
var fileServer  = new static.Server('./public'),
    port        = parseInt(process.env.PORT) || 8888,
    debug       = true,
    connections = {};

/**
 * Web Sockets version info
 */
var versionInfo = {
  draft75: 'http://tools.ietf.org/html/draft-hixie-thewebsocketprotocol-75',
  draft76: 'http://www.whatwg.org/specs/web-socket-protocol/'
};

/**
 * Server
 */
var server = ws.createServer({ debug: debug }, http.createServer());

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
  console.log(connection.id);
  server.send(connection.id,
      JSON.stringify({
        msg: 'Yes you can!',
        version: connection.version,
        info: versionInfo[connection.version] || ''
      })
  );
});

server.on('close', function(connection) {
  console.log(connection.id + ' closed');
});
