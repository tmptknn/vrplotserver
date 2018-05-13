'use strict';

const express = require('express');
const path = require('path');
// Constants
const PORT = 8000;
const HOST = '0.0.0.0';

// App
const app = express();

const publicpath = path.join(__dirname,'html');

app.use('/', express.static(publicpath));

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
});
server.listen(3773, function() { });

// create the server
const wsServer = new WebSocketServer({
  httpServer: server
});
const clients = [];
let clientId = 0;
const maxclients = 10;

let socket;

function sendData(from, data) {
  for(let i=0; i<maxclients; i++) {
    if(clients[i] && (i !== from)) clients[i].connection.sendUTF(data);
  }
}

// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  const id = clientId;
  if(clients[id]){
    console.log("Dropping old connection "+id);
    clients[id].connection.close();
  }
  console.log("hello "+id);
  clients[id] = {connection:connection};
  clientId+=1;
  if(clientId >=maxclients) clientId = 0;
  connection.on('message', function(message) {
    sendData(id,message.utf8Data);
  });

  connection.on('close', function(connection) {
    console.log("bye "+id);
    clients[id] = null;
  });
});
