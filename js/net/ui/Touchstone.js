define(["net/ui/Screen", "net/ui/Navigator", "tween"], function( Screen, Navigator ){


	// I return an initialized object.
	function Touchstone( containerDiv ){

		// Call the super constructor.
		Screen.call( this, containerDiv );

		// Return this object reference.
		return( this );

	}

	// The Touchstone class extends the base Screen class.
	Touchstone.prototype = Object.create( Screen.prototype );
	
	//public vars
	var tipShowing = false;
	var leafHasDropped = false;
	
	Touchstone.prototype.setup = function() {
		
	}
	
	function toggleTip() {
		var t = $("#header_bar #touchstone_tip");
		if (tipShowing == false) {
			$(t).show();
			TweenLite.set( $(t), { css: { top: -100 } } );
			TweenLite.to( $(t), 0.5, { css: { top: 0, opacity:1 }, ease:Power2.easeOut } );
			$("#header_bar #btn_tips_inner").addClass("circle-text-ring");
			tipShowing = true;
		}else {
			TweenLite.to( $(t), 0.5, { css: { top: -100, opacity:0 }, ease:Power2.easeInOut } );
			$("#header_bar #btn_tips_inner").removeClass("circle-text-ring");
			tipShowing = false;
		}
	}
	
	function updateTipText(tipStr) {
		
		var tt = $("#header_bar #touchstone_tip #tip_content");
		$(tt).text( tipStr );
		
	}
	
	function resetLeaf() {
		var leaf = $("#header_bar #center_leaf");
		TweenLite.set( $(leaf), { css: { top: -158, left: 464, rotation: 0 } } );
		TweenLite.to( $(leaf), 1.5, { css: { top: -59 }, ease:Power2.easeInOut, onComplete:leafResetComplete } );
	}
	
	function leafResetComplete(){
		leafHasDropped = false;
	}
	
	
	function dropLeaf() {
		var leaf = $("#header_bar #center_leaf");
		TweenLite.to( $(leaf), 2, { css: { top: 600, left: 150, rotation: 222 }, ease:Power2.easeInOut, onComplete:leafDropComplete } );
	}
	
	function leafDropComplete(){
	
		leafHasDropped = true;
		
	}

	
	//Overwrite button handlers
	Touchstone.prototype.buttonClicked = function(btnId) {
	
		console.log("Touchstone btn clicked: "+ btnId);
	    				
		// catch specific types of buttons
		if (btnId.substring(0, 5) == "goto_") {
		
			//main menu nav
			var screenId = btnId.substring(5);
			Navigator.goToScreen( screenId );
		    return;
		    
		}
	
	    //other btns...
	    switch (btnId) {
	    	case "center_leaf":
	    		if (leafHasDropped == false) {
	    			dropLeaf();
	    		}else {
	    			resetLeaf();
	    		}
			break;
			case "btn_tips":
			case "btn_tips_inner":
			case "touchstone_tip":
				toggleTip();
			break;
			case "btn_resources":
				updateTipText("Lorem ipsum this should be at least three lines of information. Let's see if the tip dropdown still positions correctly with more lines of text.");
			break;			
	        default:
	        
	            break;
	    }
	        
	};

	return Touchstone;

});