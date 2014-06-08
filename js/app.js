require.config({

    //By default load any module IDs from js/lib
    baseUrl: 'js',
    
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
	      'jquery'      	: 'libs/jquery/jquery',
	      'tween'      		: 'libs/greensock/TweenMax.min'
    }
    
});


require(['libs/pace.min', 'net/data/AppData', 'net/media/Media', 'net/ui/Navigator', 'net/ui/MainMenu', 'net/ui/Touchstone', 'jquery'], function( pace, AppData, Media, Navigator, MainMenu, Touchstone ) {

	/*--------------*/
	/* Initial Load */
	/*--------------*/
	
	pace.start(); // start progress bar
		
	//Load XML
    $.ajax({
        type: "GET",
        url: "content/config.xml",
        dataType: "xml",
        success: function (xml) {
        
        	AppData.updateSettings(xml);
        	Media.setupPlayers();
        	initialize();
			
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Show error message if desired
            
        }
    });

    
    function initialize() {
    	
    	Navigator.init();
    	
    	var mm = new MainMenu( $("#wrapper #screen_mainmenu"), this );
    	var ts = new Touchstone( $("#wrapper #screen_touchstone"), this );
    	
    	Navigator.addScreen(mm);
    	Navigator.addScreen(ts);
    	
    	Navigator.goToScreen("mainmenu");
    	    
    }


});