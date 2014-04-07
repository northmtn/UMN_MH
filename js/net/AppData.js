/*------------------*/
/* Global Variables */
/*------------------*/

var configXML;
var developerMode;

var audioExtension = ".mp3";
var videoExtension = ".mp3";


//temp
var vp = {};

function vid1Select(element) {
	vp.loadVideo("content/video/M01_S02V01_D.mp4", true);
}

function vid2Select(element) {
	vp.loadVideo("content/video/M01_S02V02_D.mp4", true);
}

function vidExit(element) {
	vp.kill();
	$("#vid_player_overlay").hide();
}