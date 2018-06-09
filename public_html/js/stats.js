


$(window).on("load", function() {

  function updateStats() {
      $.ajax({
		      type: 'POST',
		        url: '/api/get_stats',
            statusCode: {
              200:  function(data) {
                
              }
            }
	    });
  }

  setInterval(updateStats, 2000);

});
