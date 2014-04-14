
function TimelineNav(_containerDiv, _viewCollection) {

	this.containerDiv = _containerDiv;
	this.navIcons = _containerDiv.children( "[id^='navIcon']" ); // Array of clickable state divs to show/control timeline progress.
	this.viewCollection = _viewCollection; // Views corresponding to navIcons
		
	this.setupNavigation();

}

TimelineNav.prototype.setupNavigation = function( ) {

	if (this.viewCollection.numViews <= 1) {
		//Only one slide, hide entire timeline.
		$(this.containerDiv).hide();
		return false;
	} else {
		$(this.containerDiv).show();
	}
	
	//temp
	var thisRef = this;
	$(this.containerDiv).find( "button[id^='navIcon']" ).each( function () {
		$( this ).on( "click", { btn:this }, function(event) {
		
			var navIndex = $(event.data.btn).attr('data-nav');
			thisRef.viewCollection.gotoView(navIndex);
			thisRef.refreshDisplays();
			
		});
	
	});

	return true;

}

TimelineNav.prototype.refreshDisplays = function( ) {
	
	for ( var i = 0; i <= this.viewCollection.numViews; i++ ) {
			
		if (i == this.viewCollection.currentViewIndex) {
			
			// CURRENT
			$(this.navIcons[i]).css("color", "red");
			$(this.navIcons[i]).find("#active").show(); 
			
		} else if (i < this.viewCollection.currentViewIndex) {
			
			//PREVIOUS
			$(this.navIcons[i]).css("color", "black");
			$(this.navIcons[i]).find("#seen").show(); 
			
		} else {
			
			// UNSEEN
			$(this.navIcons[i]).css("color", "gray");
			$(this.navIcons[i]).find("#unseen").show(); 
			
		}

	}
}

