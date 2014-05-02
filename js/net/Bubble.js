
function Bubble(_id, _title, _containerDiv, _homeX, _homeY) {

	this.id = _id;
	this.title = _title; 
	this.containerDiv = _containerDiv;
	this.bubbleDiv = {};
	this.homeX = _homeX;
	this.homeY = _homeY;
	this.leashLength = 60;
	
	this.generateHTML();
	
	this.isActive = true;
	
}

// createInDOM() | Make bubble start floating around randomly
Bubble.prototype.generateHTML = function( ) {
		
	$( this.containerDiv ).append( '<div id="'+this.id+'" class="bubble" data-role="container" ></div>' );
	this.bubbleDiv = $( this.containerDiv ).find("#"+this.id).first();
	
	//circle img
	$( this.bubbleDiv ).append( '<img src="img/touchstone/bub_' + this.title.toLowerCase() + '.png" data-role="graphic" /> ' );
	//title label
	$( this.bubbleDiv ).append( '<h2 id="bubTitle" class="bubTitle">' + this.title + '</h2>' );
	//overlay imgs
	$( this.bubbleDiv ).append( '<img id="over_active" src="img/touchstone/bub_over.png" data-role="button" alt="'+this.title+'"/>' );
	$( this.bubbleDiv ).append( '<img id="over_inactive" src="img/touchstone/bub_over_inactive.png" data-role="button" style="display: none;" />' );

	this.setHome(this.homeX, this.homeY);
	
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
Bubble.prototype.activate = function( ) {

	this.isActive = true;
	
	this.stopFloat();
	
	TweenLite.to( $(this.bubbleDiv), 0.25, { css: { scale: 0.75, zIndex:1 } } ); // scale  up, bring to foreground
	
	TweenLite.to( $(this.bubbleDiv).children("#over_inactive"), 0.2, { css: { opacity: 0 } } );
	
//	$(this.bubbleDiv).children("#over_active").show();
//	TweenLite.set( $(this.bubbleDiv).children("#over_active"), { css: { opacity: 0 } } );
//	TweenLite.to( $(this.bubbleDiv).children("#over_active"), 0.4, { css: { opacity: 1 } } );
	
}

// deactivate() | send bubble into background for floating
Bubble.prototype.deactivate = function( ) {

	this.isActive = false;
			
	TweenLite.to( $(this.bubbleDiv), 0.25, { css: { scale: 0.5, zIndex:0 } } ); // scale down, send to background
	
	TweenLite.to( $(this.bubbleDiv).children("#over_active"), 0.2, { css: { opacity: 0 } } );
	
//	$(this.bubbleDiv).children("#over_inactive").show();
//	TweenLite.set( $(this.bubbleDiv).children("#over_inactive"), { css: { opacity: 0 } } );
//	TweenLite.to( $(this.bubbleDiv).children("#over_inactive"), 0.4, { css: { opacity: 1 } } );
	
	this.beginFloat();
	
}