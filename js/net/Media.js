//VIDEO (Using MediaElement)

function VidPlayer(uniqueElementId) {
	
	this.id = uniqueElementId;
	this.player = new MediaElementPlayer("#"+this.id, {
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

VidPlayer.prototype.loadVideo = function( videoPath, autoplay ) {
	
	this.player.pause();
	this.player.setSrc( videoPath );
	
	autoplay = typeof autoplay !== 'undefined' ? autoplay : false;
	if (autoplay==true) {
		this.player.play();
	}
		
}

VidPlayer.prototype.kill = function( ) {
	
	this.player.pause();
		
}



//SOUND (Using SoundManager2)

function playOneShotSound( sndId ) {
	
	if (isiOS == false) {
	
		var s = soundManager.getSoundById( sndId );
	
		if (s == null){
	
			s = soundManager.createSound({
				id: sndId,
				url: sndsFolder + '' + sndId + audioExtension,
				
				onload: function(bSuccess) {
				    if (!bSuccess) out("ERROR: Sound does not exist at "+sndsFolder + '' + sndId + audioExtension);
				}
				
			});

		}

		s.play();

	}
	
}