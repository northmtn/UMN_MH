define(["libs/pace/pace.min", 
		"net/data/AppData",
		"net/media/Media", 
		"net/ui/Screen", 
		"net/ui/Navigator", 
		"net/ui/TimelineNav",
		"net/ui/Tips", 
		"net/ui/View", 
		"net/ui/ViewCollection", 
		"tween"], 
		function( Pace, AppData, Media, Screen, Navigator, TimelineNav, Tips, View, ViewCollection )
		{


	// I return an initialized object.
	function Wilder( containerDiv ){

		// Call the super constructor.
		Screen.call( this, containerDiv );

		// Return this object reference.
		return( this );

	}

	// The Wilder class extends the base Screen class.
	Wilder.prototype = Object.create( Screen.prototype );
	
	//public vars
	var tipShowing = false;
	
	var timelineNav = {};
	var viewCollection = {};
	
	
	Wilder.prototype.setup = function() {
	
		//setup View Collection
		var c = $("#screen_wilder #views_container");
		viewCollection = new ViewCollection( $(c), "wilder_views");
		
		//Setup tips
		Tips.setContainerDiv("#screen_wilder #tips_container");

		//First time view collection is loaded, default to view 1
		var thisRef = this;
		Pace.once("done", function() {
			
			//All setup and loading finished. go to first view. 
			viewCollection.gotoView(0);
			timelineNav.refreshDisplays();
			thisRef.refreshButtonListeners();
			
			Tips.showById("wilder_entered");
			
		});
		
		viewCollection.addView( new View( $(c), "view_1", "two_column_intro", this.view1Setup) ); 
		viewCollection.addView( new View( $(c), "view_2", "wilder_circle", this.view2Setup ) );
		viewCollection.addView( new View( $(c), "view_3", "two_column_conclusion", this.view3Setup ) );
		
		timelineNav = new TimelineNav( $("#screen_wilder  #timeline_nav").first(), viewCollection);

	}
	
	Wilder.prototype.view1Setup = function() {
	
	}
	
	Wilder.prototype.view2Setup = function() {
	
	}
	
	Wilder.prototype.view3Setup = function() {
		
	}
	
	function changeView(navIndex) {

		viewCollection.gotoView(navIndex);
		timelineNav.refreshDisplays();
		Media.killSounds(); //Don't allow sounds to bleed into next view.		
		
		if ( viewCollection.currentViewIndex == 0 ) {
			
		} else if ( viewCollection.currentViewIndex == 1 ) {

		} else if ( viewCollection.currentViewIndex == 2 ) {

		} else if ( viewCollection.currentViewIndex == 3 ) {
			
		}

	}
	
	//Overwrite button handlers
	Wilder.prototype.buttonClicked = function(btnId, btnRef) {
	
		console.log("Wilder btn clicked: "+ btnId);
	    				
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
				TweenMax.to( $(this.containerDiv).find("#wheel"), 0.75, { css: { rotation:"+=90" },  ease:Power1.easeInOut } );
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

	return Wilder;

});