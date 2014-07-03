define(['net/data/AppData', 'net/util/Util', 'net/ui/TS_Step', 'net/ui/TS_Feedback', 'net/ui/Tips', 'net/media/Media', 'net/ui/Quiz'], function(AppData, Util, TS_Step, TS_Feedback, Tips, Media, Quiz){


    function TS_FeatureBubble( containerDiv ){
    	
    	this.containerDiv = containerDiv;
    	
    	this.steps = [];
    	this.currentStep = {};
    	
    	this.curPersonnelIndex = -1;
    	this.numActivePersonnel = 0;
    	this.personnelOrderInterrupted = false;
 		this.curPersonnelDiv = {};
 		this.currentQuiz = {};
 		this.reviewCompleted = false;
 		
 		this.waitingFeedback = null;
 		this.audioProgress = 0.0;
 		this.curAudioDuration = 0;

    }
    
    TS_FeatureBubble.prototype.setupSteps = function() {
    	
    	//Get all steps from global config
    	var thisRef = this;
    	var stepConfigs = $(AppData.configXML).find("touchstone_steps step").each(function () {
    		
    		var st = new TS_Step( $(this) );
    		thisRef.steps.push(st);
    	
    	});   
    	    
    }
    
    TS_FeatureBubble.prototype.getStepInfo = function( stepId ) {
    	
    	//update current step config
    	for (var i = 0; i < this.steps.length; i++) {
    				
    		if ( this.steps[i].id == stepId ) {
    			
    			//return dimensions array and sound id
    			return [this.steps[i].dimensions, this.steps[i].introAudioId];
    			
    		}
    		
    	}
    
    }

    TS_FeatureBubble.prototype.setupAndShow = function( stepId ) {
    
    	var thisRef = this;
    	
    	//update current step config
    	for (var i = 0; i < this.steps.length; i++) {
					
			if ( this.steps[i].id == stepId ) {
			
				this.currentStep = this.steps[i];
				
			}
  		
    	}
    	
    	//Reset data from previous step feature
    	this.curPersonnelIndex = -1;
    	this.numActivePersonnel = 0;
    	this.reviewCompleted = false;
    	this.personnelOrderInterrupted = false;
    			
    	//Setup display based on step config
    	//TODO - bubble color
    	
    	//title
    	$(this.containerDiv).find("#step_feature_title").html( this.currentStep.dimensionsTitle );
    	
    	//center oval content
    	$(this.containerDiv).find("#center_oval #step_title").html( this.currentStep.descriptionTitle );
    	$(this.containerDiv).find("#center_oval #description").html( this.currentStep.descriptionContent );
    	
    	//show default view on center oval
    	$(thisRef.containerDiv).find("#center_oval div").hide();
    	$(thisRef.containerDiv).find("#center_oval #step_description_container").show();   
    	
    	//review buttons
    	$(this.containerDiv).find("#review_container button.rect-button").each(function (index) {
    		
    		if (index < thisRef.currentStep.reviewBtns.length) {
    			
    			//set button text
    			$(this).html(thisRef.currentStep.reviewBtns[index][0]);
    			
    			var vSrc = thisRef.currentStep.reviewBtns[index][1];
    			var aSrc = thisRef.currentStep.reviewBtns[index][2];
    			var qSrc = thisRef.currentStep.reviewBtns[index][3];
    			var rFeedback = thisRef.currentStep.reviewBtns[index][4];
    			
    			//add video link
    			if (typeof vSrc !== 'undefined' && vSrc !== false) {
    				$(this).attr('data-video', vSrc);
    				$(this).attr('id', 'video_'+index);
    			}
    			
    			//add audio link
    			if (typeof aSrc !== 'undefined' && aSrc !== false) {
    				$(this).attr('data-audio', aSrc);
    				$(this).attr('id', 'audio_'+index);
    			}
    			
    			//add Question/Answer link
    			if (typeof qSrc !== 'undefined' && qSrc !== false) {
    				$(this).attr('data-quiz', qSrc);
    			}
    			
    			//add optional feedback text. Will trigger leaf/feedback box.
    			if (typeof rFeedback !== 'undefined' && rFeedback !== false) {
    				$(this).attr('data-feedback', rFeedback);
    			}
    			
    			$(this).on( "click", { thisRef: thisRef }, thisRef.reviewBtnClicked );
    			
    		} else {
    			$(this).hide();
    			$(this).off();
    		}
    		
    		$(this).removeClass('visited');
    	
    	});

    	//activate personnel    	
    	$(this.containerDiv).find("#step_content .personnel").each(function () {
    	
    		$(this).removeClass("on");
    		$(this).removeClass("active");
    		//hide colored photo
    		$(this).find("#portrait_color").hide();
    		$(this).find("#portrait_bw").show();
    	
    	});
    	for (var i = 0; i < this.currentStep.personnel.length; i++) {
    		
    		var roleId = Util.removeSpaces( this.currentStep.personnel[i][0] );
    		var persDiv = $(this.containerDiv).find("#role_" + roleId );
    		
    		//show colored photo
    		$(persDiv).find("#portrait_color").show();
			$(persDiv).find("#portrait_bw").hide();
			$(persDiv).addClass("on");
			$(persDiv).addClass("active");
			
  			this.numActivePersonnel ++;
  			
  			//Active personnel can be clicked at anytime
  			$(persDiv).on("click", function(event) {

  				var indexClicked  = thisRef.currentStep.getPersonnelIndexById( $(this).attr('id') );
  				
  				console.log("active personnel clicked : "+indexClicked + ", current : "+ thisRef.curPersonnelIndex);
  				
  				if ( indexClicked != thisRef.curPersonnelIndex ) {
  				
  					 thisRef.personnelOrderInterrupted = true;
  					 thisRef.curPersonnelIndex = indexClicked;
  					 
  				}
				
				thisRef.callOutPersonnel( thisRef.curPersonnelIndex );
  			    thisRef.personnelClicked( thisRef.currentStep.personnel[ thisRef.curPersonnelIndex ] );
  			    
  			});
  			
    	}

		this.transIn();
		
		//Trigger first personnel
		TweenLite.delayedCall(2, function() { 
			thisRef.callOutNextPersonnel();
		});
    	
    }
    
    TS_FeatureBubble.prototype.reviewBtnClicked = function( event ) {
    	
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
    	    
    	//if quiz btn
    	var qSrc = $(this).attr('data-quiz');
    	if (typeof qSrc !== 'undefined' && qSrc !== false) {
    		thisRef.showQuiz( qSrc );
    		
    	} else {
    		//not quiz, no need to delay completion check
    		thisRef.checkForReviewCompletion();
    		
    	}

    }
    
    TS_FeatureBubble.prototype.showQuiz = function( quizId ) {
        	
    	//Setup up quiz
    	var quizData = this.currentStep.getQuizById( quizId );
    	
    	this.currentQuiz = new Quiz( $(this.containerDiv).find("#center_oval #question_answer_container"), $(quizData), this );
		this.currentQuiz.reset();
    	
    	//show review media/quiz
    	$(this.containerDiv).find("#center_oval #review_container").hide();   
    	$(this.containerDiv).find("#center_oval #question_answer_container").show();  

    }
    
    TS_FeatureBubble.prototype.onQuizFinished = function( ) {

    	//hide quiz, show review
    	$(this.containerDiv).find("#center_oval #question_answer_container").hide(); 
    	$(this.containerDiv).find("#center_oval #review_container").show();
    	
    	this.currentQuiz = {};
    	
    	this.checkForReviewCompletion();

    }
    
    TS_FeatureBubble.prototype.checkForReviewCompletion = function( ) {
    
    	//Drop leaf and show feedback if any is waiting. 
    	console.log("checkForReviewCompletion "+this.waitingFeedback);
    	if (this.waitingFeedback != null) {
    		
    		TS_Feedback.populateFeedback(this.waitingFeedback);
    		TS_Feedback.dropLeaf();
    		this.waitingFeedback = null;
  		
    	}
    	
    	if (this.reviewCompleted == true) {
    		
    		Tips.showById("page_3_close_review");
    		
    	}
    	
    }
    
    TS_FeatureBubble.prototype.callOutNextPersonnel = function( ) {
    	    	    	
    	this.curPersonnelIndex ++;
    	
    	this.callOutPersonnel( this.curPersonnelIndex );
  
    }
    
    TS_FeatureBubble.prototype.callOutPersonnel = function( personnelIndex ) {
    	    	
    	var thisRef = this;
    	    	
    	//reset previous active personnel
    	this.killCurrentActivePersonnel();
    	
		thisRef.curPersonnelDiv = $( thisRef.containerDiv ).find( "#role_" + Util.removeSpaces( thisRef.currentStep.personnel[ personnelIndex ][0] ) );
		
	 	$(thisRef.curPersonnelDiv).addClass("active");
	 	
	 	this.liftPortrait( thisRef.curPersonnelDiv );
	 	
	 	this.startActiveGlow( "#e5c694" );
	 	
	 	//this is now covered by attaching click listeners to all active personnel, no matter order	
//	 	//wait for click
//	 	$(thisRef.curPersonnelDiv).on("click", function(event){
//	 	    thisRef.personnelClicked( thisRef.currentStep.personnel[ thisRef.curPersonnelIndex ] );
//	 	});

    }

    TS_FeatureBubble.prototype.personnelClicked = function(personnelData) {
        	
    	console.log( "personnelClicked: "+ personnelData[0]  );
    	console.log( "start audio: "+ personnelData[1] + " for "+personnelData[2] + " secs.");

    	var sndId = personnelData[1];
    	var sndDelay = personnelData[2];
    	var thisRef = this;
    	
    	//start audio
    	Media.playTakeoverSound( sndId );
    	
    	//wait for end of audio. 
    	if (sndDelay == 'undefined' || sndDelay == null || sndDelay == undefined) sndDelay = 5; //default to 5 secs.
    	
    	//Things that happen AFTER end of sound. Can be interrupted.
    	TweenLite.delayedCall(sndDelay, function() {
    	
    		if (thisRef.personnelOrderInterrupted == false) {
    		
    			if (thisRef.curPersonnelIndex < thisRef.numActivePersonnel-1) {
	    			//call out next personnel
	    			
	    			thisRef.callOutNextPersonnel();
	
	    		} else {
	    			//was last personnel to call out. 
	    			thisRef.killCurrentActivePersonnel();
	    			
	    			//show review media/quiz
	    			$(thisRef.containerDiv).find("#center_oval #step_description_container").hide();   
	    			$(thisRef.containerDiv).find("#center_oval #review_container").show();    
	    			
	    			Tips.showById("page_3_show_review");
	    					
	    		}
	    		
    		}

    	});
    	
    	//track audio to fill in portrait ring
    	this.curAudioDuration = sndDelay;
    	this.curAudioProgress = 0.0;
    	this.trackAudioProgress();
    	
    	this.startActiveGlow( "#9dbbc5" );
            
    };

    TS_FeatureBubble.prototype.trackAudioProgress = function( ) {
//        	
//    	//Track sound progress (based on given sound duration)
//    	var thisRef = this;
//		TweenLite.delayedCall(0.1, function() {
//		
//			if ( thisRef.curPersonnelDiv ) {
//
//				thisRef.audioProgress += 0.1;
//				var p = 1 - (thisRef.audioProgress / thisRef.curAudioDuration).toFixed(2);
//			    	
//				if (p >= 1.0) {
//					//sound completed
//					console.log("sound completed");
//				} else {
//					thisRef.trackAudioProgress();
//				}
//				
//				thisRef.drawProgressRing( p );
//				
//			}
//			
//		});

    		
    }
    
    TS_FeatureBubble.prototype.killCurrentActivePersonnel = function( ) {
    	
    	if ( this.curPersonnelDiv ) {
    		
    		TweenLite.to( $(this.curPersonnelDiv), 0.5, { css: { scale:1, zIndex:0 },  ease:Power2.easeOut } );
    		TweenMax.killTweensOf( $(this.curPersonnelDiv).find(".circle-portrait img") );
    		
    		this.killActiveGlow();
    		
    		//TODO - change to a 'visited' state?
    		
    		//remove click listener
    		// removing to allow users to go back and re listen to some
//    		$(this.curPersonnelDiv).off();	
    		
    		this.curPersonnelDiv = null;
    		
    	}
    }
    
    TS_FeatureBubble.prototype.liftPortrait = function( portraitDiv ) {
    	
    	//Initial scale up to draw attention
    	TweenLite.set( $(portraitDiv).find(".circle-portrait img"), { boxShadow:"0px 0px 0px 0px rgba(0,0,0,0.3) " });
    	TweenLite.to( $(portraitDiv).find(".circle-portrait img"), 0.4, { css: { boxShadow:"0px 3px 10px 3px rgba(0,0,0,0.4)" }, delay:0.05,  ease:Power2.easeOut } );
    	TweenLite.to( $(portraitDiv), 0.4, { css: { scale:1.6, zIndex:1 },  ease:Power2.easeOut, onComplete: 
    		function(){
    			//scale back down to less enlarged state
    			TweenMax.to( $(portraitDiv).find(".circle-portrait img"), .25, { css: { boxShadow:"0px 2px 9px 2px rgba(0,0,0,0.4)" }, ease:Power1.easeIn });
    			TweenMax.to( $(portraitDiv), .25, { scale:1.3, ease:Power1.easeIn });
    		} 
    	});
    	
    }
    
    TS_FeatureBubble.prototype.startActiveGlow = function( glowColor ) {
    	
    	if ( this.curPersonnelDiv ) {

    	}
    }
    
    TS_FeatureBubble.prototype.killActiveGlow = function( ) {
    	
    	if ( this.curPersonnelDiv ) {
    		
    		TweenMax.killTweensOf( $(this.curPersonnelDiv).find(".circle-portrait img") );
    		TweenMax.set( $(this.curPersonnelDiv).find(".circle-portrait img"), { boxShadow:"0px 0px 0px 0px #e5c694" });
    		$(this.curPersonnelDiv).removeClass("active");
    		
    	}
    }
    
    // - TIMER DISPLAY - //
    TS_FeatureBubble.prototype.drawProgressRing = function(num) {
    	console.log("drawProgressRing: "+num);
    
    	if (num<0.01)num=0.001;
    	if (num>0.99)num=1.0;
    	
    	var cRadius = 54;
    	var cStroke = 6;
    	
    	var c = $(this.curPersonnelDiv).find("#progress_ring").first();

    	var ctx = $(c)[0].getContext('2d');
    	ctx.beginPath();
    	
    	ctx.arc(cRadius+cStroke, cRadius+cStroke, cRadius, 0+(1.5*Math.PI),(2*num*Math.PI)+(1.5*Math.PI),true);
    	
    	ctx.strokeStyle = "#dfdfdf";
    	ctx.lineWidth = cStroke;
    	ctx.stroke();
    	
    }

    // kill() | stop everything
    TS_FeatureBubble.prototype.kill = function( ) {
    	
    	Media.killSounds();
    	
    	this.killCurrentActivePersonnel();
    	
    	this.transOut();
    	
    }
    
    TS_FeatureBubble.prototype.transIn = function() {
    	
    	var t = $(this.containerDiv);
    	var pl = $(this.containerDiv).find("#step_content");
    	
    	$(t).show();
    	TweenLite.set( $(t), { css: { autoAlpha:0, zIndex:1 } } );
    	TweenLite.to( $(t), 0.75, { css: { autoAlpha:1 }, delay:0.5,  ease:Power2.easeOut } );
    	
    	TweenLite.set( $(pl), { css: { autoAlpha:0, scale: 0.85, transformOrigin:"512px 350px" } } );
    	TweenLite.to( $(pl), 0.5, { css: { autoAlpha:1, scale:1 }, delay:0.75, ease:Power2.easeOut } );
    	    	
    }
    
    TS_FeatureBubble.prototype.transOut = function() {
    	
    	var t = $(this.containerDiv);
    	var pl = $(this.containerDiv).find("#step_content");
    	
    	TweenLite.to( $(t), 0.5, { css: { autoAlpha:0 }, ease:Power2.easeInOut } );
    	TweenLite.to( $(pl), 0.25, { css: { autoAlpha:0 }, ease:Power2.easeOut } );  
    	    
    }
    
    return TS_FeatureBubble;
    
});