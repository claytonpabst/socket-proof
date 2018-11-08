const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config.js');
const path = require('path');
const app = require('express')()
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let spaces = {}

app.post('/api/newContact', function(req, res){
  let nsp = req.body.newNameSpace
  spaces[nsp] = io.of('/' + nsp)
  spaces[nsp].on('connection', function(socket){
    console.log('someone connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    })
  });
  spaces[nsp].on('connection', function(socket){
    socket.on('chat message', function(msg){
      spaces[nsp].emit('chat message', msg);
    });
  });
  res.send({status:200})
})

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var nsp = io.of('/Hans')
nsp.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

nsp.on('connection', function(socket){
  socket.on('chat message', function(msg){
    nsp.emit('chat message', msg);
  });
});

http.listen(config.port, '0.0.0.0', function() {
  console.log('Listening to port:  ' + config.port);
});