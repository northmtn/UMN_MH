define(['net/util/Geom'], function(Geom){


    function Bubble( id, label, containerDiv ){
    	
    	this.id = id;
    	this.label = label; 
    	this.containerDiv = containerDiv;
    	this.bubbleDiv = {};
    	
    	this.leashLength = 5;
    	this.baseTime = 1.25;
    	this.homeX = 0;
    	this.homeY = 0;
    	
    	this.isActive = false;
    	this.dimmed = false;
    	
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
	   	//subhead label (optional)
	   	$( this.bubbleDiv ).append( '<p id="bubSubhead" class="bubSubhead" style="display: none;"></p>' );
	   	//overlay imgs
	   	$( this.bubbleDiv ).append( '<img id="over_active" src="img/touchstone/bub_over.png" data-role="graphic" alt="'+this.label+'"/>' );
	   	$( this.bubbleDiv ).append( '<img id="over_inactive" src="img/touchstone/bub_over_inactive.png" data-role="graphic" style="display: none;" />' );
	   	//circular hit 
	   	$( this.bubbleDiv ).append( '<div id="hit"></div>' );
	      	
   }
	
	// setHome(x,y) | Set reposition bubble for home position
	Bubble.prototype.setHome = function( x, y ) {
		
		this.updateHome(x,y);
				
		//position
		$( this.bubbleDiv ).css('left', this.homeX);
		$( this.bubbleDiv ).css('top', this.homeY);
		
	}
	
	// updateHome(x,y) | Set home position for bubble
	Bubble.prototype.updateHome = function( x, y ) {
		
		this.homeX = x;
		this.homeY = y;
		
	}
	
	// beginFloat() | Make bubble start floating around randomly
	Bubble.prototype.beginFloat = function( ) {
		
		this.floatX( this );
		this.floatY( this );

//		this.floatXY( this );
		
	}
	
	Bubble.prototype.stopFloat = function( ) {
		
		TweenMax.killTweensOf( $(this.bubbleDiv) );
		
	}
	
	Bubble.prototype.comeToStop = function( ) {
		
		var thisRef = this;
		TweenLite.delayedCall(0.5, function() {
			thisRef.stopFloat();
		});
		
	}
	
	Bubble.prototype.floatX = function( bub ) {
		
		//Float "randomly" around home location
		var rpr = Geom.randomPointOnRing(bub.leashLength*2);
		var rx = bub.homeX + rpr[0];
		var rd = bub.baseTime + Math.random() * 1.5;
		TweenLite.to( $(bub.bubbleDiv), rd, { css: { left: rx }, ease:Power1.easeInOut, onComplete:bub.floatX, onCompleteParams:[bub] } );
		
	}
	
	Bubble.prototype.floatY = function( bub ) {
		
		//Float "randomly" around home location
		var rpr = Geom.randomPointOnRing(bub.leashLength*2);
		var ry = bub.homeY + rpr[1];
		var rd = bub.baseTime + Math.random() * 1.5;
		TweenLite.to( $(bub.bubbleDiv), rd, { css: { top: ry }, ease:Power1.easeInOut, onComplete:bub.floatY, onCompleteParams:[bub] } );
		
	}
	
	Bubble.prototype.floatXY = function( bub ) {
		
		//Float "randomly" around home location
		var rpr = Geom.randomPointOnRing(bub.leashLength*2);
		var rx = bub.homeX + rpr[0];
		var ry = bub.homeY + rpr[1];
		var rd = bub.baseTime + Math.random() * 1.5;

		TweenLite.to( $(bub.bubbleDiv), rd, { css: { left: rx, top: ry }, ease:Power1.easeInOut, onComplete:bub.floatXY, onCompleteParams:[bub] } );
		
	}
	
	
	// activate() | bring bubble into foreground
	Bubble.prototype.activate = function( tp ) {
	
		this.isActive = true;
		$(this.bubbleDiv).css("cursor","pointer");
		
		this.stopFloat();
		
		if (tp) {
			TweenLite.to( $(this.bubbleDiv), 0.75, { css: { scale: 1, zIndex:1, left:tp[0] + 65, top:tp[1] + 10 } } ); // scale  up, bring to foreground, position
		}else {
			TweenLite.to( $(this.bubbleDiv), 0.75, { css: { scale: 1, zIndex:1 } } ); // scale  up, bring to foreground
		}

		this.colorFadeBold();
		
	}
	
	// deactivate() | send bubble into background for floating
	Bubble.prototype.deactivate = function( ) {
	
		this.isActive = false;
		$(this.bubbleDiv).css("cursor","default");
				
		TweenLite.to( $(this.bubbleDiv), 0.65, { css: { scale: 0.65, zIndex:0 } } ); // scale down, send to background

		this.colorFadeDim();
	
		this.beginFloat();
		
	}
	
	// reset() | almost identical to deactivate, but ensures bubbles aren't dimmed
	Bubble.prototype.reset = function( ) {
	
		this.isActive = false;
		$(this.bubbleDiv).css("cursor","default");
				
		TweenLite.to( $(this.bubbleDiv), 0.25, { css: { scale: 0.65, zIndex:0 } } ); // scale down, send to background

		this.colorFadeBold();
	
		this.beginFloat();
		
	}
	
	// colorFadeDim() | 
	Bubble.prototype.colorFadeDim = function( ) {
		
		//Fade states
		this.dimmed = true;
		
		TweenLite.to( $(this.bubbleDiv).children("#over_active"), 0.2, { css: { opacity: 0 } } );
	
		$(this.bubbleDiv).children("#over_inactive").show();
		TweenLite.set( $(this.bubbleDiv).children("#over_inactive"), { css: { opacity: 0 } } );
		TweenLite.to( $(this.bubbleDiv).children("#over_inactive"), 0.4, { css: { opacity: 1 } } );
		
	}
	
	// colorFadeBold() | 
	Bubble.prototype.colorFadeBold = function( ) {
		
		//Fade states
		if (this.dimmed == false) return;
		this.dimmed = false;
	
		TweenLite.to( $(this.bubbleDiv).children("#over_inactive"), 0.2, { css: { opacity: 0 } } );
	
		$(this.bubbleDiv).children("#over_active").show();
		TweenLite.set( $(this.bubbleDiv).children("#over_active"), { css: { opacity: 0 } } );
		TweenLite.to( $(this.bubbleDiv).children("#over_active"), 0.4, { css: { opacity: 1 } } );

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