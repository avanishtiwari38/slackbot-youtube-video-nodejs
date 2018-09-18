# slackbot-youtube-video-nodejs
slackbot in node.js that is used to handle youtube trending videos, search videos and give related videos.

# Installation
Clone this repo and then install npm dependencies
	 
	 npm install

	 npm update

# Changes before use in `index.js`.

	// Add your youtube generated token below
	const youtubeApiKey = '';

	// Add your slackbot user generated token below
	const slackToken = '';

	// Add the slack channel to which the bot should communicate 
	const channel_name = '';

	// Add your bot name below
	const bot_name = '';

# Run project
After making above changes run your project will following command.
	
	npm start

# Description

This is simple slack bot that shows trendinding videos on project start, it also helps you to search videos and show you related videos based on ypur search.

# Example

On staring of the project it will show you all 5 trending videos on youtube.
You can also change the count of video you want to be shown. I have given count as 5.
To change the count just edit below line.

	youTube.getMostPopular(5, function (error, result) {

After that if you type @yourbotname searchParameter
for example @test nba
This will show you 2 videos related to your search parameter 'nba'.
Even here you can change your count of video you want for output.

	youTube.search(search, 2, function(error, result) {

If you want videos related to your search then just send message like this @yourbotbame related
for example @test related
This will show you 5 videos related to each result found.
Even here you can change your count of videos.

	youTube.related(videoId, 5, function(error, result) {