var socket = io();
var myMove = 'o';

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

function compare(a,b) {
  if (a.index < b.index)
    return -1;
  if (a.index > b.index)
    return 1;
  return 0;
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

socket.on('startGame',function(move){
  myMove = move;
});

socket.on('yourMove',function(){
  console.log('Move AAya');
  $('#game-status').html('Your Move');
  $('td').on('click.disabled', false);
});

socket.on('opponentMove',function(){
  console.log('Move GAya');
  $('#game-status').html('Opponent is making a Move');
  $('td').off('click.disabled');
});

socket.on('moveMade',function(data){
  $('td[data-position='+data.position+']').html(data.move);
  console.log(data);
});

socket.on('endGame',function(res){
  if(res)
    $('#game-status').html('Congrats! You Won!');
  else {
    $('#game-status').html('Ahh, you lost! Better Luck next time.');
  }
  console.log(data);
});

socket.on('disconnect',function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  console.log("The Gang",users);
  users.sort(compare);
  var ol = $('<ol></ol>');
  for(i=1;i<=2;i++)
  {
    var u = users.filter(function(user){
      if(user.index === i)
        return user;
    });

    if(u[0])
    {
      ol.append($('<li></li>').text(u[0].name));
    }
    else {
      ol.append($('<li></li>'));
    }
  }

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

$('td').on('click',function(e){
  if($(this).is(':empty'))
  {
    var id = $(this).attr('position');
    console.log('Clicked : '+$(this).data('position'));
    socket.emit('makeMove',$(this).data('position'),function(move){});
  }
  else {
    $('#game-status').html('Move Already made here');
  }
});
