define([], function(){


    function WI_Feedback(){

    }

    WI_Feedback.setup = function() {
    
    	this.balloon = $("#screen_wilder #balloon");
    	this.feedbackBox = $("#screen_wilder #balloon_feedback_box");
    	this.feedbackContent = $(this.feedbackBox).find("#tip_content");
    	this.balloonDropped = false;
    	this.feedbackShowing = false;
    	
    }
    
    WI_Feedback.populateFeedback = function ( feedbackStr ) {
    	
    	$(this.feedbackContent).html( feedbackStr );
    
    }
    
    WI_Feedback.closeAndReset = function( ) {
        		
    	//retract feedback box
    	TweenLite.to( $(this.feedbackBox), 1, { css: { opacity: 1, scale: 0, transformOrigin:"616px 25px" }, ease:Power2.easeInOut } );
    	
    	//hide Balloon above
    	TweenLite.to( $(this.balloon), 1.5, { css: { top: -250 }, delay:0.725, ease:Power1.easeIn, onComplete:this.onBalloonHidden, onCompleteParams:[this] } );

    }
    
    WI_Feedback.onBalloonHidden = function(classRef) {
    
    	$(classRef.feedbackBox).hide();
    	classRef.resetBalloon();
    	classRef.feedbackShowing = false;
    	
    }

    WI_Feedback.resetBalloon = function( ) {
	    		
		TweenLite.set( $(this.balloon), { css: { top: 790 } } );
		
    }
    
     WI_Feedback.balloonResetComplete = function(classRef) {
     
    	classRef.balloonDropped = false;
    	
    }
    
    WI_Feedback.dropBalloon = function() {
    
    	TweenLite.to( $(this.balloon), 3, { css: { top: 75, left:770 }, ease:Power2.easeInOut, onComplete:this.balloonDropComplete, onCompleteParams:[this]  } );
    	
    }
    
    WI_Feedback.balloonDropComplete = function(classRef) {
    	
    	classRef.balloonDropped = true;
    	
    	//expand feedback box
    	classRef.feedbackShowing = true;
    	$(classRef.feedbackBox).show();
    	TweenLite.set( $(classRef.feedbackBox), { css: { opacity: 1, scale: 0, transformOrigin:"616px 25px" } } );
    	TweenLite.to( $(classRef.feedbackBox), 1, { css: { opacity: 1, scale: 1, transformOrigin:"616px 25px" }, ease:Power2.easeInOut} );

    }
    

    return WI_Feedback;
    
});