define([], function(){

    function Quiz( containerDiv, configData, callbackObject ){
    
 		var thisRef = this;
    	
    	this.containerDiv = containerDiv;
    	this.configData= configData;
    	this.callbackObject = callbackObject;
    	
    	this.titleDiv = $(this.containerDiv).find("#question_title");
    	this.questionDiv = $(this.containerDiv).find("#question_text");
    	this.feedbackDiv = $(this.containerDiv).find("#feedback_text");
    	this.answerDiv = $(this.containerDiv).find("#answer_area");
    	this.quizBtn = $(this.containerDiv).find("#quiz_button");

    	this.qa = [];
    	
    	$(this.configData).children("QA").each(function() {
    		
    		var qTitle = $(this).attr('title');
    		var qQuestion = $(this).attr('question');
    		var qFeedback = $(this).attr('feedback');
    		    		
    		thisRef.qa.push( [qTitle, qQuestion, qFeedback] );
    		
    	});
    	
    	this.numQuestions = this.qa.length;
    	this.curQuestionIndex = 0;
    	this.feedbackShown = false;
    	
    	$(this.quizBtn).on( "click", { thisRef: thisRef }, thisRef.quizBtnClicked );
			        	
    }
    
    Quiz.prototype.reset = function( ) {
    
    	this.showQuestion(0);
    
    }
    
    Quiz.prototype.nextQuestion = function( ) {
    
    	this.showQuestion( this.curQuestionIndex + 1 );
    
    }

    Quiz.prototype.showQuestion = function( qIndex ) {
    
    	$(this.titleDiv).html( this.qa[qIndex][0] );
    	$(this.questionDiv).html( this.qa[qIndex][1] );
    	$(this.feedbackDiv).html( this.qa[qIndex][2] );
    	$(this.answerDiv).val( "" );//clear text area
    	$(this.quizBtn).html("DONE");
    	
    	//default feedback to hidden
    	$(this.feedbackDiv).hide();
    	this.feedbackShown = false;
    	
    	this.curQuestionIndex = qIndex;
    
    }
    
    Quiz.prototype.showFeedback = function( ) {
    
    	//assume feedback text is already set.
    	$(this.feedbackDiv).show();
    	this.feedbackShown = true;
    	
    	if ( this.onLastQuestion() == false ) {
    		$(this.quizBtn).html("NEXT");
    	} else {
    		$(this.quizBtn).html("FINISH");
    	}
    
    }
    
    Quiz.prototype.exit = function( ) {
    	
    	$(this.quizBtn).off( );
    	
    	if (this.callbackObject != null && this.callbackObject != undefined){
    		//assumes parent callback obj has this function
    		this.callbackObject.onQuizFinished();
    	}
    	
    }
    
    Quiz.prototype.onLastQuestion = function( ) {
    
    	if (this.curQuestionIndex < this.numQuestions-1) {
    		return false;
    	} else {
    		return true;
    	}
    
    }
    
    Quiz.prototype.quizBtnClicked = function( event ) {
        	
    	var thisRef = event.data.thisRef;
    	
    	if (thisRef.feedbackShown == false) {
    	
    		//show feedback
    		thisRef.showFeedback();

    	} else {
    		
    		if ( thisRef.onLastQuestion() == false ) {
    			//go to next question
    			thisRef.nextQuestion();
    		} else {
    			//quiz finished, exit quiz
    			thisRef.exit();
    		}

    	}
    	
    }

        
    return Quiz;
    
});