var socket = io();
socket.on('connect',function () {
  console.log('Connected to server');

});

socket.on('disconnect',function () {
  console.log('Disconnected from server');
});

socket.on('newMessage',function(message) {
  console.log('New Message',message);
  var formattedTimestamp = moment(message.CreatedAt).format('h:mm a');
  var li = $('<li></li>');
  li.text(`${message.from}: ${formattedTimestamp} :${message.text}`);
  $('#messages').append(li);
});

$('#message-form').on('submit',function(e){
  e.preventDefault();

  var messageTextBox = $('input[name="message"]');

  socket.emit('createMessage',{
    from: 'User',
    text: messageTextBox.val()
  },function(){
    messageTextBox.val('');
  });
})
