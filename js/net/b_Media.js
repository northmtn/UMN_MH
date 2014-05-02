/* -------------------- */
/* ------ VIDEO ------- */// (Using MediaElement.js)
/* -------------------- */

function VidPlayer(_uniqueSelector) {
	
	this.id = _uniqueSelector;

	this.player = new MediaElementPlayer(this.id, {
													    // shows debug errors on screen
													    enablePluginDebug: false,
													    // remove or reorder to change plugin priority
													    plugins: ['flash','silverlight'],
													    // specify to force MediaElement to use a particular video or audio type
													    type: '',
													    // path to Flash and Silverlight plugins
													    pluginPath: '/js/libs/media/',
													    // name of flash file
													    flashName: 'flashmediaelement.swf',
													    // name of silverlight file
													    silverlightName: 'silverlightmediaelement.xap',
													    // default if the <video width> is not specified
													    defaultVideoWidth: 640,
													    // default if the <video height> is not specified     
													    defaultVideoHeight: 360
													    
												    });
	
}

VidPlayer.prototype.loadVideo = function( videoId, autoplay ) {

	this.player.pause();
	this.player.setSrc( videoFolder + videoId + videoExtension );
	out( videoFolder + videoId + videoExtension );
	autoplay = typeof autoplay !== 'undefined' ? autoplay : false;
	if (autoplay==true) {
		this.player.play();
	}
		
}

VidPlayer.prototype.kill = function( ) {
	
	this.player.pause();
		
}


/* -------------------- */
/* ------ SOUND ------- */// (Using SoundManager2)
/* -------------------- */

function playOneShotSound( sndId ) {
	
	if (isiOS == false) {

		var s = soundManager.getSoundById( sndId );
		
		if (s == null){
		
			out(audioFolder + '' + sndId + audioExtension);
	
			s = soundManager.createSound({
				id: sndId,
				url: audioFolder + '' + sndId + audioExtension,
				
				onload: function(bSuccess) {
				    if (!bSuccess) out("ERROR: Sound does not exist at "+audioFolder + '' + sndId + audioExtension);
				}
				
			});
	
		}
	
		s.play();
	
	} else {
		
		//ignore one shot sounds on iOS safari
		
	}

}

function playTakeoverSound (sndId, callbackFunc ){
	
	//Stop all current sounds
	soundManager.stopAll();
							
	if (sndId != "") {

		soundManager.createSound( {
			
			id: sndId,
			url: audioFolder + sndId + audioExtension,
			
			onload: function(bSuccess) {
			    if (!bSuccess){
					 out("ERROR: Sound does not exist at "+audioFolder + '' + sndId + audioExtension);
				}
			},
			
			//Callback when sound has loaded
			onfinish:callbackFunc
			
		});

		soundManager.play( sndId );
	
	}

}

