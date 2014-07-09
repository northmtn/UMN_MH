define([], function(){

    function PhotoStack( containerDiv ){
    
		this.containerDiv = containerDiv; 
				
		this.speed = 10;
		this.maxRotation = 20;
		this.xSpread = 20;
		this.ySpread = 20;
		
		this.shuffleSpeed = 0.5;
					
		this.setup();
				     	
    }

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
    	TweenLite.delayedCall( this.speed, function() {
    		thisRef.nextPhoto();
    		thisRef.start();
    	});
    	
    }
    
    PhotoStack.prototype.nextPhoto = function(){
    

		var bottomPhoto = $(this.containerDiv).children("img").first();
		
		TweenMax.to( $(bottomPhoto), this.shuffleSpeed, { css: { left:350, top:Math.random()*100-50 },  ease:Power1.easeOut, yoyo: true, repeat:1 } );
		TweenLite.delayedCall( this.shuffleSpeed/2, function() { $(bottomPhoto).parent().append(bottomPhoto); });

    }
    
    PhotoStack.prototype.stop = function(){
    
    }

    PhotoStack.prototype.resetStack = function(){
        
    	
    };
   
    return PhotoStack;
    
});