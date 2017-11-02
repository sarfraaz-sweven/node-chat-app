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
    'from':'Admin',
    'text':'Welcome to chatroom!',
    'createdAt':new Date().getTime()
  });
  socket.broadcast.emit('newMessage',{
    'from':'Admin',
    'text':'New User Joined',
    'createdAt':new Date().getTime()
  });

  socket.on('disconnect',()=>{
    console.log('User disconnected');
  });

  socket.on('createMessage',(newMessage)=>{
    console.log('New Message Received',newMessage);
    io.emit('newMessage',{
      from:newMessage.from,
      text:newMessage.text,
      createdAt: new Date().getTime()
    });
  });


});

server.listen(port,()=>{
  console.log(`Server started at port : ${port}`);
});
