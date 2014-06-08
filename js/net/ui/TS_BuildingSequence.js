define(['net/data/AppData', 'net/ui/Tips', 'net/media/Media'], function(AppData, Tips, Media){


    function TS_BuildingSequence( containerDiv ){
    	
    	this.containerDiv = containerDiv;
    	
    	this.buildings = [];
    	this.curBuilding = {};
    	this.curBuildingIndex = 0;

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
    		thisRef.buildings.push([bId, audioSrc, audioDur]);
    	
    	});   
    	    
    }
    
    TS_BuildingSequence.prototype.nextBuilding = function() {
    
   		this.curBuilding = this.buildings[this.curBuildingIndex];
    	
    	var bDiv = $(this.containerDiv).find("#"+this.curBuilding[0]);
    	
    	TweenLite.to( $(bDiv).children("#bw"), 1, { css: { opacity:0 },  ease:Power2.easeOut } );
    	
    	var sndId = this.curBuilding[1];
    	var sndDelay = this.curBuilding[2];
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

    		} else {
    			//was last building
    			console.log("last building completed"); 
    			Tips.showById("page_2_last_building");		
    		}
    		
    	});
    	
    }
        
    return TS_BuildingSequence;
    
});