const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const public_Path = path.join(__dirname,'/../public');
const port = process.env.PORT || 3000;
const {generateMessage} = require('./utils/message');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(public_Path));

io.on('connection',(socket)=>{
  console.log('New User Connected');

  socket.emit('newMessage',generateMessage('Admin','Welcome to chatroom!'));
  socket.broadcast.emit('newMessage',generateMessage('Admin','New User Joined'));

  socket.on('disconnect',()=>{
    console.log('User disconnected');
  });

  socket.on('createMessage',(newMessage,callback)=>{
    console.log('New Message Received',newMessage);
    io.emit('newMessage',generateMessage(newMessage.from,newMessage.text));
    callback('This is from the server');
  });

});

server.listen(port,()=>{
  console.log(`Server started at port : ${port}`);
});
