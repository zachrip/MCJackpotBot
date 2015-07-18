function Player (username, botInstance) {
	this.username = username;
	this.botInstance = botInstance;
}

Player.prototype.message = function (message) {
	this.botInstance.chat('/msg ' + this.username + ' ' + message);
}

Player.prototype.pay = function(amount) {
	this.botInstance.chat('/pay ' + this.username + ' ' + amount);
};

module.exports = Player;