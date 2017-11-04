const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const public_Path = path.join(__dirname,'/../public');
const port = process.env.PORT || 3000;
const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const {Sessions} = require('./utils/sessions');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
var sessions = new Sessions();

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

    var userList = users.getUserList();
    console.log('Users : ',userList);

    if(users.getCount(room) === 2)
    {
      var seq = users.getSequence(room);
      sessions.startSession(room);

      if(seq.first.id === socket.id)
      {
        socket.to(seq.second.id).emit('startGame','x');
        socket.to(seq.second.id).emit('opponentMove');
        socket.emit('startGame','o');
        socket.emit('yourMove');
      }
      else
      {
        socket.emit('startGame','x');
        socket.emit('opponentMove');
        socket.to(seq.first.id).emit('startGame','o');
        socket.to(seq.first.id).emit('yourMove');
      }
      sessions.setCurrentMove(seq.first.room,seq.first.id);
      console.log(`Game Started: ${seq.first.name} will make first move with 'o' & ${seq.second.name} will follow with 'x'`);
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
      sessions.clearMatrix(user.room);
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} left the chatroom`));
      io.to(user.room).emit('resetGame');
    }
  });

  socket.on('makeMove',(position,callback)=>{
    console.log('Move request Received.');
    var userList = users.getUserList();
    console.log('id : ',socket.id);
    console.log('Users : ',userList);
    var thisUser = users.getUser(socket.id);
    var otherUser = users.getOther(socket.id);
    if(sessions.myCurrentMove(thisUser.room,thisUser.id))
    {
      var move = sessions.plotMove(thisUser.room,thisUser.move,position);
      socket.to(otherUser.id).emit('moveMade',{move,position});
      socket.emit('moveMade',{move,position});
      var result = sessions.getResult(thisUser.room);
      if(result)
      {
        console.log(`End Game: ${thisUser.name} is a winner`);
        socket.to(otherUser.id).emit('endGame',0);
        socket.emit('endGame',1);
        sessions.setCurrentMove(otherUser.room,0);
      }
      else{
        if(sessions.moveLeft(thisUser.room) === 0)
        {
          console.log('End Game: No Moves Left, so its a tie!');
          socket.to(otherUser.id).emit('endGame',2);
          socket.emit('endGame',2);
          sessions.setCurrentMove(otherUser.room,0);
        }
        else {
          socket.to(otherUser.id).emit('yourMove');
          console.log(`${thisUser.name} is asked to wait for opponent move`);
          socket.emit('opponentMove');
          console.log(`${otherUser.name} given permission to make move`);
          sessions.setCurrentMove(otherUser.room,otherUser.id);
        }
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
