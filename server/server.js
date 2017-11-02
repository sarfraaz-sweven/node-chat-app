const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const public_Path = path.join(__dirname,'/../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(public_Path));

io.on('connection',(socket)=>{
  console.log('New User Connected');

  socket.emit('newMessage',{
    'from':'Irshad',
    'text':'Hey bro!',
    'createdAt':123
  });

  socket.on('disconnect',()=>{
    console.log('User disconnected');
  });

  socket.on('createMessage',(newMessage)=>{
    console.log('New Message Received',newMessage);
  });
});

server.listen(port,()=>{
  console.log(`Server started at port : ${port}`);
});
