define(['net/data/AppData', 'net/ui/TS_Step'], function(AppData, TS_Step){


    function TS_FeatureBubble( containerDiv ){
    	
    	this.containerDiv = containerDiv;
    	
    	this.steps = [];
    	this.currentStep = {};

        
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
    	
    	//update current step config
    	for (var i = 0; i < this.steps.length; i++) {
					
			if ( this.steps[i].id == stepId ) {
			
				this.currentStep = this.steps[i];
				
			}
  		
    	}
    			
    	//Setup display based on step config
    	//bubble color
    	
    	//title
    	$(this.containerDiv).find("#step_feature_title").html( this.currentStep.dimensionsTitle );
    	console.log("Show Title "+ this.currentStep.dimensionsTitle);
    	
    	
    	//activate personnel    	
    	$(this.containerDiv).find("#personnel_layer .personnel").each(function () {
    	
    		$(this).removeClass("on");
    		$(this).removeClass("active");
    	
    	});
    	for (var i = 0; i < this.currentStep.personnel.length; i++) {
									
			$(this.containerDiv).find("#role_" + this.currentStep.personnel[i][0] ).addClass("on");
  		
    	}
    	$(this.containerDiv).find("#role_" + this.currentStep.personnel[0][0] ).addClass("active");

		this.transIn();
    	
    }
   
    
    // kill() | stop everything
    TS_FeatureBubble.prototype.kill = function( ) {
    	
    	this.transOut();
    	
    }
    
    TS_FeatureBubble.prototype.transIn = function() {
    	
    	var t = $(this.containerDiv);
    	var pl = $(this.containerDiv).find("#step_content");
    	
    	$(t).show();
    	TweenLite.set( $(t), { css: { autoAlpha:0, zIndex:2 } } );
    	TweenLite.to( $(t), 0.75, { css: { autoAlpha:1 }, delay:0.5,  ease:Power2.easeOut } );
    	
    	TweenLite.set( $(pl), { css: { autoAlpha:0, scale: 0.85 } } );
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