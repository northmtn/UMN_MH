define(['net/data/AppData', 'net/ui/TS_Step', 'net/ui/Tips', 'net/media/Media', 'net/ui/Quiz'], function(AppData, TS_Step, Tips, Media, Quiz){


    function TS_FeatureBubble( containerDiv ){
    	
    	this.containerDiv = containerDiv;
    	
    	this.steps = [];
    	this.currentStep = {};
    	
    	this.curPersonnelIndex = 0;
    	this.numActivePersonnel = 0;
 		this.curPersonnelDiv = {};
 		this.currentQuiz = {};
 		this.reviewCompleted = false;

    }
    
    TS_FeatureBubble.prototype.setupSteps = function() {
    	
    	//Get all steps from global config
    	var thisRef = this;
    	var stepConfigs = $(AppData.configXML).find("touchstone_steps step").each(function () {
    		
    		var st = new TS_Step( $(this) );
    		thisRef.steps.push(st);
    	
    	});   
    	    
    }
    
    TS_FeatureBubble.prototype.getAssociatedDimensionsOfStep = function( stepId ) {
    	
    	//update current step config
    	for (var i = 0; i < this.steps.length; i++) {
    				
    		if ( this.steps[i].id == stepId ) {
    		
    			return this.steps[i].dimensions;
    			
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
    	this.curPersonnelIndex = 0;
    	this.numActivePersonnel = 0;
    	this.reviewCompleted = false;
    			
    	//Setup display based on step config
    	//TODO - bubble color
    	
    	//title
    	$(this.containerDiv).find("#step_feature_title").html( this.currentStep.dimensionsTitle );
    	
    	//center oval content
    	$(this.containerDiv).find("#center_oval #step_title").html( this.currentStep.descriptionTitle );
    	$(this.containerDiv).find("#center_oval #description").html( this.currentStep.descriptionContent );
    	
    	//review buttons
    	$(this.containerDiv).find("#review_container button.rect-button").each(function (index) {
    		
    		if (index < thisRef.currentStep.reviewBtns.length) {
    			
    			//set button text
    			$(this).html(thisRef.currentStep.reviewBtns[index][0]);
    			
    			var vSrc = thisRef.currentStep.reviewBtns[index][1];
    			var aSrc = thisRef.currentStep.reviewBtns[index][2];
    			var qSrc = thisRef.currentStep.reviewBtns[index][3];
    			
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
    			
    			$(this).on( "click", { thisRef: thisRef }, thisRef.reviewBtnClicked );
    			
    		} else {
    			$(this).hide();
    			$(this).off();
    		}
    		
    		$(this).removeClass('visited');
    	
    	});

    	//activate personnel    	
    	$(this.containerDiv).find("#personnel_layer .personnel").each(function () {
    	
    		$(this).removeClass("on");
    		$(this).removeClass("active");
    	
    	});
    	for (var i = 0; i < this.currentStep.personnel.length; i++) {
									
			$(this.containerDiv).find("#role_" + this.currentStep.personnel[i][0] ).addClass("on");
  			this.numActivePersonnel ++;
  			
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
    
    	console.log("showQuiz : "+quizId);
    	
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

    	if (this.reviewCompleted == true) {
    		
    		Tips.showById("step_review_completed");
    		
    	}
    	
    }
    
    TS_FeatureBubble.prototype.callOutNextPersonnel = function( ) {
    	    	
    	var thisRef = this;
    	
    	//reset previous active personnel
    	this.killCurrentActivePersonnel();
    	
		thisRef.curPersonnelDiv = $(thisRef.containerDiv).find("#role_" + thisRef.currentStep.personnel[ thisRef.curPersonnelIndex ][0] );
		
	 	$(thisRef.curPersonnelDiv).addClass("active");
	 	TweenLite.to( $(thisRef.curPersonnelDiv), 0.5, { css: { scale:1.2, zIndex:1 },  ease:Power2.easeOut } );
	 	this.startActiveGlow( "#e5c694" );
	 	
	 	//wait for click
	 	$(thisRef.curPersonnelDiv).on("click", function(event){
	 	    thisRef.personnelClicked( thisRef.currentStep.personnel[ thisRef.curPersonnelIndex ] );
	 	});

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
    		 	
    	TweenLite.delayedCall(sndDelay, function() {
    	
    		if (thisRef.curPersonnelIndex < thisRef.numActivePersonnel-1) {
    			//call out next personnel
    			thisRef.curPersonnelIndex ++;
    			thisRef.callOutNextPersonnel();

    		} else {
    			//was last personnel to call out. 
    			thisRef.killCurrentActivePersonnel();
    			
    			//show review media/quiz
    			$(thisRef.containerDiv).find("#center_oval #step_description_container").hide();   
    			$(thisRef.containerDiv).find("#center_oval #review_container").show();    		
    		}
    		
    	});
    	
    	this.startActiveGlow( "#9dbbc5" );
            
    };
    
    TS_FeatureBubble.prototype.killCurrentActivePersonnel = function( ) {
    	
    	if ( this.curPersonnelDiv ) {
    		
    		TweenLite.to( $(this.curPersonnelDiv), 0.5, { css: { scale:1, zIndex:0 },  ease:Power2.easeOut } );
    		TweenMax.killTweensOf( $(this.curPersonnelDiv).find(".circle-portrait img") );
    		
    		this.killActiveGlow();
    		
    		//remove click listener
    		$(this.curPersonnelDiv).off();	
    		
    	}
    }
    
    TS_FeatureBubble.prototype.startActiveGlow = function( glowColor ) {
    	
    	if ( this.curPersonnelDiv ) {
    		
    		TweenMax.set( $(this.curPersonnelDiv).find(".circle-portrait img"), { boxShadow:"0px 0px 15px 5px "+glowColor+" " });
    		TweenMax.to( $(this.curPersonnelDiv).find(".circle-portrait img"), 0.6, { boxShadow:"0px 0px 19px 8px "+glowColor+" ", yoyo:true, repeat:-1, ease:Power1.easeInOut });
    		
    	}
    }
    
    TS_FeatureBubble.prototype.killActiveGlow = function( ) {
    	
    	if ( this.curPersonnelDiv ) {
    		
    		TweenMax.killTweensOf( $(this.curPersonnelDiv).find(".circle-portrait img") );
    		TweenMax.set( $(this.curPersonnelDiv).find(".circle-portrait img"), { boxShadow:"0px 0px 0px 0px #e5c694" });
    		$(this.curPersonnelDiv).removeClass("active");
    		
    	}
    }

    // kill() | stop everything
    TS_FeatureBubble.prototype.kill = function( ) {
    	
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