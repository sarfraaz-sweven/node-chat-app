const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const public_Path = path.join(__dirname,'/../public');
const port = process.env.PORT || 3000;
const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(public_Path));

io.on('connection',(socket)=>{
  console.log('New User Connected');


  socket.on('join',(params,callback) => {
    if(!isRealString(params.name) || !isRealString(params.room))
    {
      callback('Name & roomm name are required');
    }

    socket.join(params.room);

    socket.emit('newMessage',generateMessage('Admin','Welcome to chatroom!'));
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} Joined`));
    callback();
  });

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
