define(['net/data/AppData'], function(AppData){

    function View( containerDiv, contentId, templateId){
    	
    	this.containerDiv = containerDiv;
    	this.templateId = templateId;
    	this.contentId = contentId;
    	
    	this.viewDiv = {};
    	this.viewConfig = {};
    		
    	this.initWithTemplate();
        	
    }

    View.prototype.initWithTemplate = function() {
    
    	//Find content info for this view
    	var contentConfig = $(AppData.configXML).find('#'+this.contentId).first(); // TODO - search specific to module?
    		
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
    	this.viewConfig = contentConfig;
    	
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
    	
    	// - BUTTON ELEMENTS - //
    	var btnNodes = $(contentConfig).find("button");
    	
    	for (var i = 0; i < btnNodes.size(); i++) {
    			
    		var btnId = $(btnNodes[i]).attr('id');
    		var dataVideo = $(btnNodes[i]).attr('video');
    		var dataAudio = $(btnNodes[i]).attr('audio');
    		var btnHTML = $(btnNodes[i]).text();
    		
    		//target corresponding element in template html
    		$(templateDiv).find("#"+btnId).html( btnHTML ); 
    		//add video link
    		if (typeof dataVideo !== 'undefined' && dataVideo !== false) $(templateDiv).find("#"+btnId).attr('data-video', dataVideo);
    		//add audio link
    		if (typeof dataAudio !== 'undefined' && dataAudio !== false) $(templateDiv).find("#"+btnId).attr('data-audio', dataAudio);
    		    				
    	}
    		
    	// - IMAGE ELEMENTS - //
    	var imgNodes = $(contentConfig).find("image");
    	
    	for (var i = 0; i < imgNodes.size(); i++) {
    	
    		var imgId = $(imgNodes[i]).attr('id');
    		var imgSrc = $(imgNodes[i]).text();
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
    	//WIll not need unless we use embedded videos
    	/*
    	var vidNodes = $(contentConfig).find("video");
    	
    	for (var i = 0; i < vidNodes.size(); i++) {
    	
    		var vidId = $(vidNodes[i]).attr('id');
    		var vidSrc = AppData.videoFolder +''+ $(vidNodes[i]).text() +''+ AppData.videoExtension;
    
    		//target corresponding element in template html
    		$(templateDiv).find("#"+vidId).attr('src', vidSrc);
    		
    		var vp = new VidPlayer( "#"+ this.contentId + ' #' + vidId );
    		vp.loadVideo( $(vidNodes[i]).text() );
    	
    	}
    	*/
    	
    	// - AUDIO ELEMENTS - //
    	var audNodes = $(contentConfig).find("audio");
    	
    	for (var i = 0; i < audNodes.size(); i++) {
    	
    		var audId = $(audNodes[i]).attr('id');
    		var audSrc = AppData.audioFolder +''+ $(audNodes[i]).text() +''+ AppData.audioExtension;
    
    		//target corresponding element in template html
    		$(templateDiv).find("#"+audId).attr('src', audSrc);
    	
    	}
    	
    	//Default to hidden
    	$(templateDiv).hide();
    
    }
        
    return View;
    
});