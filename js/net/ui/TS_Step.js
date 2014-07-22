define(['net/util/Util'], function( Util ){


    function TS_Step( configData ) {
    
    	var thisRef = this;
    	this.configData = configData;
    	
    	//parse config data
    	this.title = $(configData).attr('title');
    	this.id = this.title;
    	
    	this.introAudioId = $(configData).attr('audio');
    	    	
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
    	
    	//INNER OVAL CONTENT
    	this.descriptionTitle = (this.title).toUpperCase();
    	this.descriptionContent = $(configData).find('#step_description').first().text();
    	
    	//INNER OVAL REVIEW
    	this.reviewBtns = [];
    	$(configData).find("review button").each(function() {

    		var btnId = $(this).first().text();
    		var dataVideo = $(this).attr('video');
    		var dataAudio = $(this).attr('audio');
    		var dataQA = $(this).attr('quiz');
    		var dataFeedback = $(this).attr('feedback_popup');
				
			var rBtn = [btnId, dataVideo, dataAudio, dataQA, dataFeedback];
    		thisRef.reviewBtns.push(rBtn);
    		
    	});
    	
    	//PERSONNEL DATA
    	this.personnel = [];
    	$(configData).children("personnel").each(function() {
    	
    		var p = [$(this).attr('role'), $(this).attr('audio'), $(this).attr('duration'), $(this).attr('feedback_popup'), $(this).text() ];
    		thisRef.personnel.push(p);
    		
    	});

    }
    
     TS_Step.prototype.getPersonnelIndexById = function( pId ) {
    
    	var pIndex = -1;
    
		for (var i = 0; i < this.personnel.length; i++) {
			console.log("role_" + Util.removeSpaces(this.personnel[i][0]) +", " + pId );
			if ( "role_" + Util.removeSpaces(this.personnel[i][0]) == pId ) {
				pIndex = i;
				break;
			}
		}
    	
    	return pIndex;

    }
    
    
    TS_Step.prototype.getQuizById = function( quizId ) {
    
    	var matchedQuiz = {};
    
		$(this.configData).find("quiz").each( function() {
			
			var qId = $(this).attr('id');
						
			if ( qId == quizId ) {
							
				matchedQuiz = $(this);
				return $(this);
			}
    		
    	});
    	
    	return matchedQuiz;

    }

    return TS_Step;
    
});