define(["net/ui/Screen", "net/ui/Navigator"], function( Screen, Navigator ){


		// I return an initialized object.
		function MainMenu(){

			// Call the super constructor.
			Screen.call( this );

			// Return this object reference.
			return( this );

		}


		// The MainMenu class extends the base Screen class.
		MainMenu.prototype = Object.create( Screen.prototype );


		// Define the class methods.
		MainMenu.prototype.buttonAction = function( btnId ){

			return( this._name );

		};
		
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

		return MainMenu;

	}
);