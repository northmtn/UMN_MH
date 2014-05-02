define( ['net/load/Spinner', 'net/load/ImgLoader'], function (Spinner, ImgLoader) {

    function Loader(name) {

        if (!(this instanceof Loader)) {
            throw new TypeError("Loader constructor cannot be called as a function.");
        }
        
    }

	//Load image array
    Loader.loadImageArray = function (imagesArray, loadingCompleteCallback, callbackObj) {
    
    	if (imagesArray.length == 0) {
    		console.log("Oops - No images to load");
    		loadingCompleteCallback.apply (callbackObj, []);
    		return;
    	}
    	
    	Spinner.showSpinner();
    		
		new ImgLoader(imagesArray, {
		    onProgress: function(img, imageEl, index){
		        // fires every time an image is done or errors. 
		        // imageEl will be falsy if error
		        console.log('just ' +  (!imageEl ? 'failed: ' : 'loaded: ') + img);
		        console.log(this.completed.length + this.errors.length + ' / ' + this.queue.length + ' done');
		    }, 
		    onComplete: function(loaded, errors){
		        // fires when whole list is done. cache is primed.
		        console.log('done', loaded);
		        loadingCompleteCallback.apply (callbackObj, []);
		        Spinner.hideSpinner();
		        if (errors){
		            console.log('the following failed', errors);
		        }
		    }
		});
		
    }

    return Loader;
    
});