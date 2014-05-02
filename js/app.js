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


require(['libs/pace.min', 'net/data/AppData', 'net/media/Media', 'net/ui/MainMenu', 'jquery'], function( pace, AppData, Media, MainMenu ) {

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
    	
    	var mainMenu = new MainMenu();
    	mainMenu.initWithDiv( $("#wrapper #screen_mainmenu") );
    	    
    }


});