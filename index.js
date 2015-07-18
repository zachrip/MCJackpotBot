/*
** Our dependencies
*/
var fs = require('fs');
var mineflayer = require('mineflayer');

/*
** Our custom classes
*/

var Pot = require('./pot');
var Player = require('./player');

/*
** Our config
*/
var config = require('./config');

/*
** Our pot and bot variables
*/

var bot = mineflayer.createBot(config);
var pot = new Pot(config, bot);

bot.chatAddPattern(config.receivedPattern, 'payment.received');

bot.on('login', function () {
	console.log('Logged in.');
	if(config.world) {
		bot.chat('/s ' + config.world);
		setTimeout(function () {
			pot.start();
		}, 1000);
	} else {
		pot.start();
	}
});

bot.on('payment.received', function(user, message, x, jsonMessage) {
	var msg = jsonMessage.text;
	var player = new Player(msg.match(config.userPattern)[1], this);
	var amount = msg.match(config.amountPattern)[1];

	pot.add(player.username, amount).then(function (result) {
		console.log('Added to pot...', result);
		if(result.added) {
			if(result.culledAmount > 0) {
				player.pay(result.culledAmount);
			}

			player.message('You\'ve been added to the pot!');
		} else {
			player.pay(result.culledAmount);
		}
	}).catch(function (e) {
		console.log('Caught error:', e);
	});
});