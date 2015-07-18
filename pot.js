var Promise = require('promise');

var Player = require('./player');

function Pot (config, bot) {
	this.config = config;
	this.bot = bot;
	this.currentPot = [];
	this.closed = false;
}

Pot.prototype.start = function () {
	this.reset();
	this.clock = setTimeout(this.selectWinner.bind(this), this.config.timeout * 60000);
	this.bot.chat('Now accepting bets! Place your bet by typing /pay ' + this.bot.username + ' amount [' + this.config.buyinMin + '-' + this.config.buyinMax + ']');
};

Pot.prototype.reset = function() {
	this.currentPot = [];
	this.closed = false;
};

Pot.prototype.selectWinner = function () {
	this.closed = true;
	var players = Object.keys(this.currentPot);
	console.log(players);

	if(players.length >= this.config.buyinPlayersMin) {
		var tickets = [];
		var potTotal = 0;
		for(var i = 0; i < players.length; i++) {
			var player = players[i];
			potTotal += this.currentPot[player];
		}

		for(var i = 0; i < players.length; i++) {
			var player = players[i];
			var amount = this.currentPot[player];
			var percentage = amount / potTotal;
			var playerTickets = Math.round(percentage);
			for(var n = 0; n < playerTickets; n++) {
				tickets.push(player);
			}
		}

		var winner = new Player(tickets[Math.floor(Math.random() * tickets.length)], this.bot);
		winner.message('You have won the pot!');
		winner.pay(potTotal - (potTotal * (this.config.keepPercentage / 100)));
	} else {
		console.log('Returning money.');
		for(var i = 0; i < players.length; i++){
			var player = new Player(players[i], this.bot);
			player.pay(this.currentPot[player.username]);
		}
	}
	this.start();
};

Pot.prototype.isFull = function () {
	var players = Object.keys(this.currentPot);
	return this.closed || players.length > this.config.buyinPlayersMax;
};

Pot.prototype.userInPot = function (username) {
	var players = Object.keys(this.currentPot);
	return (players.indexOf(username) >= 0);
};

Pot.prototype.add = function (username, amount) {
	return new Promise(function (resolve, reject) {
		console.log('Adding to pot...');
		var inPot = this.userInPot(username);

		if(!this.isFull() && !inPot) {
			var added = false;
			var culledAmount = amount;

			if(amount >= this.config.buyinMin) {
				if(amount > this.config.buyinMax) {
					culledAmount = amount - this.config.buyinMax;
				} else {
					culledAmount = 0;
				}

				this.currentPot[username] = amount - culledAmount;
				added = true;
				if(this.isFull()) {
					clearTimeout(this.clock);
					setInterval(this.selectWinner.bind(this), this.config.waitPeriod * 1000);
				}
			}

			resolve({
				added:added,
				culledAmount:culledAmount
			});
		} else {
			resolve({
				added:false,
				culledAmount:amount
			});
		}
	}.bind(this));
}

module.exports = Pot;