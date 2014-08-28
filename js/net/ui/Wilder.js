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
		"net/ui/ProgressRing", 
		"net/ui/Quiz", 
		"tween"], 
		function( Pace, AppData, Media, Screen, Navigator, TimelineNav, Tips, View, ViewCollection, Util, WI_Stop, ProgressRing, Quiz )
		{


	// I return an initialized object.
	function Wilder( containerDiv ){

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
		
		//Set colors for progress ring
		ProgressRing.setup(54, 15,"#ddd", "#d29773");

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
			
			var introAudioId = ""+$(AppData.configXML).find("module[id='wilder'] text[id='intro_text']").first().attr('audio');
			var introAudioDelay = ""+$(AppData.configXML).find("module[id='wilder'] text[id='intro_text']").first().attr('duration');
			Media.playTakeoverSound( introAudioId );
			//Display tip if user doesn't skip intro
			TweenLite.delayedCall(introAudioDelay, function() {
					if ( $("#screen_wilder #inner_wheel_container #intro").is(':visible') == true) Tips.showById("wilder_page_2_intro_complete");
			});
			
			
		} else if ( viewCollection.currentViewIndex == 2 ) {
			
			Tips.showById("wilder_end");
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
		var stopConfigs = $(AppData.configXML).find("module[id='wilder'] stops stop").each(function () {
			
			var st = new WI_Stop( $(this) );
			thisRef.stops.push(st);
		
		});   
		
	}
	
	Wilder.prototype.goToNextStop = function () {
	
		this.currentStopIndex ++;
		this.goToStop( this.currentStopIndex );

	}

	Wilder.prototype.goToStop = function (stopNum) {
		
		var thisRef = this;
		this.currentStop = this.stops[stopNum];	
		
		// - setup stop content - //
		//intro		
		$("#screen_wilder #intro_message #title").html( this.currentStop.title ); // set current title
		$("#screen_wilder #inner_wheel_container #intro #story_intro").html( this.currentStop.introText ); // set main text
		Media.playTakeoverSound( this.currentStop.introAudioId );
		
		
		//people
		$("#screen_wilder #views_container #inner_wheel_container #people_btn_next").hide();//don't show next btn until all people visited
		$(this.containerDiv).find("#personnel_layer .personnel").each(function () {
			//reset all people  
			$(this).removeClass('visited highlight row1 row2 col1 col2 col3 col4 col5');
			$(this).find("#progress_ring").hide();
			$(this).hide();
					
		});
		//Enable people portraits for this stop
		for (var i = 0; i < this.currentStop.people.length; i++) {
    		
    		var roleId = this.currentStop.people[i][0];
    		var persDiv = $(this.containerDiv).find("#person_" + roleId );
    		    		
    		$(persDiv).show();
    		
    		//add positioning classes
    		var posRowIndex = ( ( i + 1 ) % 2 ) + 1;
    		var posColIndex = i + 1;
    		if (this.currentStop.people.length == 3) {
    			
    			if ( i==1 ) {
    				posRowIndex = 1;
    				posColIndex = 3;
    			} else if ( i==2 ) {
    				posRowIndex = 2;
    				posColIndex = 5;
    			}
    			
    		} else if (this.currentStop.people.length == 4) {
    			
    			if ( i > 1 ) {
    				posColIndex ++;
    				posRowIndex = ( i % 2 ) + 1;
    			}
    			
    		}
    		
    		$(persDiv).addClass("row" + posRowIndex);
    		$(persDiv).addClass( "col" + posColIndex);
  			
  			//Active people can be clicked at anytime
  			$(persDiv).find("#hit").off();
  			$(persDiv).find("#hit").on("click", function(event) {

  				var indexClicked  = thisRef.currentStop.getPersonIndexById( $(this).parent().attr('id') );
  			    thisRef.personClicked( thisRef.currentStop.people[ indexClicked ] );
  			    
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
			
		//review
		//review buttons
		$(this.containerDiv).find("#review_list button.rect-button").each( function (index) {
			
			//Remove any previous review click listeners
			$(this).off( "click", thisRef.reviewBtnClicked );
			
			if (index < thisRef.currentStop.reviewBtns.length) {
	
				//set button text
				$(this).html(thisRef.currentStop.reviewBtns[index][0]);
				
				var vSrc = thisRef.currentStop.reviewBtns[index][1];//video
				var aSrc = thisRef.currentStop.reviewBtns[index][2];//audio
				var rSrc = thisRef.currentStop.reviewBtns[index][3];//reading
				var qSrc = thisRef.currentStop.reviewBtns[index][4];//quiz
				var rFeedback = thisRef.currentStop.reviewBtns[index][5];//feedback
				
				console.log("setup reviw btn: "+vSrc);
				
				//clear previous meta data
				$(this).removeAttr( 'data-video' );
				$(this).removeAttr( 'data-audio' );
				$(this).removeAttr( 'data-reading' );
				$(this).removeAttr( 'data-quiz' );
				$(this).removeAttr( 'data-feedback' );
								
				//add video links
				if (typeof vSrc !== 'undefined' && vSrc !== false) {
					$(this).attr('data-video', vSrc);
					$(this).attr('id', 'video_'+index);
				}
				
				//add audio link
				if (typeof aSrc !== 'undefined' && aSrc !== false) {
					$(this).attr('data-audio', aSrc);
					$(this).attr('id', 'audio_'+index);
				}
				
				//add reading link
				if (typeof rSrc !== 'undefined' && rSrc !== false) {
					$(this).attr('data-reading', rSrc);
					$(this).attr('id', 'reading_'+index);
				}
				
				//add Question/Answer link
				if (typeof qSrc !== 'undefined' && qSrc !== false) {
					$(this).attr('data-quiz', qSrc);
					$(this).attr('id', 'quiz_'+index);
				}
				
				//add optional feedback text. Will trigger leaf/feedback box.
				if (typeof rFeedback !== 'undefined' && rFeedback !== false) {
					$(this).attr('data-feedback', rFeedback);
				}
				
				$(this).show();
				$(this).on( "click", { thisRef: thisRef }, thisRef.reviewBtnClicked );
				
			} else {
			
				$(this).hide();
				
			}
			
			$(this).removeClass('visited');
		
		});

		
		//spin
		this.spinToBuilding(this.currentStop.buildingId);
		Tips.showById("wilder_new_building");
		
		//display intro
		this.showPeople();

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
		
		Tips.showById("wilder_review_start");
		
	}
	
	Wilder.prototype.transitionInnerCircleTo = function (containerId) {
		
		$("#screen_wilder #inner_wheel_container #intro").hide();
		$("#screen_wilder #inner_wheel_container #review").hide();
		$("#screen_wilder #inner_wheel_container #people").hide();
				
		$("#screen_wilder #inner_wheel_container #"+containerId).show();
		
	}
	
	Wilder.prototype.personClicked = function( personData ){
		
		console.log("person clicked: "+ personData[0] );
		
		var thisRef = this;
    	var sndId = personData[1];
    	var sndDelay = personData[2];
    	
    	//Start audio
    	Media.playTakeoverSound( sndId );
    	
    	this.killCurrentActivePersonnel();
       	this.curPersonDiv = $(this.containerDiv).find("#person_" + personData[0] ).first();
    	this.startActivePortrait();

    	//Move portrait activate portrait
    	this.startPortraitProgressRing( sndDelay );
    	
    	/*
    	
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
		
		//Check if all people have been visited
		var numVisited = 0;
		for (var i = 0; i < this.currentStop.people.length; i++) {
			
			var roleId = this.currentStop.people[i][0];
			var persDiv = $(this.containerDiv).find("#person_" + roleId );
			if ($(persDiv).hasClass("visited")) numVisited++;
			
		}
		if (numVisited == this.currentStop.people.length) {
			//show next btn
			$("#screen_wilder #views_container #inner_wheel_container #people_btn_next").fadeIn('slow');
			Tips.showById("wilder_last_person_completed");
		}
		
		
    };
    
    Wilder.prototype.startPortraitProgressRing = function( sndDelay ) {
    
    	ProgressRing.startProgress( sndDelay, this.curPersonDiv );
    	
    }
    
    Wilder.prototype.startActivePortrait = function( ) {
    	
    	if ( this.curPersonDiv ) {
    			
			//Mark this div as visited until reset
			$(this.curPersonDiv).addClass('visited');
		    		
			//Make portrait 'wobble' as it talks
			TweenMax.set( $(this.curPersonDiv).find(".circle-portrait img"), { css: { rotation:-3 } } ); 
			TweenMax.to( $(this.curPersonDiv).find(".circle-portrait img"), 0.75, { css: { rotation:3 },  ease:Power1.easeInOut, yoyo: true, repeat:99 } ); // Teetering rotation
			
			//Populate speech text
//			var speechTitle = this.currentStop.people[ this.curPersonIndex ][0] + "";
//			var speechTxt = this.currentStop.people[ this.curPersonIndex ][4];
//			$(this.containerDiv).find("#center_oval #step_title").html( speechTitle.toUpperCase() );
//			$(this.containerDiv).find("#center_oval #description").html( speechTxt );
//			    		    		
			    		    		
    	}
    	
    }
    
    Wilder.prototype.killCurrentActivePersonnel = function( ) {
        	
        	if ( this.curPersonDiv ) {
        		
        		TweenLite.to( $(this.curPersonDiv), 0.5, { css: { scale:1, zIndex:0 },  ease:Power2.easeOut } );
        		TweenMax.killTweensOf( $(this.curPersonDiv).find(".circle-portrait img") );

        		this.curPersonnelDiv = null;
        		
        	}
        }
    
    Wilder.prototype.reviewBtnClicked = function( event ) {
    	
    	var thisRef = event.data.thisRef;
    	
    	$(this).addClass('visited');
    	    	
    	//check for associated feedback
    	var fTxt = $(this).attr('data-feedback');
    	if (typeof fTxt !== 'undefined' && fTxt !== false) {
    		thisRef.waitingFeedback = fTxt;
    	}
    	
    	//check review progress
    	var numVisible = $(this).parent().find("button:visible").length;
    	var numVisited = $(this).parent().find("button.visited").length;
    	if (numVisited >= numVisible) {
    		thisRef.reviewCompleted = true;
    	}
    	
    	//if reading btn or quiz btn
    	var rSrc = $(this).attr('data-reading');
    	var qSrc = $(this).attr('data-quiz');
    	if (typeof rSrc !== 'undefined' && rSrc !== false) {
    		thisRef.showReading( rSrc );
    		
    	} else if (typeof qSrc !== 'undefined' && qSrc !== false) {
    		thisRef.showQuiz( qSrc );
    		
    	} else {
    		//not quiz, no need to delay completion check
    		thisRef.checkForReviewCompletion();
    		
    	}

    }

    Wilder.prototype.checkForReviewCompletion = function( ) {
        
    	//Drop leaf and show feedback if any is waiting. 
    	this.triggerAwaitingFeedback();

    	if (this.reviewCompleted == true) {
    		
    		Tips.showById("wilder_review_complete");
    		
    	}
    	
    }
    
    Wilder.prototype.triggerAwaitingFeedback = function() {
    
    	if (this.waitingFeedback != null) {
        	WI_Feedback.populateFeedback(this.waitingFeedback);
        	WI_Feedback.dropLeaf();
        	this.waitingFeedback = null;
    	}
    	
    }
    
    Wilder.prototype.showQuiz = function( quizId ) {
        	
    	//Setup up quiz
    	var quizData = this.currentStop.getQuizById( quizId );
    	
    	this.currentQuiz = new Quiz( $(this.containerDiv).find("#inner_wheel_container #question_answer_container"), $(quizData), this );
    	this.currentQuiz.setFinishHideMode(true);
		this.currentQuiz.reset();
    	
    	//show review media/quiz
    	$(this.containerDiv).find("#inner_wheel_container #review_list").hide();   
    	$(this.containerDiv).find("#inner_wheel_container #question_answer_container").show();  

    }
    
     Wilder.prototype.hideQuiz = function( ) {
        	
    	//hide  media/quiz
    	$(this.containerDiv).find("#inner_wheel_container #review_list").show();   
    	$(this.containerDiv).find("#inner_wheel_container #question_answer_container").hide();  

    }
    
    Wilder.prototype.onQuizFinished = function( ) {
    
    	// keep for quiz callback

    }
    
    Wilder.prototype.showReading = function( readingId ) {
        	
    	//Setup up quiz
    	var readingData = this.currentStop.getReadingById( readingId );
    	var title = $(readingData).attr('title');
    	var audio = $(readingData).attr('audio');
    	var duration = $(readingData).attr('duration');
    	var main = $(readingData).text();
    	
    	//Set reading text
    	$(this.containerDiv).find("#inner_wheel_container #review_text #title").html( title ); //title
    	$(this.containerDiv).find("#inner_wheel_container #review_text #main").html( main ); //main
    	
    	//show review media/quiz
    	$(this.containerDiv).find("#inner_wheel_container #review_list").hide();   
    	$(this.containerDiv).find("#inner_wheel_container #review_text").show();  
    	
    	//Play media
    	Media.playTakeoverSound(audio);

    }
    
    Wilder.prototype.hideReading = function( ) {

    	//show review media/quiz
    	$(this.containerDiv).find("#inner_wheel_container #review_list").show();   
    	$(this.containerDiv).find("#inner_wheel_container #review_text").hide();  

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
				this.hideQuiz();
			break;
			case "review_text_btn_back":
				// return to review list from TEXT 
				this.hideReading();
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