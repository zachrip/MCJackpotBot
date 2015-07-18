## MCJackpotBot

***This project is under construction and may change a lot very quickly, please take this into account***

In order to run this bot you need to add a config file in the root directory called `config.js` with the following code:

```javascript
	module.exports = {
		world:'', //optional, executes /s [world] on join
		buyinMin:5,
		buyinMax:25,
		buyinPlayersMin:3,
		buyinPlayersMax:6,
		timeout:5, //in minutes, how long should we wait before picking the winners if the max hasn't been reached?
		receivedPattern:/^\$\d+ has been received from /, //you most likely don't need to touch this.
		userPattern:/^\$\d+ has been received from \[.+\] (.+).$/, //you most likely don't need to touch this either
		amountPattern:/^\$(\d+)/, //you most likely don't need to touch this or this.
		shouldReturn:true, //should we return the money if they don't send enough or at the end of the current pot?
		worldChangeTimeout:3, //in seconds, how long should we wait before attempting to connect to the world?
		waitPeriod: 10, //in seconds, how long should we wait before drawing a winner once the pot is full?
		keepPercentage:10, //percentage of pot that we keep for ourselves ;)
		host: 'mc.yourhost.com', //
		port: 25565, //port of host
		username: '', //username, most likely your email
		password: '' //password for your account
	}
```

Then run `npm install`.

Then run the bot with `node index.js` within the root directory.