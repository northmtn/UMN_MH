define( [], function () {

    function Scraper(name) {

        if (!(this instanceof Scraper)) {
            throw new TypeError("Scraper constructor cannot be called as a function.");
        }
        
    }

	//Load image array
    Scraper.getImageArray = function (containerDiv) {
    
    	var imgArr = [];

    	//gather image urls from template html
    	$(containerDiv).find('img').each( function () {
    		if ( $(this).attr('src') != "") {
    			imgArr.push( $(this).attr('src') );
    		}
    		
    	});
    	
    	return imgArr;
    	
    }
    
    return Scraper;
    
});