define([], function(){


    function AppData(){
		
		this.configXML = {};
		
    }
	
    AppData.updateSettings = function(configXML){
    
    	this.configXML = configXML;
    	this.audioFolder = $(this.configXML).find('setting[id=audioFolder]').attr('value');
    	this.audioExtension = $(this.configXML).find('setting[id=audioExtension]').attr('value');
    	this.videoFolder = $(this.configXML).find('setting[id=videoFolder]').attr('value');
    	this.videoExtension = $(this.configXML).find('setting[id=videoExtension]').attr('value');
    	this.developerMode = ($(this.configXML).find('setting[id=developerMode]').attr('value') == "true");
    	
    	this.disableTouchstone = ($(this.configXML).find('setting[id=disableTouchstone]').attr('value') == "true");
    	this.disableWilder = ($(this.configXML).find('setting[id=disableWilder]').attr('value') == "true");
    	
    	this.resourcesURL = $(this.configXML).find('setting[id=resourcesURL]').attr('value');
    	
    	this.isiOS = false;
    	//TODO - do check on browser for ios
    	
    };
    
    AppData.setCurrentModule = function(moduleId){
    
    	this.currentModuleId = moduleId;
    	
    };
    
    AppData.quitProgram = function() {
    	
    	//Do any saving or user warnings, then exit program.
    	$("#wrapper").html("<br/><h2>You have exited the program.</h2><p>You may now close your browser window.</p>");
    
    }

    return AppData;
    
});