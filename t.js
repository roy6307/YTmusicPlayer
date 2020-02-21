const fs = require('fs')
const ytdl = require('ytdl-core')

ytdl("https://youtu.be/vZofi2hgiAE")
    .pipe(fs.createWriteStream('a.mp3'))