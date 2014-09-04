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
	
	var curMemberNum = -1;
	var members = [];
	
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
		viewCollection.addView( new View( $(c), "view_3", "imh_screen_3", this.view3Setup ) );
		
		timelineNav = new TimelineNav( $("#screen_integrative  #timeline_nav").first(), viewCollection);
		
	}
	
	Integrative.prototype.view1Setup = function() {
		
	}
	
	Integrative.prototype.view2Setup = function() {
	
		// setup bubbletank
		bubbleTank = new BubbleTank("#screen_integrative #bubble_tank_container");
		bubbleTank.createBubbles(["Physical", "Emotional", "Spiritual", "Social", "Environmental", "Occupational", "Financial"]);
		bubbleTank.distributeInCircle();
		bubbleTank.kill();
		
		setupBubbleDimensions();
	
	}
	
	Integrative.prototype.view3Setup = function() {
		setupTeamMembers();
	}
	
	function changeView(navIndex) {

		viewCollection.gotoView(navIndex);
		timelineNav.refreshDisplays();
		Media.killSounds(); //Don't allow sounds to bleed into next view.		
		
		if ( viewCollection.currentViewIndex == 0 ) {
			
		} else if ( viewCollection.currentViewIndex == 1 ) {
			Tips.showById("page_2_start");
		} else if ( viewCollection.currentViewIndex == 2 ) {
			refreshMemberContent();
			Tips.showById("page_3_start");
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
				
		var allBubs = $("#screen_integrative .bubble");
		TweenLite.to( $(allBubs), 0.5, { css: { scale: 0.65, zIndex:0 } } ); // scale  down, bring to bg
		
		var bub = $("#screen_integrative #"+bubId).first();
		TweenLite.to( $(bub), 0.65, { css: { scale: 0.85, zIndex:1 } } ); // scale  up, bring to foreground
		
		var d = getDimensionById( bubId.substring(4) );
		Media.playTakeoverSound(d[1]);//play audio
		
		 $(bub).find("#bubSubhead").html(d[3]); //populate subhead text
		
		TweenLite.to( $(bub).find("#bubTitle"), 0.35, { css: { top:-100 }, delay:0.35 } ); //top: -43px; // raise bub title
		
		$(bub).find("#bubSubhead").show();
		TweenLite.set( $(bub).find("#bubSubhead"), { css: { opacity:0 } } ); // fade in subhead 
		TweenLite.to( $(bub).find("#bubSubhead"), 0.2, { css: { opacity:1 }, delay:0.35 } ); // fade in subhead 
		
		
		$(bub).addClass('visited');
		checkBubbleCompletion();

	}
	
	function getDimensionById(bubTitle){
		var dim = {};
		for (var j = 0; j < well_dimensions.length; j++) {
			if ( well_dimensions[j][0].toLowerCase() == bubTitle ) {
				dim = well_dimensions[j];
			}
		}
		return dim;
	}
	
	function checkBubbleCompletion() {
		
		if ( $("#screen_integrative .bubble.visited").length >= $("#screen_integrative .bubble").length  ) {
			Tips.showById("page_2_complete");
		}
		
	}
	
	//Screen 3
	function setupTeamMembers() {
	
		members = [];
		
		$(AppData.configXML).find("module[id='integrative'] team team_member").each( function () {
		
			var mId = $(this).attr('id');
			var mAudio = $(this).attr('audio');
			var mDelay = $(this).attr('delay');
			var mTxt = $(this).text();
			var member = [mId, mAudio, mDelay, mTxt];
			members.push( member );
		
		});		
		
		showNextTeamMember();
	
	}
	
	function showPrevTeamMember(){
		
		if (curMemberNum > 0) {
		
			curMemberNum --;
			refreshMemberContent();

		}
		
	}
	
	function showNextTeamMember(){
	
		if (curMemberNum < members.length-1) {
		
			curMemberNum ++;
			refreshMemberContent();
			
			if (curMemberNum == members.length-1) Tips.showById("integrative_end");

		}
		
	}
	
	function refreshMemberContent(){
		
		var titleTxt = members[curMemberNum][0];
		var mainTxt = members[curMemberNum][3];
		
		$("#screen_integrative .imh_screen_3 #text_3").html(titleTxt);
		$("#screen_integrative .imh_screen_3 #text_4").html(mainTxt);
		
		Media.playTakeoverSound(members[curMemberNum][1]);//play audio
		
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
			case "arr_left":
				showPrevTeamMember();
			break;
			case "arr_right":
				showNextTeamMember();
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