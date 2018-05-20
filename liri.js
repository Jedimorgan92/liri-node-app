//Module
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var request = require('request');
var fs = require('fs');
var keys = require("./keys.js");

var tweetsArray = [];
var inputCommand = process.argv[2];
var commandParam = process.argv[3];
var defaultSong = "P.Y.T.";

var twitterKeys = keys.twitterKeys;
var spotifyKeys = keys.spotifyKeys;

var client = new Twitter({
  consumer_key: twitterKeys.consumer_key,
  consumer_secret: twitterKeys.consumer_secret,
  access_token_key: twitterKeys.access_token_key,
  access_token_secret: twitterKeys.access_token_secret
});

// var client2 = new Spotify ({
// id: process.env.SPOTIFY_ID,
// secret: process.env.SPOTIFY_SECRET
// });



//-----------------------FUNCTIONS-----------------------------------------------

//This function processes the input commands
function processCommands(command, commandParam){

	//console.log(commandParam);

	switch(command){

	case 'my-tweets':
		getMyTweets(); break;
	case 'spotify-this-song':
		//If user has not specified a song , use default
		if(commandParam === undefined){
			commandParam = defaultSong;
		}     
		spotifyThis(commandParam); break;
	case 'do-what-it-says':
		doWhatItSays(); break;
	default: 
		console.log("Invalid command. Please type any of the following commnds: my-tweets spotify-this-song or do-what-it-says");
}


}

function getMyTweets(){

	var params = {screen_name: 'jmotheliribot', count: 20, exclude_replies:true, trim_user:true};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
				if (!error) {
					//console.log(tweets);
					tweetsArray = tweets;

					for(i=0; i<tweetsArray.length; i++){
						console.log("Created at: " + tweetsArray[i].created_at);
						console.log("Text: " + tweetsArray[i].text);
						console.log('--------------------------------------');
					}
				}
				else{
					console.log(error);
				}
	});

}

function spotifyThis(song){

	//If user has not specified a song , default to "Radioactive" imagine dragons
	if(song === ""){
		song = "P.Y.T.";
	}

	client2.get({ type: 'track', query: song}, function(err, data) {
    if (err) {
        console.log('Error occurred: ' + err);
        return;
    }

    var song = data.tracks.items[0];
    console.log("------Artists-----");
    for(i=0; i<song.artists.length; i++){
    	console.log(song.artists[i].name);
    }

    console.log("------Song Name-----");
    console.log(song.name);

	console.log("-------Preview Link-----");
    console.log(song.preview_url);

    console.log("-------Album-----");
    console.log(song.album.name);

	});

}

function doWhatItSays(){
	fs.readFile('random.txt', 'utf8', function(err, data){

		if (err){ 
			return console.log(err);
		}

		var dataArr = data.split(',');

		processCommands(dataArr[0], dataArr[1]);
	});
}



//-------------------------MAIN PROCESS-------------------------------------------

processCommands(inputCommand, commandParam);