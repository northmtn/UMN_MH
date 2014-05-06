define([], function(){


    function ViewCollection( containerDiv, id){
    	
    	this.containerDiv = containerDiv;
    	this.id = id;
    	
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
    
    ViewCollection.prototype.getImageArray = function(  ) {
    
    	var imgArr = [];
    	
    	for (var i = 0; i < this.views.length; i++) {
    			
    		//gather image paths from config data		
    		$(this.views[i].viewConfig).find('image').each( function () {
    			if ($(this).text() != "") {
    				imgArr.push( $(this).text() );
    			}
    			
    		});
    		
    		//gather image urls from template html
    		$(this.views[i].viewDiv).find('img').each( function () {
    			if ($(this).attr('src') != "") {
    				imgArr.push( $(this).attr('src') );
    			}
    			
    		});
    		
    	
    	}
    	
    	return imgArr;
    	
    }
        
    return ViewCollection;
    
});