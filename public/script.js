var messageContainer, submitButton;
var pseudo = "";
$.getScript("dateTime.js", function(){
  // Init
  $(function() {
    messageContainer = $('#messageInput');
    submitButton = $("#submit");
    $("#alertPseudo").hide();
    $('#modalPseudo').show();
    $("#pseudoSubmit").click(function() {setPseudo()});
    submitButton.click(function() {sentMessage();});
    $('#messageInput').keypress(function (e) {
    if (e.which == 13) {sentMessage();}});
  });

  //Socket.io
  var socket = io.connect();
  socket.on('connect', function() {
          console.log('connected');
  });
  socket.on('nbUsers', function(msg) {
    $('#messageInput').attr('placeholder','There is:' +
    msg.nb +' connected user(s)');
  });
  socket.on('message', function(data) {
          addMessage(data['message'], data['pseudo'], new DateTime().formats.pretty.b, false);
          console.log(data);
  });

  //Help function
  function sentMessage() {
    if (messageContainer.val() != "")
    {
      socket.emit('message', messageContainer.val());
      addMessage(messageContainer.val(), "Me",new DateTime().formats.pretty.b, true);
      messageContainer.val('');
      submitButton.button('loading');
    }
  }
  function addMessage(msg, pseudo, date, self) {
    if(self) var classDiv = "messageSelf";
    else var classDiv = "messagePseudo";
    $("#chatEntries").append('<div class="rowMessage">'+
        '<p class="infos"><span class="'+classDiv+'">'+pseudo+'</span>'+
          '<time class="messageDate" title="'+date+'">'+date+'</time>'+
        '</p>'+
        '<p>' + msg + '</p>'+
      '</div>');
  }
  function setPseudo() {
          if ($("#pseudoInput").val() != "")
          {
                  socket.emit('setPseudo', $("#pseudoInput").val());
                  socket.on('pseudoStatus', function(data){
                          if(data == "ok")
                          {
                                  $('#modalPseudo').hide();
                                  $("#alertPseudo").hide();
                                  pseudo = $("#pseudoInput").val();
                          }
                          else
                          {
                                  $("#alertPseudo").show();
                          }
                  })
          }
  }
});
