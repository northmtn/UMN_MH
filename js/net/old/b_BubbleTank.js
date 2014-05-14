
function BubbleTank( _containerDiv ) {
	
	this.containerDiv = _containerDiv;
	this.isActive = true;
	this.bubbles = [];
	
}

BubbleTank.prototype.addBubbles = function( barray ) {
			
	for ( var i = 0; i < barray.length; i++ ) {
	
		this.addBubble( barray[i] );
		
	}
	
	
}

BubbleTank.prototype.addBubble = function( b ) {
		
	this.bubbles.push(b);
	
}

// activate() | bring bubble into foreground
BubbleTank.prototype.activateBubbles = function( bubbleIds ) {

	this.deactivate();
		
	for (var i = 0; i < this.bubbles.length; i++) {
		
		for (var j = 0; j < bubbleIds.length; j++) {
					
			if ( this.bubbles[i].id == bubbleIds[j] ) {
			
				if (this.bubbles[i].isActive == false) this.bubbles[i].activate();
				
			}
			
		}
		
	}
	
	this.isActive = true;
}

// deactivate() | send bubble into background for floating
BubbleTank.prototype.deactivate = function( ) {

	for (var i = 0; i < this.bubbles.length; i++) {
		
		if (this.bubbles[i].isActive == true) this.bubbles[i].deactivate();
		
	}

	this.isActive = false;
	
}
