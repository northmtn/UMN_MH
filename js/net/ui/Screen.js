define([], function(){


    function Screen(containerDiv){
    	
    	this.containerDiv = containerDiv; 
    	this.hasBeenInitialized = false;
        	
    }

    Screen.prototype.init = function(){
            
        if (this.hasBeenInitialized == false) {
        	
        	//do loading and setup
        	this.setup();
        
        }else {
        
        	//already loaded and setup,
        	//reset as needed..
        	
        }        
        
        this.hasBeenInitialized = true;  
        this.enable();
        
    };
    
    Screen.prototype.setup = function() {
    	//overwrite function to setup
    }
    
    Screen.prototype.enable = function() {
    	
    	this.refreshButtonListeners()
    	
    }
    
    Screen.prototype.disable = function(){
    		
    	this.disableButtonListeners();
    		
    }
    
    Screen.prototype.refreshButtonListeners = function(){
        
    	var thisRef = this;
    	
    	//Removes all existing listeners to avoid layering listeners
    	this.disableButtonListeners();
    
        //Listen for all button clicks...
        $(this.containerDiv).find("div[data-role='button'], button[data-role='button'], img[data-role='button'], p[data-role='button'], h3[data-role='button']").on("click", function(event){
            thisRef.buttonClicked($(this).attr('id'), $(this));
        });
    
    };
    
    Screen.prototype.disableButtonListeners = function() {
    
    	//Removes all existing listeners to avoid layering listeners
    	$(this.containerDiv).find("div[data-role='button'], button[data-role='button'], img[data-role='button'], p[data-role='button'], h3[data-role='button']").each( function () {
    		$(this).off();	
    	});
    	
    }
    
    Screen.prototype.buttonClicked = function(btnId, btnRef) {
        	
    	console.log("buttonClicked(btnId): " + btnId);
    
        //other btns...
        switch (btnId) {
        	case "btn_id_1":
        		
    		break;
            default:
            
                break;
        }
            
    };
    
    return Screen;
    
});