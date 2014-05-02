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
    	
        
    };

    return AppData;
    
});