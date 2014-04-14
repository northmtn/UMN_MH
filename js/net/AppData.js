/*------------------*/
/* Global Variables */
/*------------------*/

var configXML;
var developerMode;

//populate by config.xml
var audioFolder = "";
var audioExtension = "";
var videoFolder = "";
var videoExtension = "";


//Check for iOS
var isiOS = false;
var agent = navigator.userAgent.toLowerCase();
if( agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0 ) {
       isiOS = true;
}


//temp
var vp = {};

function vid1Select(element) {
	vp.loadVideo("M01_S02V01_D", true);
}

function vid2Select(element) {
	vp.loadVideo("M01_S02V02_D", true);
}

function aud1Select(element) {
	playOneShotSound("SampleAudio");	
}

function aud2Select(element) {
	playTakeoverSound("SampleAudio2");	
}

function audCallback(){
	out("sound completed");
}

function vidExit(element) {
	vp.kill();
	soundManager.stopAll();
	$("#vid_player_overlay").hide();
}

