define([], function(){


    function Geom(){
				
    }
    
    //Distance between 2 points in 2d space
    Geom.dist = function( x1, y1, x2, y2 ) {
      var xs = 0;
      var ys = 0;
    
      xs = x2 - x1;
      xs = xs * xs;
    
      ys = y2 - y1;
      ys = ys * ys;
    
      return Math.sqrt( xs + ys );
      
    }
	
    //Convert degrees to radians
    Geom.deg2Rad = function(degrees) {
    
    	return degrees * (Math.PI/180);
    	
    }
    
    //Generate random point within a circle
    Geom.randomPointInCircle = function( radius ) {
    
        var randomAngle = Math.random() * (Math.PI * 2);
        var newX = (Math.random()*radius)*Math.cos(randomAngle);
        var newY = (Math.random()*radius)*Math.sin(randomAngle);
        return [newX,newY];
    
    }
    
    //Generate random point on a ring
     Geom.randomPointOnRing = function( radius ) {
    
        var randomAngle = Math.random() * (Math.PI * 2);
        return this.getPointOnRing(randomAngle, radius);
    
    }
    
    //Generate point on a ring
    Geom.getPointOnRing = function( angle, radius ) {
    
        var newX = radius*Math.cos(angle);
        var newY = radius*Math.sin(angle);
        return [newX,newY];
    
    }

    return Geom;
    
});