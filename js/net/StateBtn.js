function ( _containerDiv ) {

	this.containerDiv = _containerDiv;
		
}

TimelineNav.prototype.setState = function( stateId ) {
	
	//Hide all states except for this one.
	this.containerDiv.children().each( function() {
		
		if ( $(this).attr('id') != stateId ) {
		
			$(this).hide();
			
		} else {
		
			$(this).show();
		
		}
		
	});
	
}