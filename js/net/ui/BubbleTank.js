define(['net/ui/Bubble', 'net/util/Geom'], function(Bubble, Geom){


    function BubbleTank( containerDiv ){
    	
    	this.containerDiv = containerDiv;
    	this.isActive = true;
    	this.isAlive = true;
    	this.bubbles = [];
    	this.numBubbles = 0;
    	this.rotationOffset = 0;
    	
        
    }
    
    BubbleTank.prototype.createBubbles = function( barray ) {
    			
    	for ( var i = 0; i < barray.length; i++ ) {
    	
    		this.createBubble( barray[i] );
    		
    	}
    	
    }

    BubbleTank.prototype.createBubble = function(label) {
    	
    	var b = new Bubble("bub_"+label.toLowerCase(), label, this.containerDiv);
    	this.bubbles.push(b);
    	this.numBubbles = this.bubbles.length;
    
    }
    
    BubbleTank.prototype.distributeInCircle = function() {
    
    	//Set home positions of all bubbles
    	var distributeRadius = 215;
		var degreeOffset = 360 / this.numBubbles;
		var homePt = [];
		var homeAngle = 0;
			
		for (var i = 0; i < this.numBubbles; i++) {
		
			homeAngle = ( Geom.deg2Rad( degreeOffset ) * i ) + Geom.deg2Rad(this.rotationOffset);
			homePt = Geom.getPointOnRing( homeAngle, distributeRadius );
			this.bubbles[i].updateHome(homePt[0], homePt[1]);
			
		}

    }
    
    BubbleTank.prototype.rotateCycle = function() {
        
        if (this.isAlive == true) {
        
        	var thisRef = this;
        	
			TweenLite.delayedCall(0.35, function() {
			
				thisRef.rotationOffset += 3;
				if (thisRef.rotationOffset >= 360) thisRef.rotationOffset = (1+(thisRef.rotationOffset-360));
				thisRef.distributeInCircle();
				
				thisRef.rotateCycle(); //again...
				
			});
			
		}

    }
    
    // collapseActives() | send all active bubbles to center
    BubbleTank.prototype.collapseActives = function( ) {
    
    	var cPt = [0,0];
    	
    	for (var i = 0; i < this.numBubbles; i++) {
    		
    		if (this.bubbles[i].isActive == true) {
    		
    			this.bubbles[i].activate(cPt);
    			
    		} else {
    			
    			//stop motion of all other bubbles.
    			this.bubbles[i].comeToStop();
    			
    		}
    		
    	}
    	
    	this.isAlive = false;
    	
    }
    
    // activate() | bring bubble into foreground
    BubbleTank.prototype.activateBubbles = function( bubbleIds ) {
    
    	this.deactivate( );
    	
    	var numActive = bubbleIds.length;
    	var centeredPts = [];
    	var pIndex = 0;
    	
    	if (numActive == 1){
    		centeredPts = [[0,0]];
    	} else if (numActive == 2) {
    		centeredPts = [[-120,0],[120,0]];
    	} else if (numActive == 3) {
    		centeredPts = [[-120,100],[0,-100],[120,100]];
    	} else if (numActive == 4) {
    		centeredPts = [[-120,-120],[120,-120],[-120,120],[120,120]];
    	}
    	    		
    	for (var i = 0; i < this.numBubbles; i++) {
    		
    		for (var j = 0; j < bubbleIds.length; j++) {
    					
    			if ( this.bubbles[i].id == ("bub_"+(bubbleIds[j]).toLowerCase()) ) {
    			
    				if (this.bubbles[i].isActive == false) {
    					
    					this.bubbles[i].activate(centeredPts[pIndex]);
    					pIndex ++;
    					
    				}
    				
    			}
    			
    		}
    		
    	}
    	
    	this.isActive = true;
    	
    }
    
    // deactivate() | send bubble into background for floating
    BubbleTank.prototype.deactivate = function( ) {
    
    	for (var i = 0; i < this.numBubbles; i++) {
    		
    		if (this.bubbles[i].dimmed == false) this.bubbles[i].deactivate();
    		
    	}
    
    	this.isActive = false;
    	
    }
    
    // reset() | send bubble into background for floating
    BubbleTank.prototype.reset = function() {
    
    	for (var i = 0; i < this.numBubbles; i++) {
    		
    		this.bubbles[i].reset();
    		
    	}
    
    	this.isActive = false;
    	this.isAlive = true;
    	this.rotateCycle();
    	
    }
    
    // kill() | stop everything
    BubbleTank.prototype.kill = function( ) {
    
    	for (var i = 0; i < this.numBubbles; i++) {
    		
    		this.bubbles[i].kill();
    		
    	}
    	this.isAlive = false;
    	this.isActive = false;
    	
    }
    
    return BubbleTank;
    
});