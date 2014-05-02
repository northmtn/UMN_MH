define(['libs/soundmanager2/soundmanager2'], function(sm){


    function Media(){
		
		this.configXML = {};
		
    }
	
   Media.setupPlayers = function(){

   		this.setupSoundManager();

   };
   
   Media.setupSoundManager = function() {
   
       soundManager.setup({
         url: 'js/libs/soundmanager2/',
         // ignore Flash where possible, use 100% HTML5 mode
         preferFlash: false,
         onready: function() {
           // Ready to use; soundManager.createSound() etc. can now be called.
           console.log("soundManager ready...");
          	
         }
       });
       
   }

    return Media;
    
});