var request=require('request');
var ytdl = require('ytdl-core');
var fs = require('fs')
var data = new Object();

function search(){
	return new Promise(function (resolve, reject){
		var parm = document.getElementById("search_bar").value;
		parm = encodeURI(parm);
		
		var url = "https://www.googleapis.com/youtube/v3/search?q="+parm+"&part=snippet&key=AIzaSyDikf229xNW2Rp8WpCky8Ozdh4hb8Q_6qI&maxResults=2";
		console.log(url)
		var Ids = new Array();
		var Titles = new Array();
		var Thumbnails = new Array();
		request(url,function(err, res, body){
		
			var main = JSON.parse(body).items;
			LEN = Object.keys(main).length;

			for(var i = 0; i <LEN; i ++){
				Ids.push(main[i].id.videoId);
				Titles.push(main[i].snippet.title);
				Thumbnails.push(main[i].snippet.thumbnails);
			}

			

			data.Titles = Titles;
			data.Ids = Ids;
			data.Thumbnails = Thumbnails;
			resolve();
		});
	});
}

function MusicDownload(url,mode){ //true fast,big    false slow,small
	return new Promise(function (resolve,reject){
		var f_name = Math.floor(new Date() / 1000) + ".mp3";
		if(mode == "true"){
			ytdl(url)
				.pipe(fs.createWriteStream(f_name));
				
				resolve();
		}else{
			ytdl(url, {filter : 'audioonly'})
				.pipe(fs.createWriteStream(f_name));

				resolve();
		}
	});
}

function ChangeThumb(datas){
	
}

module.exports.Search = (name) => {
	return search(name);
}

module.exports.Download = (url, mode) => {
	return MusicDownload(url,mode);
}