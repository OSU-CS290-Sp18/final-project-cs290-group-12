$(function() {
  var FADE_TIME = 150;
  var COLORS = [
    '#455A64'
  ];
  var $window = $(window);
  var $messages = $('.messages');
  var $inputMessage = $('.inputMessage');
  var client_username;
  var connected = false;

  var socket = io();


  var this_url = window.location.href;
  var this_url_array1 = this_url.split('/chat/');
  var this_url_array2 = this_url_array1[1].split('&=');
  var sessionID = this_url_array2[0];


  $(window).on("load", function() {
      setUsername();
  });


  const setUsername = () => {
    var current_url = window.location.href;
    var url_array = current_url.split('&=');
    client_username = url_array[1];
    var userObject = {
      username: client_username,
      chat_id: sessionID
    };
    if (client_username) {
      socket.emit('add user', userObject);
    }
  }

  const sendMessage = () => {
    var message = $inputMessage.val();
    message = cleanInput(message);
    if (message && connected) {
      $inputMessage.val('');
      var dataObject = {
        message: message,
        chat_id: sessionID
      }
      socket.emit('new message', dataObject);
    }
  }

  const log = (message, options) => {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  const addChatMessage = (data, options) => {
    var $usernameDiv = $('<span class="username"/>').text(data.username).css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">').text(data.message);
    var $messageDiv = $('<li class="message"/>').data('username', data.username).append($usernameDiv, $messageBodyDiv);
    addMessageElement($messageDiv, options);
  }

  const addMessageElement = (el, options) => {
    var $el = $(el);
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  const cleanInput = (input) => {
    return $('<div/>').text(input).html();
  }

  const getUsernameColor = (username) => {
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  $window.keydown(event => {
    if (event.which === 13) {
      if (client_username) {
        sendMessage();
      } else {
        setUsername();
      }
    }
  });

  $inputMessage.click(() => {
    $inputMessage.focus();
  });

  socket.on('login', (data) => {
    connected = true;
  });

  socket.on('new message', (data) => {
    addChatMessage(data);
  });

  socket.on('disconnect', () => {
    log('You have been disconnected...');
  });

  socket.on('reconnect', () => {
    log('You have been reconnected...');
    var userObject = {
      username: client_username,
      chat_id: sessionID
    };
    if (client_username) {
      socket.emit('add user', userObject);
    }
  });

  socket.on('reconnect_error', () => {
    log('Attempt to reconnect has failed...');
  });

});
