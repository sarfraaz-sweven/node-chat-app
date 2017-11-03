var socket = io();

function scrollToBottom(){
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child');

  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight >= scrollHeight)
  {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect',function () {
  console.log('Connected to server');

  var params = $.deparam(window.location.search);
  console.log(params);
  myName = params.name;
  socket.emit('join', params, function(err){
    if(err)
    {
      alert(err);
      window.location.href = "/";
    }
    else {
      console.log('No error');
    }
  });
});

socket.on('disconnect',function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  console.log("aaye"+users);
  var ol = $('<ol></ol>');
  users.forEach(function (user){
    ol.append($('<li></li>').text(user));
  });

  $('#users').html(ol);
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
  scrollToBottom();
});

$('#message-form').on('submit',function(e){
  e.preventDefault();

  var messageTextBox = $('input[name="message"]');

  socket.emit('createMessage',{
    text: messageTextBox.val()
  },function(){
    messageTextBox.val('');
  });
});
