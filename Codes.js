var data = new Object;
var request = require("request"),
    ytdl = require("ytdl-core"),
    fs = require("fs");
var selected = "";
var IsPlaying = false;
var audio = new Audio();
const {shell} = require('electron');
const {ipcRenderer} = require('electron');
const remote = require('electron').remote;
const currentWindow = remote.getCurrentWindow();
var compare;
var IT = false;

document.addEventListener("DOMContentLoaded", _init);

audio.currentTime = 0;

function _init() {

    console.log("Loading...");

    LoadBar();
    drawing();

    fs.readFile(__dirname + "/data/settings.json", (err, dataqwer) => {

        var a = JSON.parse(dataqwer);

        audio.volume = a.Volume;
        document.getElementById("Volume").value = a.Volume * 100;

        if (a.API == undefined || a.API == "") {

            alert("Can't find API key.\nsettings.json will be opened.");
            shell.openItem(__dirname + "/data/settings.json");

        }
    });

    console.log("Done!");

}

function drawing() {

    var barlist = document.getElementsByClassName("bar");

    var animate;
    var asdf = 1.69;
    var asdf2 = 2.01;

    document.getElementById('MV').style.height = "1.62%";
    barlist[0].style.width = "1%";
    barlist[1].style.width = "1%";

    animate = setInterval(function() {

        document.getElementById("MV").style.height = asdf + "%";
        barlist[0].style.width = asdf2 + "%";
        barlist[1].style.width = asdf2 + "%";

        if (asdf > 76.4 || asdf2 > 90.9) {

            console.log("Clear Interval");
            document.getElementById("MV").style.height = "76.6%";
            barlist[0].style.width = "91%";
            barlist[1].style.width = "91%";
            document.getElementById("MV").style.overflow = "auto";
            clearInterval(animate);

        }

        asdf = asdf * 1.1;
        asdf2 = asdf2 * 1.1;

    }, 19);


}

function LoadBar() {

    if (IT == true) {

        document.getElementById('load_bar').style.display = "inline-block";

    }

    if (IT == false) {

        document.getElementById('load_bar').style.display = "none";

    }

}

function DoesPress13(evt) {

    if (evt.keyCode == 13) {

        search().then(() => insert(data));

    }

}

function change() {

    var i = audio.currentTime / audio.duration * 100;
    var t = "conic-gradient(#a64dff 0% " + i + "%, #595959 0% 100%)";
    document.getElementById('pie').style.background = t;

}

function search() {

    return new Promise(function(e, t) {

        fs.readFile(__dirname + "/data/settings.json", (err, dataqwer) => {

            var a = JSON.parse(dataqwer);

            if (a.API == undefined) {

                alert("Can't find API key.\nConfig file will be opened.");
                shell.openItem(__dirname + "/data/settings.json");

            } else {

                var r = document.getElementById("search_bar").value,
                    a = "https://www.googleapis.com/youtube/v3/search?q=" + encodeURI(r) + "&part=snippet&type=video&key=" + a.API + "&maxResults=50";

                var n = new Array,
                    s = new Array,
                    i = new Array;

                request(a, function(t, r, b) {

                    if (r.statusCode == 400) {

                        alert("API key is not work.\nPlease check it.");
                        shell.openItem(__dirname + "/data/settings.json");
                        return;

                    }

                    var u = JSON.parse(b).items;
                    LEN = Object.keys(u).length;
                    console.log(u)

                    for (var o = 0; o < LEN; o++) {

                        n.push(u[o].id.videoId);
                        s.push(u[o].snippet.title);
                        i.push(u[o].snippet.thumbnails);

                    }

                    data.Titles = s;
                    data.Ids = n;
                    data.Thumbnails = i;

                    e();

                });
            }
        })

    })
}

function MusicDownload(e, t, n) { //e link     t:mode true or false (fast and slow) n name

    return new Promise(function(r, a) {

        if (IT == true) {
            alert("Song is downloading.\nQueue feature will be added.");
            return;
        }

        IT = true;
        LoadBar();

        fs.exists(n, (IsExist) => {

            if (IsExist == true) {

                IT = false;
                LoadBar();
                r();

            } else {

                var v;
                true == t ? ((v = ytdl(e)).pipe(fs.createWriteStream(n)), v.on("end", () => {
                    IT = false;
                    LoadBar();
                    r();
                })) : ((v = ytdl(e, {
                    filter: "audioonly"
                })).pipe(fs.createWriteStream(n)), v.on("end", () => {
                    IT = false;
                    LoadBar();
                    r();
                }));

            }

        });

    })
}

function clicked(id, name) {

    if (selected != id + ".mp3") {

        MusicDownload("https://www.youtube.com/watch?v=" + id, true, __dirname + "/data/cache/" + id + ".mp3").then(() => {
            document.getElementById('name_display').innerHTML = name;
            selected = id + ".mp3";

        });
    }

}

function insert(e) {

    for (var t = 0; t < Object.keys(e.Titles).length; t++) {

        var n = "video" + (t + 1),
            i = '<input type="image" src="' + e.Thumbnails[t].medium.url + '" style="padding-bottom: 4px; width: 184.8px; height: 113.4px; float: left;" onclick="clicked(\'' + e.Ids[t] + '\',\'' + e.Titles[t].replace(/(&#39;)/gi, "\\'") + '\')">',
            l = 'text' + (t + 1),
            o = '<div style="display: inline-block; height: 112.4px; width: 100%; word-break:normal; margin-left: 10px; margin-top: 5px;" onclick="clicked(\'' + e.Ids[t] + '\',\'' + e.Titles[t].replace(/(&#39;)/gi, "\\'") + '\')">' + e.Titles[t] + '</div>';
        document.getElementById(l).innerHTML = o
        document.getElementById(n).innerHTML = i

    }
}

function play() {

    var cen = document.getElementById("pie_center2").style;

    if (IsPlaying == true) {

        cen.position = "absolute";
        cen.width = "0px";
        cen.height = "0px";
        cen.borderTop = "12.2px solid transparent";
        cen.borderBottom = "12.2px solid transparent";
        cen.borderRight = "21.13px solid transparent";
        cen.borderLeft = "21.13px solid orange";
        cen.backgroundColor = "";
        cen.top = "7px";
        cen.left = "9.5px";

    } else {

        cen.position = "absolute";
        cen.width = "24.4px";
        cen.height = "24.4px";
        cen.borderTop = "";
        cen.borderBottom = "";
        cen.borderRight = "";
        cen.borderLeft = "";
        cen.backgroundColor = "rgb(153, 153, 153)";
        cen.top = "7px";
        cen.left = "7px";

    }

    compare = ("file:///" + __dirname + "/data/cache/" + selected).replace(/\\/gi, "/");

    if (audio.currentTime != 0 && audio.src != compare) { //재생중 재생

        audio.pause();
        IsPlaying = true;
        audio.currentTime = 0;
        audio.src = __dirname + "/data/cache/" + selected;
        compare = ("file:///" + __dirname + "/data/cache/" + selected).replace(/\\/gi, "/");
        audio.play();

        cen.position = "absolute";
        cen.width = "24.4px";
        cen.height = "24.4px";
        cen.borderTop = "";
        cen.borderBottom = "";
        cen.borderRight = "";
        cen.borderLeft = "";
        cen.backgroundColor = "rgb(153, 153, 153)";
        cen.top = "7px";
        cen.left = "7px";

        return;

    }

    if (IsPlaying == true && audio.currentTime != 0 && audio.src == compare) { //play to pause

        console.log("play to puase")

        audio.pause();
        IsPlaying = false;


        return;

    }

    if (IsPlaying == false && audio.currentTime == 0 && audio.src == compare) { //재생이 끝나있음

        alert("Please select a song!");

        return;

    }

    if (IsPlaying == false && audio.currentTime != 0 && audio.src == compare) { //pause to play

        console.log("Pause to play")

        audio.play();
        IsPlaying = true;

        setInterval(() => {
            change();
        }, 100);

        return;

    }

    if (IsPlaying == false && audio.currentTime == 0) { //selected, but not playing

        audio.src = __dirname + '/data/cache/' + selected;
        audio.play();
        IsPlaying = true;

        setInterval(() => {
            change();
        }, 100);

        audio.addEventListener('ended', function() {

            audio.pause();
            audio.currentTime = 0;
            IsPlaying = false;

            console.log('song end');

        });

        return;

    }

}

function vol(num) {

    audio.volume = num / 100;

    ipcRenderer.sendSync("Vol-Change", num + "");

}