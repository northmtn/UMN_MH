define([], function(){


    function Util(){
		
		
    }
	
    Util.removeSpaces = function(str){

    	str = str.replace(/ +/g, "");
    	return str;
    	
    };

    return Util;
    
});