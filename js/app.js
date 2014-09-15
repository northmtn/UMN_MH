require.config({

    //By default load any module IDs from js/lib
    baseUrl: 'js',
    
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
	      'jquery'      	: 'libs/jquery/dist/jquery.min',
	      'tween'      		: 'libs/gsap/src/minified/TweenMax.min'
    }
    
});


require(['jquery', 'libs/pace/pace.min', 'net/data/AppData', 'net/media/Media', 'net/ui/Navigator', 'net/ui/MainMenu', 'net/ui/Integrative', 'net/ui/Touchstone', 'net/ui/Wilder'], function( $, pace, AppData, Media, Navigator, MainMenu, Integrative, Touchstone, Wilder ) {

	/*--------------*/
	/* Initial Load */
	/*--------------*/
	
	pace.start(); // start progress bar
	pace.once("done", function() {
		Media.setupPlayers();
	});
		
	//Load XML
    $.ajax({
        type: "GET",
        url: "content/config.xml",
        dataType: "xml",
        success: function (xml) {
        
        	AppData.updateSettings(xml);
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
    	var imh = new Integrative( $("#wrapper #screen_integrative"), this );
    	var ts = new Touchstone( $("#wrapper #screen_touchstone"), this );
    	var wi = new Wilder( $("#wrapper #screen_wilder"), this );
    	
    	Navigator.addScreen(mm);
    	Navigator.addScreen(imh);
    	Navigator.addScreen(ts);
    	Navigator.addScreen(wi);
    	
    	Navigator.goToScreen("mainmenu");
    	
    	//fade-in
    	$("#wrapper").show();
    	    
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