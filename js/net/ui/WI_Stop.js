define(['net/util/Util'], function( Util ){


    function WI_Stop( configData ) {
    
    	var thisRef = this;
    	this.configData = configData;
    	
    	this.buildingId = $(configData).attr('building');
    	this.title = $(configData).find("text[id='stop_title']").first().text();

    	//Intro
    	this.introText =  $(configData).find("text[id='stop_intro']").first().text();
    	this.introAudioId = $(configData).find("text[id='stop_intro']").first().attr('audio');

    	//PEOPLE DATA
    	this.people = [];
    	$(configData).children("person").each(function() {
    	
    		var p = [$(this).attr('id'), $(this).attr('audio'), $(this).attr('duration'), $(this).attr('feedback_popup'), $(this).text() ];
    		thisRef.people.push(p);
    		
    	});
    	
    	//SETUP REVIEW
    	this.reviewBtns = [];
    	$(configData).find("review button").each(function() {

    		var btnId = $(this).first().text();
    		var dataVideo = $(this).attr('video');
    		var dataAudio = $(this).attr('audio');
    		var dataReading = $(this).attr('reading');
    		var dataQA = $(this).attr('quiz');
    		var dataFeedback = $(this).attr('feedback_popup');
				
			var rBtn = [btnId, dataVideo, dataAudio, dataReading, dataQA, dataFeedback];
    		thisRef.reviewBtns.push(rBtn);
    		
    	});

    }
    
     WI_Stop.prototype.getPersonIndexById = function( pId ) {
    
    	var pIndex = -1;
    
		for (var i = 0; i < this.people.length; i++) {
		
			if ( "person_" + Util.removeSpaces(this.people[i][0]) == pId ) {
				pIndex = i;
				break;
			}
		}
    	
    	return pIndex;

    }
    
    
    WI_Stop.prototype.getReadingById = function( readingId ) {
    
    	var matchedReading = {};
    
		$(this.configData).find("reading").each( function() {
			
			var rId = $(this).attr('id');
						
			if ( rId == readingId ) {
							
				matchedReading = $(this);
				return $(this);
			}
    		
    	});
    	
    	return matchedReading;

    }
    
    WI_Stop.prototype.getQuizById = function( quizId ) {
    
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

    return WI_Stop;
    
});
