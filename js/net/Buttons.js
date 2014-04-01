/*-----------------*/
/* Button Listners */
/*-----------------*/

function refreshButtonListeners () {

	//Removes all existing listeners to avoid layering listeners
	$("img[data-role='button']").each( function () {
		$(this).off( );	
	});
	$("div[data-role='button']").each( function () {
		$(this).off( );	
	});
	$("button[data-role='button']").each( function () {
		$(this).off( );	
	});
	

    //Listen for all button clicks...
    $("img[data-role='button']").on("click", function(event){
        var clickedId = $(this).attr('id');
        if (typeof clickedId == 'undefined') clickedId = getFileName($(this).attr('src'));
        buttonClicked(clickedId);
    });
    $("div[data-role='button']").on("click", function(event){
        buttonClicked($(this).attr('id'));
    });
    $("button[data-role='button']").on("click", function(event){
        buttonClicked($(this).attr('id'));
    });

}

/*-----------------*/
/* Button Handlers */
/*-----------------*/

function buttonClicked(btnId) {
    	
		out("buttonClicked(btnId): "+btnId);

    // catch specific types of buttons
    if (btnId.substring(0, 7) == "navDot_") {

        return;
        
    }

    //other btns...
    switch (btnId) {
    	case "goto_integrative":
    		
    	break;
		case "goto_touchstone":
			
		break;
		case "goto_wilder":
			
		break;
        default:
        
            break;
    }
        
}