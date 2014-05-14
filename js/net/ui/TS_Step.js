define([], function(){


    function TS_Step( configData ) {
    	
    	//parse config data
    	this.title = $(configData).attr('title');
    	this.id = this.title;
    	    	
    	this.dimensionsStr = $(configData).attr('dimensions');
    	this.dimensions = this.dimensionsStr.split(", ");
    	this.dimensionsTitle = "";
    	for (var i = 0; i < this.dimensions.length; i++) {
    		if (i>0) {
    			if (i!=this.dimensions.length-1) {
    				this.dimensionsTitle += ", ";
    			} else {
    				this.dimensionsTitle += " & ";
    			}
    		}
    		this.dimensionsTitle += this.dimensions[i];
    	}
    	
    	//PERSONNEL DATA
    	this.personnel = [];
    	var thisRef = this;
    	$(configData).children("personnel").each(function() {
    	
    		var p = [$(this).attr('role'), $(this).attr('audio')];
    		thisRef.personnel.push(p);
    		
    	});

    }
    
    TS_Step.prototype.goToIt = function(  ) {
		
    }

    return TS_Step;
    
});