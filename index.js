var YouTube = require('youtube-node');
var youTube = new YouTube();

// Add your youtube generated token below
const youtubeApiKey = '';
// Add your slackbot user generated token below
const slackToken = '';
// Add the slack channel to which the bot should communicate 
const channel_name = '';
// Add your bot name below
const bot_name = '';

const SlackBot = require('slackbots');
const fs = require('fs');

const bot = new SlackBot({
	token: slackToken,
	name: 'video bot'
});

youTube.setKey(youtubeApiKey);


/**
	when bot is ready to work and handle requests
**/
//start handler
bot.on('start', () => {
	const params = {
		icon_emoji: ':smiley:'
	}

	mostPopularVideos();

	bot.postMessageToChannel(channel_name, 'type your search for videos as @test slack');
});


/**
	when bot throws the error
**/
//Error Handle
bot.on('error', err => console.log(err));


/**
	when you type mseeage that is needed to be handled by bot
**/
// Message handle
bot.on('message', data => {
	if (data.type != 'message') {
		return;
	}

	const channel = bot.getChannels()._value.channels;
	var channeldata = channel.find(o => o.name === channel_name);
	const channelID = channeldata.id;

	if (data.channel === channelID) {
		const message = data.text.split(' ');
		const chatbot = bot.getUsers()._value.members;
		var chatbotdata = chatbot.find(o => o.name === bot_name);
		const botID = '<@' + chatbotdata.id + '>';
		if (message[0] === botID) {
			if (message[1] == 'related') {
				getSavedVideo();

			}else{
				const search = message[1];
				searchVideo(search);
			}
		}
	}
});


/**
	Below function gets 5 trending videos from youtube api
**/
function mostPopularVideos(){

	youTube.getMostPopular(5, function (error, result) {
    	if (error) {
        	console.log(error);
    	}
    	else {
    		var url = '';
    		const response = result.items;
    		response.forEach(function(element){
    			url = url + 'https://www.youtube.com/watch?v='+ element.id + ' ';
    		});
    		const params = {
				icon_emoji: ':smiley:'
			}
    		bot.postMessageToChannel(channel_name, `Trending: ${url}`, params);
    	}
	});
}


/**
	Below function gets 2 seraches videos from youtube api
**/
function searchVideo(search){
	
	youTube.search(search, 2, function(error, result) {
		if (error) {
			console.log(error);
		}
		else {
			var video = [];
			var url = '';
			const response = result.items;
			response.forEach(function(element){
				url = url + 'https://www.youtube.com/watch?v='+ element.id.videoId + ' ';
				video.push(element.id.videoId);
			});

			const params = {
				icon_emoji: ':smiley:'
			}

			bot.postMessageToChannel(channel_name, `Search reasult: ${url}`, params);
			let videoData = JSON.stringify(video);
			fs.writeFileSync('video.json', videoData);

			getSavedVideo();
		}
	});
}

/**
	Below function gets 5 related videos from youtube api
**/
function getRelatedVideos(videoId){

	youTube.related(videoId, 5, function(error, result) {
	  if (error) {
	    console.log(error);
	  }
	  else {
    	var url = '';
    	const response = result.items;
    	response.forEach(function(element){
    		url = url + 'https://www.youtube.com/watch?v='+ element.id.videoId + ' ';
    	});
    	const params = {
				icon_emoji: ':smiley:'
		}
    	bot.postMessageToChannel(channel_name, `Search related video: ${url}`, params);
	  }
	});
}

/**
	Below function saves search videos ids that was got from youtube api in video.js
**/
function getSavedVideo(){

	var video = [];
	if (fs.existsSync('video.json')) {
		fs.readFile('video.json', (err, data) => {  
		if (err) throw err;
		   let videosID = JSON.parse(data);
		    	videosID.forEach(function(element){
		    		getRelatedVideos(element);
		    	})
			});

	}else{
		bot.postMessageToChannel(channel_name, 'No video has been searched yet');
	}
}