define([], function(){


    function TimelineNav( containerDiv,  viewCollection){
    	
    	this.containerDiv = containerDiv; 
    	this.navIcons = this.containerDiv.children( "[id^='navIcon']" ); // Array of clickable state divs to show/control timeline progress.
    	this.viewCollection = viewCollection; // Views corresponding to navIcons
    	
    	this.init();
        	
    }

    TimelineNav.prototype.init = function(){

        this.enable();
        
    };
    
    TimelineNav.prototype.enable = function() {
    	
    	this.refreshButtonListeners();
//    	refreshDisplays();
    	
    }
    
    TimelineNav.prototype.disable = function(){
    		
    	this.disableButtonListeners();
    		
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
    
    
    TimelineNav.prototype.refreshButtonListeners = function(){

    	var thisRef = this;
    	
    	//Removes all existing listeners to avoid layering listeners
    	this.disableButtonListeners();
    
        //Listen for all button clicks...
        $(this.containerDiv).find("div[data-role='button'], button[data-role='button'], img[data-role='button'], p[data-role='button']").on("click", function(event){
            thisRef.buttonClicked($(this).attr('id'));
        });
    
    };
    
    TimelineNav.prototype.disableButtonListeners = function() {
    
    	//Removes all existing listeners to avoid layering listeners
    	$(this.containerDiv).find("div[data-role='button'], button[data-role='button'], img[data-role='button'], p[data-role='button']").each( function () {
    		$(this).off();	
    	});
    	
    }
    
    TimelineNav.prototype.buttonClicked = function(btnId) {
        	
    	console.log("TimelineNav buttonClicked(btnId): " + btnId);
    	
    	// catch specific types of buttons
    	console.log("btnId.substring(0, 7) "+btnId.substring(0, 7));
    	if (btnId.substring(0, 7) == "navIcon") {
    	
    		var navIndex = $(event.data.btn).attr('data-nav');
//    		this.viewCollection.gotoView(navIndex);
    		this.refreshDisplays();
    		
    	    return;
    	    
    	}
    	
        //other btns...
        switch (btnId) {
        	case "btn_id_1":
        		
    		break;
            default:
            
                break;
        }
            
    };
    
    return TimelineNav;
    
});