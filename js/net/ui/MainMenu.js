define(['net/ui/Screen', 'net/ui/Navigator', 'net/ui/PhotoStack'], function( Screen, Navigator, PhotoStack ){


	// I return an initialized object.
	function MainMenu( containerDiv ){
		
		// Call the super constructor.
		Screen.call( this, containerDiv );
		
		// Return this object reference.
		return( this );

	}

	// The MainMenu class extends the base Screen class.
	MainMenu.prototype = Object.create( Screen.prototype );
	
	MainMenu.prototype.setup = function() {
		
		var c1 = $( this.containerDiv ).find("#photo_stack_1").first();
		this.photoStack1 = new PhotoStack( $(c1) );
		this.photoStack1.setTransitionMode( PhotoStack.MODE_FADE );

	}

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
	    	case "intro_learnmore":
	    	case "learnmore_close":
	    		$(this.containerDiv).find("#learnmore_overlay").first().toggle();
			break;
	        default:
	        
	            break;
	    }
	        
	};
//	
//	MainMenu.prototype.enable = function() {
//
//		this.photoStack1.start();
//		
//	}
//	
//	MainMenu.prototype.disable = function() {
//		
//		this.photoStack1.stop();
//		
//	}

	return MainMenu;

});