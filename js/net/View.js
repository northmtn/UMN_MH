function View( _containerDiv, _contentId, _templateId) {

	this.containerDiv = _containerDiv;
	this.templateId = _templateId;
	this.contentId = _contentId;
	
	this.viewDiv = {};
		
	this.initWithTemplate();

}

View.prototype.initWithTemplate = function() {

	//Find content info for this view
	var contentConfig = $(configXML).find('#'+this.contentId).first(); // TODO - search specific to module?
		
	var viewRef = this;
	var wrapperId = "wrapper_"+this.contentId;
	
	//create wrapper to load template into. 
	$( this.containerDiv ).append("<div id='"+wrapperId+"' data-role='container'></div>");
	
	//Load template html into container div
	$( this.containerDiv ).children("#"+wrapperId).load('content/view_templates.html #template_definitions #'+ this.templateId, function ( index ) {
		
		viewRef.populateDisplay( contentConfig, $(this) );
		
	});

}


// PopulateDisplay() | Load images, text, etc into provided container div using corresponding template html
View.prototype.populateDisplay = function( contentConfig, templateDiv ) {

	this.viewDiv = templateDiv;
	
	//Change div id to match view
	$(templateDiv).children().first().attr( 'id', this.contentId );	
		
	// - TEXT ELEMENTS - //
	var txtNodes = $(contentConfig).find("text");
	
	for (var i = 0; i < txtNodes.size(); i++) {
			
		var txtId = $(txtNodes[i]).attr('id');
		var txtHTML = $(txtNodes[i]).text();
		
		//target corresponding element in template html
		$(templateDiv).find("#"+txtId).html( txtHTML ); // TODO - should check for CDATA to use html or text? does it matter?
				
	}
		
	// - IMAGE ELEMENTS - //
	var imgNodes = $(contentConfig).find("image");
	
	for (var i = 0; i < imgNodes.size(); i++) {
	
		var imgId = $(imgNodes[i]).attr('id');
		var imgSrc = imgFolder + $(imgNodes[i]).text();
		var delay = $(imgNodes[i]).attr('delay');
		if(! delay){
			delay = "0";
		}
		
		//target corresponding element in template html
		$(templateDiv).find("#"+imgId).attr('src', imgSrc); // TODO - should check for delayed img loading?
		$(templateDiv).find("#"+imgId).attr('delay', delay);
		$(templateDiv).find("#"+imgId).css('display', 'block');
	
	}
	
	// - VIDEO ELEMENTS - //
	var vidNodes = $(contentConfig).find("video");
	
	for (var i = 0; i < vidNodes.size(); i++) {
	
		var vidId = $(vidNodes[i]).attr('id');
		var vidSrc = videoFolder +''+ $(vidNodes[i]).text() +''+ videoExtension;

		//target corresponding element in template html
		$(templateDiv).find("#"+vidId).attr('src', vidSrc);
		
		var vp = new VidPlayer( "#"+ this.contentId + ' #' + vidId );
		vp.loadVideo( $(vidNodes[i]).text() );
	
	}
	
	// - AUDIO ELEMENTS - //
	var audNodes = $(contentConfig).find("audio");
	
	for (var i = 0; i < audNodes.size(); i++) {
	
		var audId = $(audNodes[i]).attr('id');
		var audSrc = audioFolder +''+ $(audNodes[i]).text() +''+ audioExtension;

		//target corresponding element in template html
		$(templateDiv).find("#"+audId).attr('src', audSrc);
	
	}
	
	//Default to hidden
	$(templateDiv).hide();
	//TODO - dispatch event signaling this view is completed?

}
