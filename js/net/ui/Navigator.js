define(['libs/pace.min'], function(pace){


    function Navigator(){
    	
    }
    
    Navigator.init = function(){

    	//Init screens
    	this.screens = []; 
    	    	
    };
    
    Navigator.addScreen = function(screen){
    	this.screens.push(screen);
    }
    
    Navigator.goToScreen = function( screenContainerId ) {
            						
		//hide current screen
		if(this.currentScreen) {
			this.currentScreen.disable();
			$(this.currentScreen.containerDiv).hide();
		} else {
			$("#screen_"+screenContainerId).parent().children("div[id^='screen_']").each( function () {
				$(this).hide();
			});
		}
		
		pace.restart(); // show load bar
		
		switch (screenContainerId) {
		
			case 'mainmenu':
				this.currentScreen = this.screens[0];
			break;
			case 'touchstone':
				this.currentScreen = this.screens[1];
			break;
			case 'integrative':
				this.currentScreen = this.screens[2];
			break;
			case 'wilder':
				this.currentScreen = this.screens[3];
			break;
		  	
		}
		
		//show new screen
		$(this.currentScreen.containerDiv).show();
		
		//IF this screen (module) has not already been initialized, do so now. Otherwise just reset and show.
		this.currentScreen.init();
			
					
    }
    
    function doScreenTransition() {
    	
    	/*		
    	$("#screen_"+screenContainerId).show();
    	$("#screen_mainmenu").show();
    	
    	if (screenContainerId != "mainmenu") {
    	
    		$("#screen_"+screenContainerId).css("left", 1024);
    		TweenLite.to( $("#screen_mainmenu"), 1, { css: { left: -1024 } } );
    		
    	}else {
    		
    		$("#screen_"+screenContainerId).css("left", -1024);
    		TweenLite.to( $("#screen_integrative,#screen_touchstone,#screen_wilder" ), 1, { css: { left: 1024 } } );
    		
    	}
    	
    	TweenLite.to( $("#screen_"+screenContainerId), 1, { css: { left: 0 } } );
    	*/
    	
    }

    return Navigator;
    
});