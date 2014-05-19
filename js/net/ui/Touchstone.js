define(["libs/pace.min", 
		"net/data/AppData",
		"net/media/Media", 
		"net/ui/Screen", 
		"net/ui/Navigator", 
		"net/ui/TimelineNav",
		"net/ui/Tips", 
		"net/ui/BubbleTank",
		"net/ui/TS_FeatureBubble",
		"net/ui/View", 
		"net/ui/ViewCollection", 
		"tween"], 
		function( Pace, AppData, Media, Screen, Navigator, TimelineNav, Tips, BubbleTank, TS_FeatureBubble, View, ViewCollection )
		{


	// I return an initialized object.
	function Touchstone( containerDiv ){

		// Call the super constructor.
		Screen.call( this, containerDiv );

		// Return this object reference.
		return( this );

	}

	// The Touchstone class extends the base Screen class.
	Touchstone.prototype = Object.create( Screen.prototype );
	
	//public vars
	var tipShowing = false;
	var leafHasDropped = false;
	
	var timelineNav = {};
	var viewCollection = {};
	
	var currentStepId = "";
	var bubbleTank = {};
	var featureBubble = {};
	
	
	Touchstone.prototype.setup = function() {
	
		//setup View Collection
		var c = $("#screen_touchstone #views_container");
		viewCollection = new ViewCollection( $(c), "trustone_views");
		
		//Setup tips
		Tips.setContainerDiv("#screen_touchstone #touchstone_tip");
		
		//First time view collection is loaded, default to view 1
		var thisRef = this;
		Pace.once("done", function() {
			
			//All setup and loading finished. go to first view. 
			viewCollection.gotoView(0);
			timelineNav.refreshDisplays();
			thisRef.refreshButtonListeners();
			
			Tips.showById("touchstone_start");
			
		});
		
		viewCollection.addView( new View( $(c), "view_1", "touchstone_1") ); // ( containerDiv, contentId, templateId )
		viewCollection.addView( new View( $(c), "view_2", "view_2") );
		viewCollection.addView( new View( $(c), "view_3", "view_3", this.view3Setup) );
		viewCollection.addView( new View( $(c), "view_4", "touchstone_1") );
		
		timelineNav = new TimelineNav( $("#screen_touchstone  #timeline_nav").first(), viewCollection);

	}
	
	Touchstone.prototype.view3Setup = function() {
	
		bubbleTank = new BubbleTank("#screen_touchstone #bubble_tank_container");
		bubbleTank.createBubbles(["Physical", "Emotional", "Spiritual", "Social", "Environmental", "Occupational", "Financial"]);
		bubbleTank.distributeInCircle();
		bubbleTank.kill();
		
		featureBubble = new TS_FeatureBubble("#screen_touchstone #steps_feature_bubble"); // Larger bubble containing expanded step features
		featureBubble.setupSteps();
		
		//update step navigation titles & bubble linkages
		$("#screen_touchstone #step_buttons_container .stepBtn").each(function (index) {
			$(this).find("#title").html(featureBubble.steps[index].title);
		});
				
	}
	
	function changeView(navIndex) {
		
		if (viewCollection.currentViewIndex == 2 && navIndex != 2) {
			bubbleTank.kill();
		}
		
		viewCollection.gotoView(navIndex);
		timelineNav.refreshDisplays();
		
		if (viewCollection.currentViewIndex == 2) {
			bubbleTank.reset(); // reset and start bubbles
		}
	
	}

	//Bubbles/Steps
	function activateBubblesForStep(id){

		var dimensions = featureBubble.getAssociatedDimensionsOfStep(id);
		bubbleTank.activateBubbles(dimensions);

	}
	
	function resetLeaf() {
		var leaf = $("#header_bar #center_leaf");
		TweenLite.set( $(leaf), { css: { top: -158, left: 464, rotation: 0 } } );
		TweenLite.to( $(leaf), 1.5, { css: { top: -59 }, ease:Power2.easeInOut, onComplete:leafResetComplete } );
	}
	
	function leafResetComplete(){
		leafHasDropped = false;
	}
	
	
	function dropLeaf() {
		var leaf = $("#header_bar #center_leaf");
		TweenLite.to( $(leaf), 2, { css: { top: 600, left: 150, rotation: 222 }, ease:Power2.easeInOut, onComplete:leafDropComplete } );
	}
	
	function leafDropComplete(){
	
		leafHasDropped = true;
		
	}

	
	//Overwrite button handlers
	Touchstone.prototype.buttonClicked = function(btnId, btnRef) {
	
		console.log("Touchstone btn clicked: "+ btnId);
	    				
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
    		Media.launchVideo(vidId);
    		    		    		
    	    return;
    	    
    	}
    	if (btnId.substring(0, 6) == "audio_") {
    	    	
    		var audId = btnRef.attr('data-audio');
    		Media.playTakeoverSound(audId);
    		    		    		
    	    return;
    	    
    	}
    	//steps/bubble nav
    	if (btnId.substring(0, 5) == "step_") {
    		
    		$("#navigation_bar #step_buttons_container .stepBtn").removeClass('active');
    		$(btnRef).addClass('active');
    		console.log("active");
    		currentStepId = $(btnRef).find("#title").text();
    		activateBubblesForStep(currentStepId);
    	    return;
    	    
    	}
    	//bubbles nav
    	if (btnId.substring(0, 4) == "bub_") {
    	
    		if ($(btnRef).css("cursor") == "pointer") {
    			bubbleTank.collapseActives();
    			featureBubble.setupAndShow( currentStepId );
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
	    	case "center_leaf":
	    		if (leafHasDropped == false) {
	    			dropLeaf();
	    		}else {
	    			resetLeaf();
	    		}
			break;
			case "btn_feature_close":
				bubbleTank.reset();
				featureBubble.kill();
			break;
			case "btn_tips":
			case "btn_tips_inner":
			case "touchstone_tip":
				Tips.toggle();
			break;
			case "btn_resources":
				Tips.showById("click_step_1");
			break;
			case "btn_quit_program":
				AppData.quitProgram();
			break;		
	        default:
	        
	            break;
	    }
	        
	};

	return Touchstone;

});