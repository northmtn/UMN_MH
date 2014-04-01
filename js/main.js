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
    
    	out("initialize");
    	
    	//read config settings, set global vars
    	audioExtension = $(configXML).find('setting[id=audioExtension]').attr('value');
    	videoExtension = $(configXML).find('setting[id=videoExtension]').attr('value');
    	developerMode = ($(configXML).find('setting[id=developerMode]').attr('value') == "true");
    	LMSEnabled = $(configXML).find('setting[id=LMSEnabled]').attr('value') == "true";//converts to bool

    	refreshButtonListeners();
    	
    }

 });
 