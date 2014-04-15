
function ViewCollection( _containerDiv, _id ) {

	this.containerDiv = _containerDiv;
	this.id = _id;
	
	this.views = [];
	this.numViews = 0;
	
	this.currentViewIndex = 0;
		
}

ViewCollection.prototype.addView = function( view ) {
	
	this.views.push(view);
	this.numViews = this.views.length;

}

ViewCollection.prototype.gotoView = function ( goToIndex ) {
		
	for (var i = 0; i < this.views.length; i++) {
	
		$(this.views[i].viewDiv).hide();
		
	}
	
	$(this.views[goToIndex].viewDiv).show();	
	
	this.currentViewIndex = goToIndex;
	
}
