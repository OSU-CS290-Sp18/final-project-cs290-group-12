var http = require('http');
var app = require('express')();
var fs = require('fs');
var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const crypto = require("crypto");

server.listen(8080);

mongoose.Promise = global.Promise;


var uniqueKey = function () {
  return '_' + Math.random().toString(36).substr(2, 12);
};

/*
			START DB
								AUTHOR: Darius/Aaron			*/
mongoose.connect('mongodb://localhost/users', function (err) {                // for testing: mongodb://localhost/users
	if (err) {

		throw err;
	}
	else {
		console.log('');
		console.log('============================================');
		console.log('=== Mongoose Connected');
		console.log('============================================');
		console.log('');
	}
});


var userSchema = mongoose.Schema({
	username: String,
	ID: String,
	isReady: String,
	pic1: String,
	pic2: String,
	match_found: String,
	ask_chat: String,
	hasPartner: String,
	partnerID: String,
	matchID: "",
  chat_id: String
});

var chatSessionsSchema = mongoose.Schema({
  chat_id: String
});

var User = mongoose.model('User', userSchema);
var ChatSession = mongoose.model('ChatSession', chatSessionsSchema);
var numUsers = 0;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));




app.use(express.static(path.join(__dirname, 'public')));


/*
			GET FUNCTIONS
								AUTHOR: Darius			*/
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/index.html'));
});

app.get('/index.html', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/index.html'));
});

app.get('/terms.html', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/terms.html'));
});

app.get('/contact.html', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/contact.html'));
});

app.get('/about.html', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/about.html'));
});

app.get('/terms', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/terms.html'));
});

app.get('/contact', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/contact.html'));
});

app.get('/about', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/about.html'));
});

app.get('/stats', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/stats.html'));
});

app.get('/style.css', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/css/style.css'));
});

app.get('/chat_style.css', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/css/chat_style.css'));
});

app.get('/index.js', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/js/index.js'));
});

app.get('/stats.js', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/js/stats.js'));
});

app.get('/chat.js', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/js/chat.js'));
});

app.get('/img/logo_white.png', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/img/logo_white.png'));
});

app.get('/img/logo.png', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/img/logo.png'));
});

app.get('/img/404_image.png', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/img/404_image.png'));
});

app.get('/chat/:chat_id', async function(req, res, next) {

	var url_array = req.params.chat_id.split("&=");
	var actual_chat_id = url_array;
  var username_length = url_array[1].length;

  if ((username_length > 10) || (username_length == 0)) {
    next();
  }
  else {
    var checkIfChatExists = await ChatSession.find({chat_id: actual_chat_id}).limit(1).lean().exec();
    if (checkIfChatExists.length == 1) {
      res.sendFile(path.join(__dirname + '/src/chat.html'));
    }
    else {
      next();
    }
  }
});

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/404.html'));
});






/*
			CHECK/UNMATCH USER FUNCTIONS
								AUTHOR: Darius			*/
function unMatchUsers(user1, user2) {
	User.findOneAndUpdate({ID: user1}, {match_found: "", hasPartner: "NO", partnerID: ""}).then(item => {
				console.log('');
				console.log('============================================');
				console.log('=== Resetting user: ' + user1);
				console.log('============================================');
				console.log('');
	}).catch(err => {
				console.log('');
				console.log('============================================');
				console.log('=== Error while resetting user: ' + user1);
				console.log('============================================');
				console.log('');
	});
	User.findOneAndUpdate({ID: user2}, {match_found: "", hasPartner: "NO", partnerID: "", matchID: ""}).then(item => {
				console.log('');
				console.log('============================================');
				console.log('=== Resetting user: ' + user2);
				console.log('============================================');
				console.log('');
	}).catch(err => {
				console.log('');
				console.log('============================================');
				console.log('=== Error while resetting user: ' + user2);
				console.log('============================================');
				console.log('');
	});;
}

async function checkMatch(user1, user2) {
	var user1_a = await User.find({ID: user1}).limit(1).lean().exec();
	var user2_a = await User.find({ID: user2}).limit(1).lean().exec();

	if ((user1_a.length == 1) && (user2_a.length == 1)) {
		if (user1_a[0].matchID == user2_a[0].matchID) {
			user1_id_x = user1_a[0].ID;
			user1_id_y = user1_a[0].partnerID;
			user2_id_x = user2_a[0].ID;
			user2_id_y = user2_a[0].partnerID;

			if ((user1_id_x == user2_id_y) && (user2_id_x == user1_id_y)) {
				return true;
			}
		}

	}
	else {
			return false;
	}
}

/*
			POST FUNCTIONS
								AUTHOR: Darius			*/
app.post('/api/username', function(req, res) {
	console.log('');
	console.log('=============== NEW USER ===================');
	console.log('=== USERNAME: ' + req.body.username);
	console.log('=== ID: ' + req.body.ID);
	console.log('============================================');

	var newUser = new User({
		username: req.body.username,
		ID: req.body.ID,
		isReady: "NO",
		pic1: "",
		pic2: "",
		match_found: "",
		ask_chat: "",
		hasPartner: "NO",
		partnerID: "",
    chat_id: ""
	});

	newUser.save().then(item => {
		console.log('=== User has been added to DB...');
		console.log('============================================');
		console.log('');
	})
	.catch(err => {
		console.log('=== Error while adding user to DB...');
		console.log('============================================');
		console.log('');
	});
	res.end();
});

app.post('/api/get_match_found', async function(req, res) {
	var thisUser = await User.find({ID: req.body.ID}).limit(1).lean().exec();
	var otherID = thisUser[0].partnerID;
	var otherUser = await User.find({ID: otherID}).limit(1).lean().exec();

	if (checkMatch(req.body.ID, otherID) && (otherUser.length == 1)) {

		var otherUser_response = otherUser[0].match_found;

				if ((otherUser_response == 'YES') && (thisUser[0].match_found == 'YES')) {
					res.sendStatus(200).end();
				}
				else {
					res.sendStatus(204).end();
				}
	}
	else {
		res.sendStatus(202).end();
	}

});

app.post('/api/post_match_found', async function(req, res) {
	console.log('');
	console.log('======== NEW MATCH FOUND RESPONSE ==========');
	console.log('=== USERNAME: ' + req.body.username);
	console.log('=== ID: ' + req.body.ID);
	console.log('=== RESPONSE: ' + req.body.response);
	console.log('============================================');

	User.findOneAndUpdate({ID: req.body.ID}, {match_found: req.body.response}).then(item => {
		console.log('=== Match found response updated to: ' + req.body.response);
		console.log('============================================');
		console.log('');
	})
	.catch(err => {
		console.log('=== Error while updating match found response...');
		console.log('============================================');
		console.log('');
	});

	if (req.body.response == 'NO') {
		var thisUser = await User.find({ID: req.body.ID}).limit(1).lean().exec();
		var otherID = thisUser[0].partnerID;

		await User.findOneAndUpdate({ID: req.body.ID}, {isReady: 'YES'});

		if (checkMatch(req.body.ID, otherID)) {
			unMatchUsers(req.body.ID, otherID);
		}
	}


	res.end();


});

app.post('/api/set_ready', function(req, res) {

	User.findOneAndUpdate({ID: req.body.ID}, {isReady: "YES"}).then(item => {
		console.log('');
		console.log('============================================');
		console.log('=== isReady of ' + req.body.username + ' updated to: YES...');
		console.log('============================================');
		console.log('');
	})
	.catch(err => {
		console.log('');
		console.log('============================================');
		console.log('=== Error while updating isReady...');
		console.log('============================================');
		console.log('');
	});
	res.end();
});

app.post('/api/get_ask_chat', async function(req, res) {
	var thisUser = await User.find({ID: req.body.ID}).limit(1).lean().exec();
	var otherID = thisUser[0].partnerID;
	var otherUser = await User.find({ID: otherID}).limit(1).lean().exec();
	if (checkMatch(req.body.ID, otherID) && (otherUser.length == 1)) {

		var otherUser_response = otherUser[0].ask_chat;

				if ((otherUser_response == 'YES') && (thisUser[0].ask_chat == 'YES')) {
					res.sendStatus(200).end();
				}
				else {
					res.sendStatus(204).end();
				}
	}
  else if (thisUser[0].chat_id != ''){
    res.sendStatus(200).end();
  }
	else {
		res.sendStatus(202).end();
	}

});

app.post('/api/post_ask_chat', async function(req, res) {
	console.log('');
	console.log('========== NEW ASK CHAT RESPONSE ===========');
	console.log('=== USERNAME: ' + req.body.username);
	console.log('=== ID: ' + req.body.ID);
	console.log('=== RESPONSE: ' + req.body.response);
	console.log('============================================');

	User.findOneAndUpdate({ID: req.body.ID}, {ask_chat: req.body.response}).then(item => {
		console.log('=== Ask chat response updated to: ' + req.body.response);
		console.log('============================================');
		console.log('');
	})
	.catch(err => {
		console.log('=== Error while updating ask chat response...');
		console.log('============================================');
		console.log('');
	});

	if (req.body.response == 'NO') {
		var thisUser = await User.find({ID: req.body.ID}).limit(1).lean().exec();
		var otherID = thisUser[0].partnerID;

		if (checkMatch(req.body.ID, otherID)) {
			unMatchUsers(req.body.ID, otherID);
		}
	}

	res.end();
});

app.post('/api/need_match', async function(req, res) {
	var checkUser = await User.find({ID: req.body.ID}).limit(1).lean().exec();
	if (checkUser.length == 1) {
		if (checkUser[0].hasPartner == "YES") {
			res.sendStatus(200).end();
		}
		else {
				var otherUser = await User.find({$and: [{hasPartner: "NO"}, {ID: {$not: {$eq: req.body.ID}}}, {isReady: "YES"}]}).limit(1).lean().exec();
				if ((otherUser.length == 1) && (otherUser[0].isReady == 'YES')) {

					var otherUserID = otherUser[0].ID;
					const newMatchID = uniqueKey();

					await User.findOneAndUpdate({ID: req.body.ID}, {hasPartner: "YES"});
					await User.findOneAndUpdate({ID: otherUserID}, {hasPartner: "YES"});

					await User.findOneAndUpdate({ID: req.body.ID}, {partnerID: otherUserID});
					await User.findOneAndUpdate({ID: otherUserID}, {partnerID: req.body.ID});

					await User.findOneAndUpdate({ID: req.body.ID}, {match_found: ""});
					await User.findOneAndUpdate({ID: otherUserID}, {match_found: ""});

					await User.findOneAndUpdate({ID: req.body.ID}, {matchID: newMatchID});
					await User.findOneAndUpdate({ID: otherUserID}, {matchID: newMatchID});

					await User.findOneAndUpdate({ID: req.body.ID}, {isReady: 'NO'});
					await User.findOneAndUpdate({ID: otherUserID}, {isReady: 'NO'});

					console.log('');
					console.log('============== MATCHING USERS ==============');
					console.log('=== User 1: ' + req.body.ID);
					console.log('=== User 2: ' + otherUserID);
					console.log('============================================');
					console.log('');
					res.sendStatus(200).end();
				}
				else {
					res.sendStatus(204).end();
				}
		}
	}
	else {
		res.sendStatus(404).end();
	}
});

app.post('/api/browser_exit', async function(req, res) {
	var checkUser = await User.find({ID: req.body.ID}).limit(1).lean().exec();
	if (checkUser.length == 1) {
		await User.findOneAndRemove({ID: req.body.ID});
			console.log('');
			console.log('========== BROWSER EXIT DETECTED ===========');
			console.log('=== Removing User: ' + req.body.ID);
			console.log('============================================');
			console.log('');
	}
	res.sendStatus(200).end();
});

app.post('/api/post_pic', function(req, res) {

	if (req.body.image_status == 'first') {
			User.findOneAndUpdate({ID: req.body.ID}, {pic1: req.body.image_data}).then(item => {
			console.log('');
			console.log('============================================');
			console.log('=== Updating ' + req.body.ID + "'s pic1...");
			console.log('============================================');
			console.log('');
		})
		.catch(err => {
			console.log('');
			console.log('============================================');
			console.log('=== Error while updating ' + req.body.ID + "'s pic1...");
			console.log('============================================');
			console.log('');
		});
	}
	else if (req.body.image_status == 'second') {
		User.findOneAndUpdate({ID: req.body.ID}, {pic2: req.body.image_data}).then(item => {
			console.log('');
			console.log('============================================');
			console.log('=== Updating ' + req.body.ID + "'s pic2...");
			console.log('============================================');
			console.log('');
		})
		.catch(err => {
			console.log('');
			console.log('============================================');
			console.log('=== Error while updating ' + req.body.ID + "'s pic2...");
			console.log('============================================');
			console.log('');
		});
	}

	res.sendStatus(200).end();

});

app.post('/api/get_pic', async function(req, res) {

	var thisUser = await User.find({ID: req.body.ID}).limit(1).lean().exec();
	var otherUser = await User.find({ID: thisUser[0].partnerID}).limit(1).lean().exec();

	if (otherUser.length == 1) {
		if (req.body.image_status == 'first') {
			var imageToSend = otherUser[0].pic1;
			res.status(200).send(imageToSend);
		}
		else if (req.body.image_status == 'second') {
			var imageToSend = otherUser[0].pic2;
			res.status(200).send(imageToSend);
		}
	}

});

app.post('/api/get_update_client', async function(req, res) {

	var thisUser = await User.find({ID: req.body.ID}).limit(1).lean().exec();
	var otherUser = await User.find({ID: thisUser[0].partnerID}).limit(1).lean().exec();
	if (otherUser.length == 1) {
		var dataToSend = otherUser[0].username;
		res.status(200).send(dataToSend);
	}
	else {
		res.sendStatus(404).end();
	}

});

app.post('/api/create_chat', async function(req, res) {
  var thisUser = await User.find({ID: req.body.ID}).limit(1).lean().exec();
  if (thisUser.length == 1)  {
    if (thisUser[0].chat_id == '') {
      const new_chat_id = crypto.randomBytes(16).toString("hex");
      await User.findOneAndUpdate({ID: req.body.ID}, {chat_id: new_chat_id});
      await User.findOneAndUpdate({ID: thisUser[0].partnerID}, {chat_id: new_chat_id});

      var newChatSession = new ChatSession({
        chat_id: new_chat_id
      });

      await newChatSession.save();

      res.sendStatus(204).end();
    }
    else {
      res.status(200).send(thisUser[0].chat_id);
    }
  }

});

app.post('/api/get_stats', async function(req, res) {
  var var_users_online = await User.find().count();
  var var_chat_sessions = await ChatSession.find().count();
  var time_up = process.uptime();


  var dataObject = {
    users_online: var_users_online,
    total_chats: var_chat_sessions,
    uptime: time_up
  };

  res.status(200).send(dataObject);

});




var currentConnections = [];

io.on('connection', (socket) => {
  console.log('');
  console.log('=== NEW SESSION... ' + socket.id);
  console.log('');
  var addedUser = false;

  socket.on('new message', (dataObject) => {
    io.sockets.in(dataObject.chat_id).emit('new message', {
      username: socket.username,
      message: dataObject.message
    });
  });

  socket.on('active user', (data) => {
    if (data) {
      var newObject = {
        socket_id: socket.id,
        user_id: data
      };
      currentConnections.push(newObject);
    }
  });

  socket.on('add user', (userObject) => {
    if (addedUser) return;
    socket.username = userObject.username;
    ++numUsers;
    addedUser = true;
    socket.join(userObject.chat_id);
    socket.emit('login');
  });

  socket.on('disconnect', async () => {
    console.log('');
    console.log('=== SESSION CLOSED... ' + socket.id);
    console.log('');
    var target_user;
    if (addedUser) {
      --numUsers;
    }
    target_user = currentConnections.filter(function(obj) {
      return obj.socket_id == socket.id;
    })[0];
    if (target_user) {
      var checkUser = await User.find({ID: target_user.user_id}).limit(1).lean().exec();
    	if (checkUser.length == 1) {
    		await User.findOneAndRemove({ID: target_user.user_id});
    			console.log('');
    			console.log('========== BROWSER EXIT DETECTED ===========');
    			console.log('=== Removing User: ' + target_user.user_id);
    			console.log('============================================');
    			console.log('');
          currentConnections = currentConnections.filter(function(obj) {
            return obj.user_id != target_user.user_id;
          })
    	}
    }
  });
});




//
