define([], function(){

    function PhotoStack( containerDiv ){
    
		this.containerDiv = containerDiv; 
				
		this.speed = 4;
		this.maxRotation = 20;
		this.xSpread = 20;
		this.ySpread = 20;
					
		this.setup();
		
		this.start();
		     	
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
    
    	this.nextPhoto();
    	
    }
    
    PhotoStack.prototype.nextPhoto = function(){
    	
    	thisRef = this;
    	
    	TweenLite.delayedCall( this.speed, function() {
    		
    		var bottomPhoto = $(thisRef.containerDiv).children("img").first();
    		$(bottomPhoto).parent().append(bottomPhoto);
    		
    		console.log("nextPhoto "+$(bottomPhoto).attr('id'));
    		
    		thisRef.nextPhoto();
    		
    	});
    	
    }
    
    PhotoStack.prototype.stop = function(){
    
    }

    PhotoStack.prototype.resetStack = function(){
        
    	
    };
   
    return PhotoStack;
    
});