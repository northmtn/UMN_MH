define(['net/util/Geom'], function(Geom){

	function ProgressRing( ){

	}
	
	//ie - ProgressRing.setup(54, 15,"#DDD", "#2a645e");
	ProgressRing.setup = function( radius, stroke, bgColor, fillColor ) {
		
		this.gRadius = radius;
		this.gStroke = stroke;
		this.bgColor  = bgColor;
		this.fillColor = fillColor;
		
		this.curDuration = 0;
		this.curProgress = 0;
		this.curProgressRingTween = {};
			
	}
	
	ProgressRing.startProgress = function( completionDelay, canvasParentDiv ) {
		   		
		//stop current progress ring if any
		TweenLite.killTweensOf(this);

		var thisRef = this;
    	
    	//track audio to fill in portrait ring
    	this.curDuration = completionDelay;
    	this.curProgress = 0.0;
    	
    	this.cStroke = this.gStroke;
    	this.cRadius = this.gRadius;

    	//exception if Jenna
    	if ($(canvasParentDiv).attr("id") == "role_Jenna" ) {
			//Draw larger ring
			this.cRadius = 84;
			this.cStroke = 15;
    	}
    	    	
    	var c = $(canvasParentDiv).find("#progress_ring").first();
    	$(c).show(); //show progress ring
    	var ctx = $(c)[0].getContext('2d');
    	
    	ctx.clearRect ( 0 , 0 , (this.cRadius+this.cStroke)*2, (this.cRadius+this.cStroke)*2 );
    	
    	ctx.strokeStyle = this.bgColor;
    	ctx.lineWidth = thisRef.cStroke;
    	ctx.webkitImageSmoothingEnabled=true;
    	
    	//draw full ring first
    	var num = 0.001; 
    	ctx.beginPath();
    	ctx.arc(this.cRadius + this.cStroke, this.cRadius + this.cStroke, this.cRadius, 0+(1.5*Math.PI),(2*num*Math.PI)+(1.5*Math.PI),true);
    	ctx.stroke();
    	
    	ctx.strokeStyle = this.fillColor;

    	this.curProgressRingTween = TweenLite.to( this, this.curDuration, { curProgress: 1,  ease:Linear.easeNone, onUpdate: 
    		function(){

    			var num = 1 - thisRef.curProgress;    
    			    					
    			if (num<0.01)num=0.001;
    			if (num>0.99)num=1.0;
    			    			
    			ctx.beginPath();
    			ctx.arc(thisRef.cRadius+thisRef.cStroke, thisRef.cRadius+thisRef.cStroke, thisRef.cRadius, 0+(1.5*Math.PI),(2*num*Math.PI)+(1.5*Math.PI),true);
    			ctx.stroke();
    			
    		} 
    	});  
    	
	}
	    
	return ProgressRing;

});