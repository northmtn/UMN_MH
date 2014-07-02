define(['net/data/AppData'], function(AppData){

    function Tips(){
			        	
    }
    
    Tips.setContainerDiv = function( div ) {
    
    	this.containerDiv = div;
    	this.tipText = $(this.containerDiv).find("#tip_content");
    	this.curTipStr = "";
    	this.tipShowing = false;
    	this.allowTimedClose = false;
    	
    }
    
    Tips.lookup = function( tipId ) {
    	    	
    	//Search tip configs for to retrieve tip text.
    	//TODO - should probably narrow search to only tips under current module's config
    	var t = $(AppData.configXML).find("tips tip[id='"+tipId+"']").first();
    	
    	var tText = $(t).text();
    	var tDelay = $(t).attr('delay');
    	var tDuration = $(t).attr('duration');

    	return [tText, tDelay, tDuration];
    	
    }
    
    Tips.showById = function( tipId ) {
    	
    	var t = this.lookup( tipId );
    	this.showNewTip( t[0], t[1], t[2] );
    	
    }
    
    Tips.updateText = function( tipStr ) {
    	
    	this.curTipStr = tipStr;
    	$( this.tipText ).text( tipStr );
    	
    }
    
    Tips.getCurrentText = function(  ) {
    	
    	return $( this.tipText ).text();
    	
    }
    
    Tips.showNewTip = function( tipStr, delay, duration ) {
    	
    	//default delay to 0
    	delay = typeof delay !== 'undefined' ? delay : 0;
    	
    	var thisRef = this;
    	TweenLite.delayedCall(delay, function() {
    	
    		thisRef.updateAndShow( tipStr, duration );
    		
    	});

    }
    
    Tips.updateAndShow = function( tipStr, duration ) {
    	
    	//default duration to 0
    	duration = typeof duration !== 'undefined' ? duration : 0;
    	
    	var thisRef = this;
    	
    	console.log(" Tips.updateAndShow : "+tipStr, duration);
    	
    	if (this.tipShowing == false) {
    	
    		//update and open
    		this.updateText(tipStr);
    		this.show();
    		    		
    		//setup delayed close
    		if ( duration > 0 ) {
    			
    			this.allowTimedClose = true;
    		
    			TweenLite.delayedCall( duration, function() {
	    			
	    			//close if tip has not changed or been interacted with
	    			if ( thisRef.allowTimedClose == true ){
	    			
	    				thisRef.hide(tipStr);
	    			
	    			}
	    			
	    		});
	    		
    		}  
    		    		
    	} else {
    		//first close, then update and open
    		this.hide();

    		TweenLite.delayedCall(0.45, function() {
    		
    			thisRef.updateAndShow(tipStr, duration);

    		});
    		
    	}

    }

    Tips.show = function() {
    
    	$(this.containerDiv).show();
    	
    	TweenLite.set( $(this.containerDiv), { css: { top: -100 } } );
    	TweenLite.to( $(this.containerDiv), 0.5, { css: { top: 0, autoAlpha:1 }, ease:Power2.easeOut } );
    	
    	$(this.containerDiv).parent().find("#btn_tips_inner").addClass("circle-text-ring");
    	
    	this.tipShowing = true;
    	
    }
    
    Tips.hide = function(tipStr) {
    
    	//default tipStr to curTipStr
    	tipStr = typeof tipStr !== 'undefined' ? tipStr : this.curTipStr;
    	if (tipStr != this.curTipStr) return;
    	
		TweenLite.to( $(this.containerDiv), 0.4, { css: { top: -100, autoAlpha:0 }, ease:Power2.easeIn } );
		
		$(this.containerDiv).parent().find("#btn_tips_inner").removeClass("circle-text-ring");
		
		this.tipShowing = false;
		this.allowTimedClose = false;
    	
    }
    
    Tips.toggle = function() {
    
    	if (this.tipShowing == false) {
    		
    		//Show Tip
    		this.show();
    		
    	}else {
    	
    		//Hide Tip
    		this.hide();
    		
    	}
    	
    }

    return Tips;
    
});