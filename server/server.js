const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const public_Path = path.join(__dirname,'/../public');
const port = process.env.PORT || 3000;
const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(public_Path));

io.on('connection',(socket)=>{
  console.log('New User Connected');

  socket.on('join',(params,callback) => {

    if(!isRealString(params.name))
    {
      return callback('Name is required');
    }

    var room ;

    if(!isRealString(params.room)) {
      params.random = true;
      room = users.getRandomRoom();
    } else {
      params.random = false;
      room = params.room;
    }

    socket.join(room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,room,params.random);

    io.to(room).emit('updateUserList',users.getUserList(room));
    socket.emit('newMessage',generateMessage('Admin','Welcome to chatroom!'));
    socket.broadcast.to(room).emit('newMessage',generateMessage('Admin',`${params.name} Joined`));
    callback();
  });

  socket.on('disconnect',()=>{
    console.log('User disconnected');
    var user = users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} left the chatroom`));
    }
  });

  socket.on('createMessage',(newMessage,callback)=>{
    var user = users.getUser(socket.id);
    if(user && isRealString(newMessage.text)) {
      io.to(user.room).emit('newMessage',generateMessage(user.name,newMessage.text));
    }
    callback();
  });

});

server.listen(port,()=>{
  console.log(`Server started at port : ${port}`);
});
