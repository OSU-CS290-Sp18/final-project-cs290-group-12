var Users_Online = document.getElementById('users_online');
var Total_Chats = document.getElementById('total_chats');
var Time_Up = document.getElementById('uptime');


$(window).on("load", function() {

  function updateStats() {
      $.ajax({
		      type: 'POST',
		        url: '/api/get_stats',
            statusCode: {
              200:  function(data) {
                Users_Online.innerHTML = data.users_online;
				Total_Chats.innerHTML = data.total_chats;
				Time_Up.innerHTML = data.uptime;
              }
            }
	    });
  }

  setInterval(updateStats, 2000);

});
