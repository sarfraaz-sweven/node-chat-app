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

    if(users.getCount(room) === 2)
    {
      var seq = users.getSequence(room);
      if(seq.first === socket.id)
      {
        socket.emit('startGame','o');
        socket.emit('yourMove');
        socket.to(seq.second).emit('startGame','x');
        socket.to(seq.second).emit('opponentMove');
      }
      else
      {
        socket.emit('opponentMove');
        socket.emit('startGame','x');
        socket.to(seq.first).emit('yourMove');
        socket.to(seq.second).emit('startGame','');
      }
      console.log('Move ',seq.first);
      console.log('Opponent ',seq.second);
    }

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

  socket.on('makeMove',(position,callback)=>{
    var move = users.plotMove(socket.id,position);
    var otherUser = users.getOther(socket.id);
    socket.to(otherUser).emit('moveMade',{move,position});
    socket.emit('moveMade',{move,position});
    socket.to(otherUser).emit('yourMove');
    socket.emit('opponentMove');
    var result = users.getResult(move);
    if(result)
    {
      socket.to(otherUser).emit('endGame',0);
      socket.emit('endGame',1);
    }
    else{
      var moveLeft = users.moveLeft();
      if(!moveLeft)
      {
        socket.to(otherUser).emit('endGame',2);
        socket.emit('endGame',2);
      }
    }
    callback();
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
