var socket = io();
socket.on('connect',function () {
  console.log('Connected to server');

});

socket.on('disconnect',function () {
  console.log('Disconnected from server');
});

socket.on('newMessage',function(message) {

  var formattedTimestamp = moment(message.CreatedAt).format('h:mm a');
  var template = $('#message-template').html();
  var html = Mustache.render(template,{
    text:message.text,
    from: message.from,
    createdAt: formattedTimestamp
  });

  $('#messages').append(html);
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
