define([], function(){


    function Bubble( id, label, containerDiv ){
    	
    	this.id = id;
    	this.label = label; 
    	this.containerDiv = containerDiv;
    	this.bubbleDiv = {};
    	
    	this.leashLength = 15;
    	this.homeX = 0;
    	this.homeY = 0;
    	
    	this.isActive = true;
    	
    	this.generateHTML();

    }

   // createInDOM() | Make bubble start floating around randomly
   Bubble.prototype.generateHTML = function( ) {
   	   		
	   	$( this.containerDiv ).append( '<div id="'+this.id+'" class="bubble" data-role="button"></div>' );
	   	this.bubbleDiv = $( this.containerDiv ).find("#"+this.id).first();

	   	//circle img
	   	$( this.bubbleDiv ).append( '<img src="img/touchstone/bub_' + this.label.toLowerCase() + '.png" data-role="graphic" /> ' );
	   	//title label
	   	$( this.bubbleDiv ).append( '<h2 id="bubTitle" class="bubTitle">' + this.label + '</h2>' );
	   	//overlay imgs
	   	$( this.bubbleDiv ).append( '<img id="over_active" src="img/touchstone/bub_over.png" data-role="graphic" alt="'+this.label+'"/>' );
	   	$( this.bubbleDiv ).append( '<img id="over_inactive" src="img/touchstone/bub_over_inactive.png" data-role="graphic" style="display: none;" />' );
	      	
   }
	
	// setHome(x,y) | Set home position for bubble
	Bubble.prototype.setHome = function( x, y ) {
		
		this.homeX = x;
		this.homeY = y;
				
		//position
		$( this.bubbleDiv ).css('left', this.homeX);
		$( this.bubbleDiv ).css('top', this.homeY);
		
	}
	
	// beginFloat() | Make bubble start floating around randomly
	Bubble.prototype.beginFloat = function( ) {
		
		this.floatX( this );
		this.floatY( this );
		
	}
	
	Bubble.prototype.stopFloat = function( ) {
		
		TweenMax.killTweensOf( $(this.bubbleDiv) );
		
	}
	
	Bubble.prototype.floatX = function( bub ) {
		
		//Float "randomly" around home location
		var rx = bub.homeX + (Math.random() * (bub.leashLength*2) - bub.leashLength);
		var rd = 2 + Math.random() * 2;
		TweenLite.to( $(bub.bubbleDiv), rd, { css: { left: rx }, ease:Power1.easeInOut, onComplete:bub.floatX, onCompleteParams:[bub] } );
		
	}
	
	Bubble.prototype.floatY = function( bub ) {
		
		//Float "randomly" around home location
		var ry = bub.homeY + (Math.random() * (bub.leashLength*2) - bub.leashLength);
		var rd = 2 + Math.random() * 2;
		TweenLite.to( $(bub.bubbleDiv), rd, { css: { top: ry }, ease:Power1.easeInOut, onComplete:bub.floatY, onCompleteParams:[bub] } );
		
	}
	
	
	// activate() | bring bubble into foreground
	Bubble.prototype.activate = function( tp ) {
	
		this.isActive = true;
		$(this.bubbleDiv).css("cursor","pointer");
		
		this.stopFloat();
		
		if (tp) {
			TweenLite.to( $(this.bubbleDiv), 0.25, { css: { scale: 1, zIndex:1, left:tp[0] + 44, top:tp[1] + 50 } } ); // scale  up, bring to foreground, position
		}else {
			TweenLite.to( $(this.bubbleDiv), 0.25, { css: { scale: 1, zIndex:1 } } ); // scale  up, bring to foreground
		}

		TweenLite.to( $(this.bubbleDiv).children("#over_inactive"), 0.2, { css: { opacity: 0 } } );
		
		//Fade states
//		$(this.bubbleDiv).children("#over_active").show();
//		TweenLite.set( $(this.bubbleDiv).children("#over_active"), { css: { opacity: 0 } } );
//		TweenLite.to( $(this.bubbleDiv).children("#over_active"), 0.4, { css: { opacity: 1 } } );
		
	}
	
	// deactivate() | send bubble into background for floating
	Bubble.prototype.deactivate = function( ) {
	
		this.isActive = false;
		$(this.bubbleDiv).css("cursor","default");
				
		TweenLite.to( $(this.bubbleDiv), 0.25, { css: { scale: 0.65, zIndex:0 } } ); // scale down, send to background
		
		TweenLite.to( $(this.bubbleDiv).children("#over_active"), 0.2, { css: { opacity: 0 } } );
		
		//Fade states
//		$(this.bubbleDiv).children("#over_inactive").show();
//		TweenLite.set( $(this.bubbleDiv).children("#over_inactive"), { css: { opacity: 0 } } );
//		TweenLite.to( $(this.bubbleDiv).children("#over_inactive"), 0.4, { css: { opacity: 1 } } );
		
		this.beginFloat();
		
	}
	
	// kill() | stop everything and reset
	Bubble.prototype.kill = function( ) {
	
		$(this.bubbleDiv).css("cursor","default");
		this.stopFloat();
		this.setHome(this.homeX, this.homeY);
		TweenLite.set( $(this.bubbleDiv), { css: { scale: 0.65 } } );
		this.isActive = true; // set to true so deactivate will work on awake
		
	}
	    
    return Bubble;
    
});