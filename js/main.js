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

        	initialize();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Show error message if desired
        }
    });
    
    
    function initialize() {
        	
    	//read config settings, set global vars
    	audioExtension = $(configXML).find('setting[id=audioExtension]').attr('value');
    	videoExtension = $(configXML).find('setting[id=videoExtension]').attr('value');
    	developerMode = ($(configXML).find('setting[id=developerMode]').attr('value') == "true");
    	LMSEnabled = $(configXML).find('setting[id=LMSEnabled]').attr('value') == "true";//converts to bool
    	
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
    	vp = new VidPlayer("global_player");
    	vp.loadVideo("content/video/M01_S02V02_D.mp4");
    	
    }
        
 });
 