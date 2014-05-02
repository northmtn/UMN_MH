define(['libs/pace.min', 'net/ui/Touchstone'], function(pace, Touchstone){


    function Navigator(){
    
    	this.currentScreen = {};
    
    }
    
    Navigator.goToScreen = function( screenContainerId ) {
				
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
		
		//hide current screen
		if(this.currentScreen != null) {
		
			this.currentScreen.hide();
			
		} else {
			$("#screen_"+screenContainerId).parent().children("div[id^='screen_']").each( function () {
				$(this).hide();
				console.log("hiding : "+ $(this).attr('id') );
			});
		}
		
		pace.restart();
		
		//show new screen
		this.currentScreen = $("#screen_"+screenContainerId);
		$(this.currentScreen).show();
		if (screenContainerId == "touchstone") {
		
			var tc = new Touchstone();
			tc.initWithDiv($(this.currentScreen));
		
		}
		
		
		//preload assets for this module if they haven't been already. 
			
					
    }

    return Navigator;
    
});