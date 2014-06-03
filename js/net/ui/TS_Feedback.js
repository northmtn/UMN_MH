define([], function(){


    function TS_Feedback(){

    }

    TS_Feedback.setup = function() {
    
    	this.leaf = $("#screen_touchstone #center_leaf");
    	this.feedbackBox = $("#screen_touchstone #leaf_feedback_box");
    	this.feedbackContent = $(this.feedbackBox).find("#tip_content");
    	this.leafDropped = false;
    	this.feedbackShowing = false;
    	
    }
    
    TS_Feedback.populateFeedback = function ( feedbackStr ) {
    	
    	$(this.feedbackContent).html( feedbackStr );
    
    }
    
    TS_Feedback.closeAndReset = function( ) {
        		
    	//retract feedback box
    	TweenLite.to( $(this.feedbackBox), 1, { css: { opacity: 1, scale: 0, transformOrigin:"-65px 235px" }, ease:Power2.easeInOut } );
    	
    	//hide leaf below
    	TweenLite.to( $(this.leaf), 1, { css: { top: 710, left: 70, rotation: 205 }, delay:0.75, ease:Power2.easeInOut, onComplete:this.onLeafHidden, onCompleteParams:[this] } );

    }
    
    TS_Feedback.onLeafHidden = function(classRef) {
    
    	$(classRef.feedbackBox).hide();
    	classRef.resetLeaf();
    	classRef.feedbackShowing = false;
    	
    }

    TS_Feedback.resetLeaf = function( ) {
	    		
		TweenLite.set( $(this.leaf), { css: { top: -158, left: 464, rotation: 0 } } );
		TweenLite.to( $(this.leaf), 1.5, { css: { top: -59 }, ease:Power2.easeInOut, onComplete:this.leafResetComplete, onCompleteParams:[this] } );
		
    }
    
     TS_Feedback.leafResetComplete = function(classRef) {
     
    	classRef.leafDropped = false;
    	
    }
    
    TS_Feedback.dropLeaf = function() {
    
    	TweenLite.to( $(this.leaf), 2, { css: { top: 600, left: 111, rotation: 222 }, ease:Power2.easeInOut, onComplete:this.leafDropComplete, onCompleteParams:[this]  } );
    	
    }
    
    TS_Feedback.leafDropComplete = function(classRef) {
    	
    	classRef.leafDropped = true;
    	
    	//expand feedback box
    	classRef.feedbackShowing = true;
    	$(classRef.feedbackBox).show();
    	TweenLite.set( $(classRef.feedbackBox), { css: { opacity: 1, scale: 0, transformOrigin:"-76px 250px" } } );
    	TweenLite.to( $(classRef.feedbackBox), 1, { css: { opacity: 1, scale: 1, transformOrigin:"-76px 250px" }, ease:Power2.easeInOut} );

    }
    

    return TS_Feedback;
    
});