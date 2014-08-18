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
		"net/ui/WI_Stop", 
		"tween"], 
		function( Pace, AppData, Media, Screen, Navigator, TimelineNav, Tips, View, ViewCollection, Util, WI_Stop )
		{


	// I return an initialized object.
	function Wilder( containerDiv ){

		// Call the super constructor.
		Screen.call( this, containerDiv );

		// Return this object reference.
		return( this );
		
		this.stops = [];
		this.currentStop = {};
		this.currentStopIndex = -1;

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
			
			thisRef.setupStops();
			thisRef.resetStops();
			
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

		$("#screen_wilder #views_container #inner_wheel_container #intro").show();
	
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
	
	 Wilder.prototype.resetStops = function () {
	
		this.currentStop = {};
		this.currentStopIndex = -1;
	
		//default to initial intro texts
		var titleTxt = ""+$(AppData.configXML).find("module[id='wilder'] text[id='intro_title']").first().text();
		var columnTxt = ""+$(AppData.configXML).find("module[id='wilder'] text[id='intro_text']").first().text();
		
		$("#screen_wilder #intro_message #title").html( titleTxt ); // set current title
		$("#screen_wilder #inner_wheel_container #intro #story_intro").html( columnTxt ); // set main text
		
	}
	
	Wilder.prototype.setupStops = function () {
	
		this.stops = [];
		
		//Get all steps from global config
		var thisRef = this;
		var stepConfigs = $(AppData.configXML).find("module[id='wilder'] stops stop").each(function () {
			
			var st = new WI_Stop( $(this) );
			thisRef.stops.push(st);
		
		});   
		
	}
	
	Wilder.prototype.goToNextStop = function () {
	
		this.currentStopIndex ++;
		this.goToStop( this.currentStopIndex );

	}

	Wilder.prototype.goToStop = function (stopNum) {
	
		this.currentStop = this.stops[stopNum];	
		
		console.log("stops: "+this.stops.length);
		
		// - setup stop content - //
		//intro		
		$("#screen_wilder #intro_message #title").html( this.currentStop.title ); // set current title
		$("#screen_wilder #inner_wheel_container #intro #story_intro").html( this.currentStop.introText ); // set main text
		Media.playTakeoverSound( this.currentStop.introAudioId );
		
		/*
		//people
		$(this.containerDiv).find("#screen_wilder #inner_wheel_container .personnel").each(function () {
			//reset all people  
			$(this).removeClass('visited');
			$(this).removeClass('highlight');
			$(this).find("#progress_ring").hide();
			$(this).hide();
		
		});
		//Enable people portraits for this stop
		for (var i = 0; i < this.currentStop.people.length; i++) {
    		
    		var roleId = Util.removeSpaces( this.currentStep.people[i][0] );
    		var persDiv = $(this.containerDiv).find("#person_" + roleId );
  			
  			//Active people can be clicked at anytime
  			$(persDiv).find("#hit").off();
  			$(persDiv).find("#hit").on("click", function(event) {

  				var indexClicked  = thisRef.currentStop.getPersonIndexById( $(this).parent().attr('id') );
  			    thisRef.personClicked( thisRef.currentStep.people[ indexClicked ] );
  			    
  			});
  			//Circular rollovers
  			$(persDiv).find("#hit").on( {
				mouseenter: function() {
					$( this ).parent().addClass( "highlight" );
				}, mouseleave: function() {
					$( this ).parent().removeClass( "highlight" );
				}
  			});
  			
  			
    	}
		*/
			
		//review
		
		
		//spin
		this.spinToBuilding(this.currentStop.buildingId);

	}
	
	Wilder.prototype.spinToBuilding = function ( buildingId ) {
		
		var goToRotation = 0;
		switch ( buildingId ) {
			case "community":
				goToRotation = 0;
			break;
			case "home":
				goToRotation = 90;
			break;
			case "school":
				goToRotation = 180;
			break;
			case "wilder":
				goToRotation = 270;
			break;
		    default:
		    break;
		}
		
		goToRotation = goToRotation + "_short"; // spin closest direction
		TweenMax.to( $(this.containerDiv).find("#wheel"), 0.75, { css: { rotation:goToRotation },  ease:Power1.easeInOut } );

	}
	
	Wilder.prototype.showIntro = function () {
		
		this.transitionInnerCircleTo("intro");
		
	}
	
	Wilder.prototype.showPeople = function () {
		
		this.transitionInnerCircleTo("people");
		
		$("#screen_wilder #inner_wheel_container #people #person_feature").hide();
//		$("#screen_wilder #inner_wheel_container #people #people_btn_next").hide();
		
	}
	
	Wilder.prototype.showReview = function () {
		
		this.transitionInnerCircleTo("review");
		
	}
	
	Wilder.prototype.transitionInnerCircleTo = function (containerId) {
		
		$("#screen_wilder #inner_wheel_container #intro").hide();
		$("#screen_wilder #inner_wheel_container #review").hide();
		$("#screen_wilder #inner_wheel_container #people").hide();
				
		$("#screen_wilder #inner_wheel_container #"+containerId).show();
		
	}
	
	Wilder.prototype.personClicked = function( personData ){

		var thisRef = this;
    	var sndId = personData[1];
    	var sndDelay = personData[2];
    	
    	//Start audio
    	Media.playTakeoverSound( sndId );
    	
    	
    	/*
    	
    	//Move portrait activate portrait
    	this.startPortraitProgressRing( sndDelay );
    	
    	
    	
    	//Wait for end of audio. 
    	if (sndDelay == 'undefined' || sndDelay == null || sndDelay == undefined) sndDelay = 5; //default to 5 secs.
    	var clickedIndex = this.curPersonnelIndex;
    	this.portraitsClicked ++;
    	var numClicked = this.portraitsClicked;
    	
    	//Things that happen AFTER end of sound. Can be interrupted.
    	TweenLite.delayedCall(sndDelay, function(clickedIndex, thisRef, numClicked) {
    	    		
    		if (clickedIndex != thisRef.curPersonnelIndex || thisRef.portraitsClicked != numClicked  ) return; // If this portrait is no longer the active one, exit delayed call.
    	
    		//drop leaf if there is feedback associated
    		var fTxt = personnelData[3];
    		if (typeof fTxt !== 'undefined' && fTxt !== false) {
    			thisRef.waitingFeedback = fTxt;
    			thisRef.triggerAwaitingFeedback();
    		}
    		
			if ( thisRef.allActivePersonnelClicked() == false ) {
			
    			//call out next personnel
    			thisRef.callOutNextPersonnel();

    		} else {
    			
    			//was last personnel to call out. 
    			thisRef.killCurrentActivePersonnel();
    			
    			//kill speech bubble
    			thisRef.killSpeechBubble();
    			
    			//show review media/quiz
    			$(thisRef.containerDiv).find("#center_oval #step_description_container").hide();   
    			$(thisRef.containerDiv).find("#center_oval #review_container").show();    
    			
    			Tips.showById("page_3_show_review");
    					
    		}
	    		
    	}, [clickedIndex, thisRef, numClicked]);

		*/
    };

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
				if (this.currentStopIndex == -1){
					this.goToNextStop();
				 } else {
				 	this.showPeople();
				 }
			break;
			case "person_feature_btn_back":
				//return from person feature
				$("#screen_wilder #personnel_layer").show();
				$("#screen_wilder #person_feature").hide();
			break;
			case "people_btn_next":
				//continue after all people visited
				this.showReview();
			break;
			case "review_btn_back":
				// return to people photos
				$("#screen_wilder #intro").show();
				$("#screen_wilder #review").hide();
			break;
			case "review_btn_next":
				// continue to next building section
				 this.goToNextStop();
			break;
			case "review_QA_btn_back":
				// return to review list from QUIZ
				
			break;
			case "review_text_btn_back":
				// return to review list from TEXT 
				 
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