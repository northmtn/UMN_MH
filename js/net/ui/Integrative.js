define(["libs/pace/pace.min", 
		"net/data/AppData",
		"net/media/Media", 
		"net/ui/Screen", 
		"net/ui/Navigator", 
		"net/ui/TimelineNav",
		"net/ui/Tips", 
		"net/ui/View", 
		"net/ui/ViewCollection", 
		"net/util/Util",
		"net/ui/BubbleTank",
		"tween"], 
		function( Pace, AppData, Media, Screen, Navigator, TimelineNav, Tips, View, ViewCollection, Util, BubbleTank )
		{


	// I return an initialized object.
	function Integrative( containerDiv ){

		// Call the super constructor.
		Screen.call( this, containerDiv );
		
		this.stops = [];
		this.currentStop = {};
		this.currentStopIndex = -1;
		
		this.curPersonDiv = {};
		
		this.currentReading = {};
		this.currentQuiz = {};
		this.reviewCompleted = false;
		this.waitingFeedback = null;

		// Return this object reference.
		return( this );

	}

	// The Integrative class extends the base Screen class.
	Integrative.prototype = Object.create( Screen.prototype );
	
	//public vars
	var tipShowing = false;
	
	var timelineNav = {};
	var viewCollection = {};
	
	var bubbleTank = {};
	var featureBubble = {};
	var well_dimensions = [];
	
	Integrative.prototype.setup = function() {
	
		//setup View Collection
		var c = $("#screen_integrative #views_container");
		viewCollection = new ViewCollection( $(c), "integrative_views");
		
		//Setup tips
		Tips.setContainerDiv("#screen_integrative #tips_container");

		//First time view collection is loaded, default to view 1
		var thisRef = this;
		Pace.once("done", function() {
			
			//All setup and loading finished. go to first view. 
			viewCollection.gotoView(0);
			timelineNav.refreshDisplays();
			thisRef.refreshButtonListeners();
			
			Tips.showById("integrative_entered");
			
		});
		
		viewCollection.addView( new View( $(c), "view_1", "two_column_intro_b", this.view1Setup) ); 
		viewCollection.addView( new View( $(c), "view_2", "imh_screen_2", this.view2Setup ) );
		viewCollection.addView( new View( $(c), "view_3", "two_column_conclusion", this.view3Setup ) );
		
		timelineNav = new TimelineNav( $("#screen_integrative  #timeline_nav").first(), viewCollection);
		
	}
	
	Integrative.prototype.view1Setup = function() {
		
	}
	
	Integrative.prototype.view2Setup = function() {
	
		// setup bubbletank
		console.log("setup bubble tank");
		bubbleTank = new BubbleTank("#screen_integrative #bubble_tank_container");
		bubbleTank.createBubbles(["Physical", "Emotional", "Spiritual", "Social", "Environmental", "Occupational", "Financial"]);
		bubbleTank.distributeInCircle();
		bubbleTank.kill();
		
		setupBubbleDimensions();
	
	}
	
	Integrative.prototype.view3Setup = function() {
		
	}
	
	function changeView(navIndex) {

		viewCollection.gotoView(navIndex);
		timelineNav.refreshDisplays();
		Media.killSounds(); //Don't allow sounds to bleed into next view.		
		
		if ( viewCollection.currentViewIndex == 0 ) {
			
		} else if ( viewCollection.currentViewIndex == 1 ) {
			
		} else if ( viewCollection.currentViewIndex == 2 ) {
						
		}

	}
	
	function setupBubbleDimensions() {
	
		well_dimensions = [];
		
		$(AppData.configXML).find("module[id='integrative'] dimensions dimension").each( function () {
		
			var dId = $(this).attr('id');
			var dAudio = $(this).attr('audio');
			var dDelay = $(this).attr('delay');
			var dTxt = $(this).text();
			var dimension = [dId, dAudio, dDelay, dTxt];
			well_dimensions.push( dimension );
		
		});		
	
	}
	
	function expandBubble(bubId) {
		
		console.log("truck: "+bubId);
		
		var bub = $("screen_integrative #"+bubId).first();
		TweenLite.to( $(bub), 0.75, { css: { scale: 1.2, zIndex:1 } } ); // scale  up, bring to foreground
		
	}
	
	//Overwrite button handlers
	Integrative.prototype.buttonClicked = function(btnId, btnRef) {
	
		console.log("Integrative btn clicked: "+ btnId);
	    				
		// catch specific types of buttons...
		//timeline nav
		if (btnId.substring(0, 8) == "navIcon_") {
		    	
    		var navIndex = btnId.substring(8);
    		changeView( navIndex );
    		
    	    return;
    	    
    	}
    	//media buttons
    	if (btnId.substring(0, 6) == "video_") {
    	    	
    		var vidId = btnRef.attr('data-video');
    		Media.launchVideo(vidId, true);
    		    		    		
    	    return;
    	    
    	}
    	if (btnId.substring(0, 6) == "audio_") {
    	    	
    		var audId = btnRef.attr('data-audio');
    		Media.playTakeoverSound(audId);
    		    		    		
    	    return;
    	    
    	}
    	//bubbles nav
    	if (btnId.substring(0, 4) == "bub_") {
    	
    		if ($(btnRef).css("cursor") == "pointer") {
    			expandBubble(btnId);
    		}
    	    return;
    	    
    	}
       	//global nav
    	if (btnId.substring(0, 5) == "goto_") {
    	
    		//main menu nav
    		var screenId = btnId.substring(5);
    		Navigator.goToScreen( screenId );
    	    return;
    	    
    	}
	
	    //other btns...
	    switch (btnId) {
			case "btn_tips":
			case "btn_tips_inner":
			case "tips_container":
				Tips.toggle();
			break;
			case "intro_btn_start":
				
			break;
			case "btn_resources":
				//TODO - Go to resources page?
			break;
			case "btn_quit_program":
				AppData.quitProgram();
			break;		
	        default:
	        
	            break;
	    }
	        
	};

	return Integrative;

});