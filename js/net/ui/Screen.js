define([], function(){


    function Screen(){
    
    }

    Screen.prototype.initWithDiv = function(containerDiv){
            
        this.containerDiv = containerDiv;    
        this.refreshButtonListeners()
            
    };
    
    Screen.prototype.disable = function(){
    		
    	this.disableButtonListeners();
    		
    }
    
    Screen.prototype.refreshButtonListeners = function(){
    
    	var thisRef = this;
    	
    	//Removes all existing listeners to avoid layering listeners
    	this.disableButtonListeners();
    
        //Listen for all button clicks...
        $(this.containerDiv).find("div[data-role='button'], button[data-role='button'], img[data-role='button'], p[data-role='button']").on("click", function(event){
            thisRef.buttonClicked($(this).attr('id'));
        });
    
    };
    
    Screen.prototype.disableButtonListeners = function() {
    
    	//Removes all existing listeners to avoid layering listeners
    	$(this.containerDiv).find("div[data-role='button'], button[data-role='button'], img[data-role='button'], p[data-role='button']").each( function () {
    		$(this).off( );	
    	});
    	
    }
    
    Screen.prototype.buttonClicked = function(btnId) {
        	
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