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
    if (btnId.substring(0, 5) == "goto_") {
    
		//main menu nav
		var screenId = btnId.substring(5);
		globalNavGo( screenId );
        return;
        
    }

    //other btns...
    switch (btnId) {
    	case "btnid_1":
    		
		break;
		case "btnid_2":
			
		break;
        default:
        
            break;
    }
        
}



function globalNavGo(screenId) {
		
	$("#screen_"+screenId).show();
	$("#screen_mainmenu").show();
	
	if (screenId != "mainmenu") {
	
		$("#screen_"+screenId).css("left", 1024);
		TweenLite.to( $("#screen_mainmenu"), 1, { css: { left: -1024 } } );
		
	}else {
		
		$("#screen_"+screenId).css("left", -1024);
		
		TweenLite.to( $("#screen_integrative,#screen_touchstone,#screen_wilder" ), 1, { css: { left: 1024 } } );
		
	}
	
	TweenLite.to( $("#screen_"+screenId), 1, { css: { left: 0 } } );

}

function bubbleIn(element) {
//	out("over");
}
function bubbleOut(element) {
//	out("out");
}
function bubbleClick(element) {
//	out("click");
}