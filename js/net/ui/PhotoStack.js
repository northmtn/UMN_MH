define([], function(){

    function PhotoStack( containerDiv ){
    
		this.containerDiv = containerDiv; 
				
		this.speed = 7;
		this.maxRotation = 20;
		this.xSpread = 20;
		this.ySpread = 120;
		
		this.shuffleSpeed = 0.75;
		
		this.transitionMode = 0;
		this.nextCycle = {};
					
		this.setup();
				     	
    }
    
    //constants
    PhotoStack.MODE_SLIDE = 0;
    PhotoStack.MODE_FADE = 1;

    PhotoStack.prototype.setup = function(){

        //search container div for photos to include in stack
        var thisRef = this;
        $(this.containerDiv).find("img").each(function(index){
                	
        	$(this).css( "position", "absolute" );
        	
        	//ensure first two photos span max rotation, others with be scattered within
        	var pRot = Math.random() * thisRef.maxRotation;
        	if(index == 0 && index == 1) pRot = thisRef.maxRotation;
        	if(index % 2 == 1) pRot *= -1;
        	
     		var xOffset = Math.random() * thisRef.xSpread - (thisRef.xSpread/2);
     		var yOffset = Math.random() * thisRef.ySpread - (thisRef.ySpread/2);
        	TweenLite.set( $(this), { css: { rotation:pRot, left:xOffset, top:yOffset } } );
        
        });
        	
    };
    
    PhotoStack.prototype.start = function(){
    	
    	var thisRef = this;
    	
    	this.nextCycle = TweenLite.delayedCall( this.speed, function() {
    		thisRef.nextPhoto();
    		thisRef.start();
    	});
    	
    }
    
    
    PhotoStack.prototype.setTransitionMode = function(mode){
   		
   		this.transitionMode = mode;
    	
    }
    
    
    PhotoStack.prototype.nextPhoto = function(){

		var bottomPhoto = $(this.containerDiv).children("img").first();
				
		switch(this.transitionMode) {
			case PhotoStack.MODE_SLIDE:
				TweenMax.to( $(bottomPhoto), this.shuffleSpeed, { css: { left:315, top:Math.random()*100-50 },  ease:Power2.easeInOut, yoyo: true, repeat:1 } );
				TweenLite.delayedCall( this.shuffleSpeed, function() { $(bottomPhoto).parent().append(bottomPhoto); });
			break;
			case PhotoStack.MODE_FADE:
				TweenMax.to( $(bottomPhoto), this.shuffleSpeed, { css: { opacity:0 },  ease:Power2.easeOut, yoyo: true, repeat:1 } );
				TweenLite.delayedCall( this.shuffleSpeed, function() { $(bottomPhoto).parent().append(bottomPhoto); });
			break;
		}
		
    }
    
    PhotoStack.prototype.stop = function(){
    	
    	TweenMax.killTweensOf();
    	TweenMax.killTweensOf(this.nextCycle);
    	
    }

    PhotoStack.prototype.resetStack = function(){
    	
    };
   
    return PhotoStack;
    
});