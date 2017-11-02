var socket = io();
socket.on('connect',function () {
  console.log('Connected to server');

});

socket.on('disconnect',function () {
  console.log('Disconnected from server');
});

socket.on('newMessage',function(message) {
  console.log('New Message',message);
  var li = $('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  $('#messages').append(li);
});

socket.emit('createMessage',{
  'from':'Sarfraaz',
  'text':'Hey, whatsapp?'
},function(message){
  console.log('Git it!',message);
});

$('#message-form').on('submit',function(e){
  e.preventDefault();

  socket.emit('createMessage',{
    from: 'User',
    text: $('input[name="message"]').val()
  },function(){

  });
})
