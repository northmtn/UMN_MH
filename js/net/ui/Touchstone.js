define(["libs/pace/pace.min", 
		"net/data/AppData",
		"net/media/Media", 
		"net/ui/Screen", 
		"net/ui/Navigator", 
		"net/ui/TimelineNav",
		"net/ui/Tips", 
		"net/ui/TS_BuildingSequence",
		"net/ui/BubbleTank",
		"net/ui/TS_FeatureBubble",
		"net/ui/TS_Feedback",
		"net/ui/View", 
		"net/ui/ViewCollection", 
		"tween"], 
		function( Pace, AppData, Media, Screen, Navigator, TimelineNav, Tips, TS_BuildingSequence, BubbleTank, TS_FeatureBubble, TS_Feedback, View, ViewCollection )
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
	
	var buildingSequence = {};
	
	var currentStepId = "";
	var currentStepNum = 0;
	var bubbleTank = {};
	var featureBubble = {};
	
	
	Touchstone.prototype.setup = function() {
	
		//setup View Collection
		var c = $("#screen_touchstone #views_container");
		viewCollection = new ViewCollection( $(c), "trustone_views");
		
		//Setup tips
		Tips.setContainerDiv("#screen_touchstone #tips_container");
		
		//Setup feedback
		TS_Feedback.setup();
		
		//First time view collection is loaded, default to view 1
		var thisRef = this;
		Pace.once("done", function() {
			
			//All setup and loading finished. go to first view. 
			viewCollection.gotoView(0);
			timelineNav.refreshDisplays();
			thisRef.refreshButtonListeners();
			
			Tips.showById("touchstone_entered");
			
		});
		
		viewCollection.addView( new View( $(c), "view_1", "two_column_intro") ); // ( containerDiv, contentId, templateId )
		viewCollection.addView( new View( $(c), "view_2", "touchstone_buildings", this.view2Setup ) );
		viewCollection.addView( new View( $(c), "view_3", "touchstone_steps", this.view3Setup ) );
		viewCollection.addView( new View( $(c), "view_4", "two_column_conclusion") );
		
		timelineNav = new TimelineNav( $("#screen_touchstone  #timeline_nav").first(), viewCollection);

	}
	
	Touchstone.prototype.view2Setup = function() {
	
		buildingSequence = new TS_BuildingSequence( $("#screen_touchstone #buildings") );
		buildingSequence.setup();
				
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
		Media.killSounds(); //Don't allow sounds to bleed into next view.		
		
		if ( viewCollection.currentViewIndex == 0 ) {
			
		} else if ( viewCollection.currentViewIndex == 1 ) {
			buildingSequence.reset();
			startContinuumSequence();
		} else if ( viewCollection.currentViewIndex == 2 ) {
			Tips.showById("page_3_step_1");
			bubbleTank.reset(); // reset and start bubbles
		} else if ( viewCollection.currentViewIndex == 3 ) {
			Tips.showById("touchstone_end");
		}

	}
	
	//Continuum Sequence
	function startContinuumSequence() {
		
		TweenLite.delayedCall( 0.75, function() {
			buildingSequence.startIntro();
		});
		
	
	}

	//Bubbles/Steps
	function activateBubblesForStep(id){

		var stepInfo = featureBubble.getStepInfo(id);
		bubbleTank.activateBubbles(stepInfo[0]);
		Media.playTakeoverSound( stepInfo[1] );

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
    		Media.launchVideo(vidId, true);
    		    		    		
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
    		currentStepId = $(btnRef).find("#title").text();
    		currentStepNum  = parseInt($(btnRef).attr("data-order"));
    		Tips.showById("page_3_step_"+currentStepNum+"b");
    		activateBubblesForStep(currentStepId);
    	    return;
    	    
    	}
    	//bubbles nav
    	if (btnId.substring(0, 4) == "bub_") {
    	
    		if ($(btnRef).css("cursor") == "pointer") {
    			bubbleTank.collapseActives();
    			featureBubble.setupAndShow( currentStepId );
    			Tips.showById("page_3_personnel");
    		}
    	    return;
    	    
    	}
    	//Buildings
    	if (btnId.substring(0, 9) == "building_") {
    		buildingSequence.playBuilding(btnId);
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
			case "leaf_feedback_box":
				if (TS_Feedback.feedbackShowing == true) {
					TS_Feedback.closeAndReset();
				}
			break;
			case "btn_feature_close":
				bubbleTank.reset();
				Tips.showById("page_3_step_"+(currentStepNum+1)); // tell user to click next step
				featureBubble.kill();
			break;
			case "btn_tips":
			case "btn_tips_inner":
			case "tips_container":
				Tips.toggle();
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

	return Touchstone;

});