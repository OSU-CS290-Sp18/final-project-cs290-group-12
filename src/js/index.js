/* JS */



/*
			ELEMENT CONNECTORS
								AUTHOR: DARIUS			*/
var main = document.getElementsByClassName('home_screen')[0];
var drawpic1 = document.getElementsByClassName('draw_pic1')[0];
var drawpic2 = document.getElementsByClassName('draw_pic2')[0];
var loading = document.getElementsByClassName('loading_screen')[0];
var match_found = document.getElementsByClassName('match_found')[0];
var askchatmodal = document.getElementsByClassName('askchatmodal')[0];
var times_up = document.getElementsByClassName('times_up')[0];
var chat_page = document.getElementsByClassName('chatbox')[0];



var username_box = document.getElementById('main-username-input');
var username_error_text = document.getElementsByClassName('username_error')[0];
var timer_count1 = document.getElementById('countdown-number1');
var timer_count2 = document.getElementById('countdown-number2');
var timer1_circle = document.getElementsByClassName('first_timer')[0];
var timer2_circle = document.getElementsByClassName('second_timer')[0];
var loader_text1 = document.getElementsByClassName('loader_text1')[0];
var loader_text2 = document.getElementsByClassName('loader_text2')[0];
var loader_text3 = document.getElementsByClassName('loader_text3')[0];


var main_connect = document.getElementsByClassName('button_connect')[0];
var askchatmodal_yes = document.getElementsByClassName('askchatmodal_yes')[0];
var askchatmodal_no = document.getElementsByClassName('askchatmodal_no')[0];
var matchfound_yes = document.getElementsByClassName('matchfound_yes')[0];
var matchfound_no = document.getElementsByClassName('matchfound_no')[0];

var sigCanvas1 = document.getElementsByClassName('canvas1')[0];
var sigCanvas2 = document.getElementsByClassName('canvas2')[0];
var context1 = sigCanvas1.getContext("2d");
var context2 = sigCanvas2.getContext("2d");

var pic1 = document.getElementsByClassName('pic1')[0];
var pic2 = document.getElementsByClassName('pic2')[0];


var colorToUse = 000000;
var socket = io();
var sessionID = "";


/*
			UNIQUE ID GENERATOR
								AUTHOR: Darius			*/
var uniqueKey = function () {
  return '_' + Math.random().toString(36).substr(2, 12);
};




/*
			TIMER FUNCTIONS
								AUTHOR: Darius			*/
function startTimer1() {
	timer_count1.textContent = 10;
	function updateText(input) {
		var current_count = timer_count1.textContent;
		timer_count1.textContent = current_count - 1;
	}

	setInterval(updateText, 1000);
	setTimeout(endTimer1, 10000);
}

function endTimer1() {
		$('.first_timer').css("display", "none");
		function continueF() {
			$('.times_up').fadeIn(1000);
		}
		var imageToSend = sigCanvas1.toDataURL();
		$.ajax({
			type: 'POST',
			url: '/api/post_pic',
			data: {
				username : username_box.value,
				ID : sessionID,
				image_data: imageToSend,
				image_status: 'first'}
		});
		$('.draw_pic1').fadeOut(1000, continueF);
	setTimeout(timesup_to_loading1, 1500);
}

function startTimer2() {
	timer_count2.textContent = 10;
	function updateText(input) {
		var current_count = timer_count2.textContent;
		timer_count2.textContent = current_count - 1;
	}

	setInterval(updateText, 1000);
	setTimeout(endTimer2, 10000);
}

function endTimer2() {
		$('.second_timer').css("display", "none");
		function continueF() {
			$('.times_up').fadeIn(1000);
		}
		var imageToSend = sigCanvas2.toDataURL();
		$.ajax({
			type: 'POST',
			url: '/api/post_pic',
			data: {
				username : username_box.value,
				ID : sessionID,
				image_data: imageToSend,
				image_status: 'second'}
		});
		$('.draw_pic2').fadeOut(1000, continueF);
	setTimeout(timesup_to_loading2, 1500);
}




/*
			START-UP CODE
								AUTHOR: Darius			*/
function enableConnect_button() {
	$('.button_connect').prop("disabled", false)
}

$(document).ready(function() {
	$('.home_screen').fadeIn(5000, enableConnect_button)
	initialize1();
	initialize2();
	sessionID = uniqueKey();
});



/*
			FLOW FUNCTIONS
								AUTHOR: Darius			*/
function main_to_drawpic1() {
	if (username_box.value != "") {
		$('.button_connect').prop("disabled", true);
		$.ajax({
			type: 'POST',
			url: '/api/username',
			data: {
				username : username_box.value,
				ID : sessionID}
		});
    socket.emit('active user', sessionID);
		function continueF() {
			$('.draw_pic1').fadeIn(1000, startTimer1);
		}
		$('.home_screen').fadeOut(1000, continueF);

	}
	else {
		username_error_text.classList.remove('hidden');
	}
}


function loading_to_matchfound() {
	$('.loader_text1').fadeOut(1000);
	function continueF() {
			$('.match_found').fadeIn(1000);
		}
		$('.loading_screen').fadeOut(1000, continueF);
}

function loading_to_chat() {
	$('.loader_text2').fadeOut(1000);
	function continueF() {
			$('.chatbox').fadeIn(1000);
		}
		$('.loading_screen').fadeOut(1000, continueF);
}

function matchfound_to_loading1() {
	$('.loader_text1').fadeIn(1000);
	function continueF() {
			$('.loading_screen').fadeIn(1000, loading_screen_control1);
		}
		$('.match_found').fadeOut(1000, continueF);
		$.ajax({
			type: 'POST',
			url: '/api/post_match_found',
			data: {
				username : username_box.value,
				ID : sessionID,
				response : "NO"}
		});
}

function matchfound_to_loading2() {
	$('.matchfound_yes').prop("disabled", true);
	$('.loader_text2').fadeIn(1000);
	function continueF() {
			$('.loading_screen').fadeIn(1000, loading_screen_control4);
		}
		$('.match_found').fadeOut(1000, continueF);
		$.ajax({
			type: 'POST',
			url: '/api/post_match_found',
			data: {
				username : username_box.value,
				ID : sessionID,
				response : "YES"}
		});
}

function loading_to_drawpic2() {
	colorToUse = 000000;
	$('.loader_text2').fadeOut(1000);
	function continueF() {
			$('.draw_pic2').fadeIn(1000, startTimer2());
		}
		$('.loading_screen').fadeOut(1000, continueF);
}

function drawpic2_to_askchatmodal() {
	function continueF() {
			$('.askchatmodal').fadeIn(1000);
		}
		$('.draw_pic2').fadeOut(1000, continueF);
}

function askchatmodal_no_f() {
		window.location.href = "./";
}

function askchatmodal_yes_f() {
	$('.loader_text2').fadeIn(1000);
	function continueF() {
			$('.loading_screen').fadeIn(1000, loading_screen_control3);
		}
		$('.askchatmodal').fadeOut(1000, continueF);
		$.ajax({
			type: 'POST',
			url: '/api/post_ask_chat',
			data: {
				username : username_box.value,
				ID : sessionID,
				response : "YES"}
		});
}

function timesup_to_loading1() {
		$('.loader_text1').fadeIn(1000);
		function continueF() {
			$('.loading_screen').fadeIn(1000, loading_screen_control1);
		}
		$('.times_up').fadeOut(1000, continueF);
}

function timesup_to_loading2() {
		function continueF() {
			$('.loading_screen').fadeIn(1000, loading_screen_control2);
		}
		$('.times_up').fadeOut(1000, continueF);
}

function loading_to_askmodal() {
		function continueF() {
			$('.askchatmodal').fadeIn(1000);
		}
		$('.loading_screen').fadeOut(1000, continueF);
}

function updateClientData() {
	$.ajax({
			type: 'POST',
			url: '/api/get_update_client',
			data: {
				username : username_box.value,
				ID : sessionID
			},
			statusCode: {
				200:	function(data) {
							$('.match_text').html('You matched with: <font color="#455A64">' + data + '</font>');
							$('.ask_chat_text1').html('New creation from <font color="#455A64">' + data + "</font>:");
							$('.ask_chat_text2').html('Would you like to chat with <b><font color="#455A64">' + data + '</font></b>?');
						}
			}
	});
}

function startChat() {
  function pingServer() {
    $.ajax({
  		type: 'POST',
  		url: '/api/create_chat',
  		data: {
  			ID: sessionID
  		},
      statusCode: {
        200: function(data) {
          var urlPath = './chat/' + data + '&=' + username_box.value;
          window.location.href = urlPath;
        }
      }
  	});
  }

  var startPing = setInterval(pingServer, 1000);
}





/*
			LOADING SCREEN FUNCTIONS
								AUTHOR: Darius			*/
function loading_screen_control1() {

	$.ajax({
		type: 'POST',
		url: '/api/set_ready',
		data: {
			username: username_box.value,
			ID: sessionID
		}
	});

	function pingServer() {
		$.ajax({
			type: 'POST',
			url: '/api/need_match',
			data: {
				username: username_box.value,
				ID: sessionID
			},
			statusCode: {
				200:	function(data) {
							clearInterval(startPing);
								updateClientData();
								$.ajax({
									type: 'POST',
									url: '/api/get_pic',
									data: {
										username : username_box.value,
										ID : sessionID,
										image_status: 'first'
										},
									statusCode: {
										200:	function(data) {
													$('.pic1').attr('src', data);
												},
										404:
												function(data) {
														window.location.href = "./";
												}
									}
								});
							setTimeout(loading_to_matchfound, 3000);
						},
				404:	function(data) {
							window.location.href = "./";
						}
			}
		});

	}
	var startPing = setInterval(pingServer, 1000);
}

function loading_screen_control2() {
		$.ajax({
			type: 'POST',
			url: '/api/get_pic',
			data: {
				username : username_box.value,
				ID : sessionID,
				image_status: 'second'
				},
				statusCode: {
					200:	function(data) {
								updateClientData();
								$('.pic2').attr('src', data);
							},
					404:
							function(data) {
								window.location.href = "./";
							}
				}
		});
	setTimeout(loading_to_askmodal, 4000);
}

function loading_screen_control3() {

	function pingServer() {
		$.ajax({
			type: 'POST',
			url: '/api/get_ask_chat',
			data: {
				username: username_box.value,
				ID: sessionID
			},
			statusCode: {
				200:	function(data) {
							clearInterval(startPing);
							startChat();
						},
				202:	function(data) {
							$('.loader_text2').fadeOut(100);
							$('.loader_text3').fadeIn(1000);
							function continueF() {
								window.location.href = "./";
							}
							setTimeout(continueF, 5000);
						}
			}
		});

	}
	var startPing = setInterval(pingServer, 1000);
}

function loading_screen_control4() {
	$('.matchfound_yes').prop("disabled", false);
	function pingServer() {
		$.ajax({
			type: 'POST',
			url: '/api/get_match_found',
			data: {
				username: username_box.value,
				ID: sessionID
			},
			statusCode: {
				200:	function(data) {
							updateClientData();
							clearInterval(startPing);
							setTimeout(loading_to_drawpic2, 3000);
						},
				202: 	function(data) {
							$('.loader_text2').css("display", "none");
							$('.loader_text1').fadeIn(1000);
							clearInterval(startPing);
							setTimeout(loading_screen_control1, 3000);
						}
			}
		});

	}
	var startPing = setInterval(pingServer, 1000);
}

setInterval(function() {
		if (loader_text1.textContent == "Looking for match . . .") {
			loader_text1.textContent = "Looking for match";
		}
		else if (loader_text1.textContent == "Looking for match") {
			loader_text1.textContent = "Looking for match .";
		}
		else if (loader_text1.textContent == "Looking for match .") {
			loader_text1.textContent = "Looking for match . .";
		}
		else if (loader_text1.textContent == "Looking for match . .") {
			loader_text1.textContent = "Looking for match . . .";
	}}, 200);

setInterval(function() {
		if (loader_text2.textContent == "Waiting for match's response . . .") {
			loader_text2.textContent = "Waiting for match's response";
		}
		else if (loader_text2.textContent == "Waiting for match's response") {
			loader_text2.textContent = "Waiting for match's response .";
		}
		else if (loader_text2.textContent == "Waiting for match's response .") {
			loader_text2.textContent = "Waiting for match's response . .";
		}
		else if (loader_text2.textContent == "Waiting for match's response . .") {
			loader_text2.textContent = "Waiting for match's response . . .";
	}}, 200);

setInterval(function() {
		if (loader_text3.textContent == "Match declined: Restarting . . .") {
			loader_text3.textContent = "Match declined: Restarting";
		}
		else if (loader_text3.textContent == "Match declined: Restarting") {
			loader_text3.textContent = "Match declined: Restarting .";
		}
		else if (loader_text3.textContent == "Match declined: Restarting .") {
			loader_text3.textContent = "Match declined: Restarting . .";
		}
		else if (loader_text3.textContent == "Match declined: Restarting . .") {
			loader_text3.textContent = "Match declined: Restarting . . .";
	}}, 200);



/*
			CANVAS FUNCTIONS
								AUTHOR: Darius			*/
function getPosition1(mouseEvent, sigCanvas1) {
         var x, y;
         if (mouseEvent.pageX != undefined && mouseEvent.pageY != undefined) {
            x = mouseEvent.pageX;
            y = mouseEvent.pageY;
         } else {
            x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
         }

         return { X: x - sigCanvas1.offsetLeft, Y: y - sigCanvas1.offsetTop};
}

function getPosition2(mouseEvent, sigCanvas2) {
         var x, y;
         if (mouseEvent.pageX != undefined && mouseEvent.pageY != undefined) {
            x = mouseEvent.pageX;
            y = mouseEvent.pageY;
         } else {
            x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
         }

         return { X: x - sigCanvas2.offsetLeft, Y: y - sigCanvas2.offsetTop };
}

function updateColor() {
		context1.strokeStyle = colorToUse;
		context2.strokeStyle = colorToUse;
}

function initialize1() {

         var is_touch_device = 'ontouchstart' in document.documentElement;

         if (is_touch_device) {
            var drawer = {
               isDrawing: false,
               touchstart: function (coors) {
                  context1.beginPath();
                  context1.moveTo(coors.x, coors.y);
                  this.isDrawing = true;
               },
               touchmove: function (coors) {
                  if (this.isDrawing) {
                     context1.lineTo(coors.x, coors.y);
                     context1.stroke();
                  }
               },
               touchend: function (coors) {
                  if (this.isDrawing) {
                     this.touchmove(coors);
                     this.isDrawing = false;
                  }
               }
            };

            function draw(event) {

               var coors = {
                  x: event.targetTouches[0].pageX,
                  y: event.targetTouches[0].pageY
               };

               var obj = sigCanvas1;

               if (obj.offsetParent) {
                  do {
                     coors.x -= obj.offsetLeft;
                     coors.y -= obj.offsetTop;
                  }
                  while ((obj = obj.offsetParent) != null);
               }

               drawer[event.type](coors);
            }

            sigCanvas1.addEventListener('touchstart', draw, false);
            sigCanvas1.addEventListener('touchmove', draw, false);
            sigCanvas1.addEventListener('touchend', draw, false);

            sigCanvas1.addEventListener('touchmove', function (event) {
               event.preventDefault();
            }, false);
         }
         else {

            $(".canvas1").mousedown(function (mouseEvent) {
               var position = getPosition1(mouseEvent, sigCanvas1);

               context1.moveTo(position.X, position.Y);
               context1.beginPath();

               $(this).mousemove(function (mouseEvent) {
                  drawLine1(mouseEvent, sigCanvas1, context1);
               }).mouseup(function (mouseEvent) {
                  finishDrawing1(mouseEvent, sigCanvas1, context1);
               }).mouseout(function (mouseEvent) {
                  finishDrawing1(mouseEvent, sigCanvas1, context1);
               });
            });

         }
}

function initialize2() {

         var is_touch_device = 'ontouchstart' in document.documentElement;

         if (is_touch_device) {
            var drawer = {
               isDrawing: false,
               touchstart: function (coors) {
                  context2.beginPath();
                  context2.moveTo(coors.x, coors.y);
                  this.isDrawing = true;
               },
               touchmove: function (coors) {
                  if (this.isDrawing) {
                     context2.lineTo(coors.x, coors.y);
                     context2.stroke();
                  }
               },
               touchend: function (coors) {
                  if (this.isDrawing) {
                     this.touchmove(coors);
                     this.isDrawing = false;
                  }
               }
            };

            function draw(event) {

               var coors = {
                  x: event.targetTouches[0].pageX,
                  y: event.targetTouches[0].pageY
               };

               var obj = sigCanvas2;

               if (obj.offsetParent) {
                  do {
                     coors.x -= obj.offsetLeft;
                     coors.y -= obj.offsetTop;
                  }
                  while ((obj = obj.offsetParent) != null);
               }

               drawer[event.type](coors);
            }

            sigCanvas2.addEventListener('touchstart', draw, false);
            sigCanvas2.addEventListener('touchmove', draw, false);
            sigCanvas2.addEventListener('touchend', draw, false);

            sigCanvas2.addEventListener('touchmove', function (event) {
               event.preventDefault();
            }, false);
         }
         else {

            $(".canvas2").mousedown(function (mouseEvent) {
               var position = getPosition2(mouseEvent, sigCanvas2);

               context2.moveTo(position.X, position.Y);
               context2.beginPath();

               $(this).mousemove(function (mouseEvent) {
                  drawLine2(mouseEvent, sigCanvas2, context2);
               }).mouseup(function (mouseEvent) {
                  finishDrawing2(mouseEvent, sigCanvas2, context2);
               }).mouseout(function (mouseEvent) {
                  finishDrawing2(mouseEvent, sigCanvas2, context2);
               });
            });

         }
}

function drawLine1(mouseEvent, sigCanvas1, context1) {

         var position = getPosition1(mouseEvent, sigCanvas1);

         context1.lineTo(position.X, position.Y);
         context1.stroke();
      }

function finishDrawing1(mouseEvent, sigCanvas1, context1) {
         drawLine1(mouseEvent, sigCanvas1, context1);

         context1.closePath();

         $(sigCanvas1).unbind("mousemove")
                     .unbind("mouseup")
                     .unbind("mouseout");
}

function drawLine2(mouseEvent, sigCanvas2, context2) {

         var position = getPosition2(mouseEvent, sigCanvas2);

         context2.lineTo(position.X, position.Y);
         context2.stroke();
      }

function finishDrawing2(mouseEvent, sigCanvas2, context2) {
         drawLine2(mouseEvent, sigCanvas2, context2);

         context2.closePath();

         $(sigCanvas2).unbind("mousemove")
                     .unbind("mouseup")
                     .unbind("mouseout");
}



/*
			SLIDER FUNCTIONS
								AUTHOR: Darius			*/
$(function() {
	$("#slider-vertical1").slider({
		orientation: "vertical",
		min: 0,
		max: 360,
		value: 0,
		slide: function(event, ui) {
			$(".topcoat-range-input1").css("background", 'hsl(' + ui.value + ', 100%, 50%)');
			colorToUse = 'hsl(' + ui.value + ', 100%, 50%)';
			updateColor();
		}
	});
});

$(function() {
	$("#slider-vertical2").slider({
		orientation: "vertical",
		min: 0,
		max: 360,
		value: 0,
		slide: function(event, ui) {
			$(".topcoat-range-input2").css("background", 'hsl(' + ui.value + ', 100%, 50%)');
			colorToUse = 'hsl(' + ui.value + ', 100%, 50%)';
			updateColor();
		}
	});
});








/*
			EVENT LISTENERS
								AUTHOR: DARIUS			*/
main_connect.addEventListener('click', main_to_drawpic1);
askchatmodal_yes.addEventListener('click', askchatmodal_yes_f);
askchatmodal_no.addEventListener('click', askchatmodal_no_f);
matchfound_yes.addEventListener('click', matchfound_to_loading2);
matchfound_no.addEventListener('click', matchfound_to_loading1);
