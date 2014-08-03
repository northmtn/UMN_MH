define(['net/data/AppData', 'net/ui/Tips', 'net/media/Media'], function(AppData, Tips, Media){


    function TS_BuildingSequence( containerDiv ){
    	
    	this.containerDiv = containerDiv;
    	
    	this.buildings = [];
    	this.curBuilding = {};
    	this.curBuildingIndex = -1;
    	
    	this.intro = [];
    	
    	this.calloutDiv = $(this.containerDiv).find("#callout").first();

    }
    
    TS_BuildingSequence.prototype.setup = function() {
    	
    	this.buildings = [];
    	this.curBuilding = {};
    	this.curBuildingIndex = 0;
    	
    	//Get all steps from global config
    	var thisRef = this;
    	var stepConfigs = $(AppData.configXML).find("buildings building").each( function () {
    		
    		var bId = $(this).attr('id');
    		var audioSrc = $(this).attr('audio');
    		var audioDur = $(this).attr('duration');
    		var bHTML = $(this).text();
    		thisRef.buildings.push([bId, audioSrc, audioDur, bHTML]);
    		
    		var bDiv = $(this.containerDiv).find("#"+bId);

    	});   
    	
    	//Setup intro
    	var introConfig = $(AppData.configXML).find("buildings").first();
    	var audioSrc = $(introConfig).attr('audio');
    	var audioDur = $(introConfig).attr('duration');
    	this.intro = ["intro", audioSrc, audioDur];
  
    }
    
    TS_BuildingSequence.prototype.reset = function() {
     	
     	this.curBuildingIndex = -1;
     	
     	//last building
     	var bDiv = $(this.containerDiv).find("#"+this.buildings[this.buildings.length-1][0]);
     	TweenLite.set( $(bDiv).children("#bw"), { css: { opacity:1 } } ); // on
     	TweenLite.set( $(bDiv).children("#color"), { css: { opacity:0 } } ); // off
     	
     	//callout
     	TweenLite.set( $(this.calloutDiv), { css: { opacity:0 } } ); // on
     	
    }
    
    TS_BuildingSequence.prototype.startIntro = function() {
		
		this.timedAudio( this.intro[1], this.intro[2] );

    }
    
    TS_BuildingSequence.prototype.nextBuilding = function() {
    
   		this.curBuilding = this.buildings[this.curBuildingIndex];
    	
    	var bDiv = $(this.containerDiv).find("#"+this.curBuilding[0]);
    	//deactivate
    	$(this.containerDiv).children("div").removeClass("activated");
    	$(bDiv).addClass("activated");

		TweenMax.to( $(bDiv).children("#bw"), 0.425, { css: { scale:1.25 },  ease:Power2.easeOut, yoyo: true, repeat:1 } ); // SCALE THROB
		
		//show bubble callout
		TweenLite.set( $(this.calloutDiv), { css: { opacity:0 } } ); // on
		
		$(this.calloutDiv).children("#callout_txt").html(this.curBuilding[3]);
		var txtHeight = parseInt( $(this.calloutDiv).children("#callout_txt").height() );
		
		var cLeft = $(bDiv).position().left + ($(bDiv).children("#bw").width()/2 ) - ( $(this.calloutDiv).width()/2 );
		$(this.calloutDiv).css('left', cLeft );
		$(this.calloutDiv).css('top', $(bDiv).position().top - (txtHeight/2) - 160);
		
		TweenLite.to( $(this.calloutDiv), 0.75, { css: { opacity:1 }, delay:1, ease:Power2.easeOut } ); // FADE IN
    	
    	//Wait for this activated building to be clicked ...
    	
    }
    
    TS_BuildingSequence.prototype.playBuilding = function( bId ) {
    	
    	//only allow currently active building to be played
    	if (bId == this.curBuilding[0] && $(this.containerDiv).find("#"+this.curBuilding[0]).hasClass("activated") == true ){
    	
    		var bDiv = $(this.containerDiv).find("#"+this.curBuilding[0]);
    	
    		//Last building
			if (this.curBuildingIndex == this.buildings.length-1) {
			    
	    		TweenLite.to( $(bDiv).children("#bw"), 1, { css: { opacity:0 }, delay:0.25,  ease:Power2.easeIn } ); // FADE OUT
	    		TweenLite.set( $(bDiv).children("#color"), { css: { opacity:0 } } ); // on
	    		TweenLite.to( $(bDiv).children("#color"), 1, { css: { opacity:1 },  ease:Power2.easeOut } ); // FADE IN
	
	    	}
	    	
	    	//deactivate
	    	$(bDiv).removeClass("activated");
	    
	    	var sndId = this.curBuilding[1];
	    	var sndDelay = this.curBuilding[2];	    	
	    	this.timedAudio(sndId, sndDelay);

    	}
    	
    }
    
    TS_BuildingSequence.prototype.timedAudio = function( sndId, sndDelay ) {
    	var thisRef = this;
    	
    	//start audio
    	Media.playTakeoverSound( sndId );
    	
    	//wait for end of audio. 
    	if (sndDelay == 'undefined' || sndDelay == null || sndDelay == undefined) sndDelay = 5; //default to 5 secs.
    		 	
    	TweenLite.delayedCall(sndDelay, function() {
    	
    		if (thisRef.curBuildingIndex < thisRef.buildings.length-1) {
    			//call out next building
    			thisRef.curBuildingIndex ++;
    			thisRef.nextBuilding();
    			
    			//Show Tip
    			console.log(" show tip "+ thisRef.curBuildingIndex);
    			if ( thisRef.curBuildingIndex == 0 ) {
    				Tips.showById("page_2_start");
    			} else {
    				Tips.showById("page_2_active_building");
    			}
    			

    		} else {
    			//was last building
    			Tips.showById("page_2_last_building");		
    		}
    		
    	});
    	
    }
        
    return TS_BuildingSequence;
    
});