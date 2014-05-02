define(["net/ui/Screen", "net/ui/Navigator"], function( Screen, Navigator ){


		// I return an initialized object.
		function Touchstone(){

			// Call the super constructor.
			Screen.call( this );

			// Return this object reference.
			return( this );

		}


		// The Touchstone class extends the base Screen class.
		Touchstone.prototype = Object.create( Screen.prototype );

		
		//Overwrite button handlers
		Screen.prototype.buttonClicked = function(btnId) {
		    				
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

		return Touchstone;

	}
);