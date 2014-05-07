define(['net/ui/Screen', 'net/ui/Navigator'], function( Screen, Navigator ){


	// I return an initialized object.
	function MainMenu( containerDiv ){
		
		// Call the super constructor.
		Screen.call( this, containerDiv );
		
		// Return this object reference.
		return( this );

	}

	// The MainMenu class extends the base Screen class.
	MainMenu.prototype = Object.create( Screen.prototype );
	
	//Overwrite button handlers
	MainMenu.prototype.buttonClicked = function(btnId, btnRef) {
	    				
		// catch specific types of buttons
		if (btnId.substring(0, 5) == "goto_") {
		
			//main menu nav
			var screenId = btnId.substring(5);			
			Navigator.goToScreen( screenId );
			
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

	return MainMenu;

});