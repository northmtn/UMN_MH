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


require(['jquery', 'libs/pace.min', 'net/data/AppData', 'net/media/Media', 'net/ui/Navigator', 'net/ui/MainMenu', 'net/ui/Touchstone'], function( $, pace, AppData, Media, Navigator, MainMenu, Touchstone ) {

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
//        	autoSize();
			
			
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
    
    function autoSize() {
    	$( window ).resize(function() {
    	  resize();
    	});
    	resize();
    }
    
    function resize() {
    
    	//scale down content when browser window is smaller than designed size
		var newScale = scaleForBox( 1024, 700, $(window).width(), $(window).height() );
		if (newScale > 1) newScale = 1;
		TweenLite.set( $("#wrapper").first(), { css: { scale:newScale, transformOrigin:"top center" } } );
    		
    }
    
    function scaleForBox( originalWidth, originalHeight, boxWidth, boxHeight ) {
    
    	var widthScale = boxWidth / originalWidth;
    	var heightScale = boxHeight / originalHeight;
    	return Math.min( widthScale, heightScale );
   
    }


});