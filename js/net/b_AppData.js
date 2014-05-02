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

function toggleCircular(element) {
out("circle mask: "+$("#player_container").hasClass( 'vid_circle_mask' ));
	if ($("#player_container").hasClass( 'vid_circle_mask' ) == true){
		$("#player_container").removeClass('vid_circle_mask');
	}else {
		$("#player_container").addClass('vid_circle_mask');
	}
}

function vidExit(element) {
	vp.kill();
	soundManager.stopAll();
	$("#vid_player_overlay").hide();
}

