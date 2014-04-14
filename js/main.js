$(document).ready(function () {

    /*--------------*/
    /* Initial Load */
    /*--------------*/
    
    //Load XML
    $.ajax({
        type: "GET",
        url: "content/config.xml",
        dataType: "xml",
        success: function (xml) {
        	
        	//Will spin until the initial section is loaded.
//        	showSpinner();

        	configXML = xml;

        	setup();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Show error message if desired
        }
    });
    
    function setup() {
    
    	//read config settings, set global vars
    	audioFolder = $(configXML).find('setting[id=audioFolder]').attr('value');
    	audioExtension = $(configXML).find('setting[id=audioExtension]').attr('value');
    	videoFolder = $(configXML).find('setting[id=videoFolder]').attr('value');
    	videoExtension = $(configXML).find('setting[id=videoExtension]').attr('value');
    	developerMode = ($(configXML).find('setting[id=developerMode]').attr('value') == "true");
    	
    	setupSoundManager(); // delay app start until after sound manager setup.
    	
    }
    
    function setupSoundManager() {
    	
    	soundManager.setup({
    	  url: 'js/libs/soundmanager2/',
    	  // ignore Flash where possible, use 100% HTML5 mode
    	  preferFlash: false,
    	  onready: function() {
    	    // Ready to use; soundManager.createSound() etc. can now be called.
    	    
    	   	//Start App
    	   	initialize();
    	   	
    	  }
    	});
    }
    
    function initialize() {

    	var bubbleContainer = $("#screen_touchstone #bubbles_container");
    	
    	var bub1 = new Bubble("bubble_physical", "PHYSICAL", bubbleContainer, 150, 250);
    	var bub2 = new Bubble("bubble_emotional", "EMOTIONAL", bubbleContainer, 350, 150);
    	var bub3 = new Bubble("bubble_spiritual", "SPIRITUAL", bubbleContainer, 550, 150);
    	var bub4 = new Bubble("bubble_social", "SOCIAL", bubbleContainer, 700, 250);
    	var bub5 = new Bubble("bubble_environmental", "ENVIRONMENTAL", bubbleContainer, 200, 400);
    	var bub6 = new Bubble("bubble_occupational", "OCCUPATIONAL", bubbleContainer, 425, 500);
    	var bub7 = new Bubble("bubble_financial", "FINANCIAL", bubbleContainer, 650, 400);

    	refreshButtonListeners();
    	
    	//temp
    	vp = new VidPlayer("#global_player");
    	vp.loadVideo("content/video/M01_S02V02_D.mp4");    	
    	
    	///temp
    	var c = $("#screen_touchstone #views_container");
    	var vc = new ViewCollection( $(c), "trustone_views");
    	
    	vc.addView( new View( $(c), "view_1", "view_1") ); // _containerDiv, _contentId, _templateId
    	vc.addView( new View( $(c), "view_2", "view_1") );
    	vc.addView( new View( $(c), "view_3", "view_1") );
    	vc.addView( new View( $(c), "view_4", "view_4") );
    	
    	//will not work, must set after templates are loaded
    	vc.gotoView( 0 ); // set initial view
    	
    	//temp
    	var tn = new TimelineNav( $("#screen_touchstone  #timeline_nav").first(), vc);
    	tn.refreshDisplays();
    	
    }
    
    
        
 });
 