define( ['tween', 'jquery'], function (tween) {

    function Spinner(name) {

        if (!(this instanceof Spinner)) {
            throw new TypeError("Spinner constructor cannot be called as a function.");
        }
        
    }

     Spinner.showSpinner = function () {
    
    	$("#spinnerOverlayContainer").show();
    	
    	TweenLite.fromTo($("#spinnerOverlayContainer"), 1, {opacity: 0}, {opacity: 1});
    	
    	//Start spinning
    	TweenMax.to( $("#spinnerOverlayContainer #loadingSpinner"), 1, {rotation:360, repeat:-1, yoyo:false, ease:"Linear.easeNone"});
    	
    }
    
    Spinner.hideSpinner = function () {
    
    	TweenMax.killTweensOf($("#spinnerOverlayContainer"));
    	
    	TweenLite.to( $("#spinnerOverlayContainer"), 1, { css: { opacity: 0 }, ease: Power3.easeOut, onComplete: function () { 
    	
    		//Stop spinning
    		TweenMax.killTweensOf($("#spinnerOverlayContainer #loadingSpinner"));
    		
    		$("#spinnerOverlayContainer").hide();
    	
    	}});
    	
    	$("#spinnerOverlayContainer").hide();
    	
    }

    return Spinner;
});