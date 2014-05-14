define([], function(){


    function Geom(){
				
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
        return getPointOnRing(randomAngle);
    
    }
    
    //Generate point on a ring
    Geom.getPointOnRing = function( angle, radius ) {
    
        var newX = radius*Math.cos(angle);
        var newY = radius*Math.sin(angle);
        return [newX,newY];
    
    }

    return Geom;
    
});