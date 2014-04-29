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
        	showSpinner();

        	configXML = xml;

        	setup();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Show error message if desired
        }
    });
    
    function setup() {
    
    	mytfunc = tfunc;

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

    	//temp
    	vp = new VidPlayer("#global_player");
    	vp.loadVideo("content/video/M01_S02V02_D.mp4");    	
    	
    	///temp
    	var c = $("#screen_touchstone #views_container");
    	var vc = new ViewCollection( $(c), "trustone_views");
    	
    	vc.addView( new View( $(c), "view_1", "touchstone_1") ); // ( containerDiv, contentId, templateId )
    	vc.addView( new View( $(c), "view_2", "view_2") );
    	vc.addView( new View( $(c), "view_3", "view_3") );
    	vc.addView( new View( $(c), "view_4", "touchstone_1") );
    	
    	
    	//will not work, must set after templates are loaded
    	vc.gotoView( 0 ); // set initial view
    	
    	//temp
    	var tn = new TimelineNav( $("#screen_touchstone  #timeline_nav").first(), vc);
    	tn.refreshDisplays();
    	
    	var initialImages = scrapeDivForImageArray( $("#wrapper #screen_mainmenu") );
    	preLoadImageArray(  initialImages, onInitialImageArrayPreLoaded, this);
    	
    	
    	/// T-STONE Bubble setups
    	// TODO - move into own class ya dingus
    	TweenLite.delayedCall(0.5, function () { 
    		
    		var bubbleContainer = $("#screen_touchstone #bubbles_container");
    		
    		var bub1 = new Bubble("bubble_physical", "Physical", bubbleContainer, 150, 250);
    		var bub2 = new Bubble("bubble_emotional", "Emotional", bubbleContainer, 350, 150);
    		var bub3 = new Bubble("bubble_spiritual", "Spiritual", bubbleContainer, 550, 150);
    		var bub4 = new Bubble("bubble_social", "Social", bubbleContainer, 700, 250);
    		var bub5 = new Bubble("bubble_environmental", "Environmental", bubbleContainer, 200, 400);
    		var bub6 = new Bubble("bubble_occupational", "Occupational", bubbleContainer, 425, 500);
    		var bub7 = new Bubble("bubble_financial", "Financial", bubbleContainer, 650, 400);
    		
    		var bubTank = new BubbleTank( bubbleContainer );
    		bubTank.addBubbles( [bub1,bub2,bub3,bub4,bub5,bub6,bub7] );
    		
    		
    		//Set home positions of all bubbles
    		var homePt = [];
    		var offsetX = 200;
    		var offsetY = 300;
    		var degreeOffset = 360 / bubTank.bubbles.length;
    	
    		for (var i = 0; i < bubTank.bubbles.length; i++) {
    			homePt = getPointOnRing( deg2Rad(degreeOffset) * i, 200);
    			bubTank.bubbles[i].setHome(homePt[0] + offsetX, homePt[1] + offsetY);
    		}
    		
    		
    		//attach navigation to bubble tank
    		$("#navigation_bar #step_buttons_container").children( "div[id^='step']" ).each( function () {
				
    			$( this ).on( "click", function() {
    			
					//show/hide subtitles and change background
					$("#navigation_bar #step_buttons_container").children( "div[id^='step']" ).each( function () {
						$(this).children('#subtitle').hide();
						$(this).css("background-color", "rgb(90,220,180)");
					});
					$(this).children('p[id="subtitle"]').show();
					$(this).css("background-color", "rgb(10,90,25)");
					

    			  var id = $(this).attr('id');
    			      		  
    			  switch (id) {
    			  	case 'step_1':
    			  		bubTank.activateBubbles(["bubble_physical","bubble_emotional"]);
    			  	break;
    			  	case 'step_2':
    			  		bubTank.activateBubbles(["bubble_spiritual"]);
    			  	break;
    			  	case 'step_3':
    			  		bubTank.activateBubbles(["bubble_occupational","bubble_physical"]);
    			  	break;
    			  	case 'step_4':
    			  		bubTank.activateBubbles(["bubble_social"]);
    			  	break;
    			  	case 'step_5':
    			  		bubTank.activateBubbles(["bubble_financial","bubble_environmental"]);
    			  	break;
    			  	
    			  }
    			  
    			});
    			    			    			    		
    		});

    	}); // End T-STONE Bubble setups
    	    	
    }
    
    function tfunc(str) {
    	out("dest a a a "+ str);
    }
    
    
    function onInitialImageArrayPreLoaded() {
    
    	hideSpinner();
    	
    	refreshButtonListeners();
    	
    }
 
 });