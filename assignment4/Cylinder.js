"use strict";

var cylinderArray = [];
var indexData = [];
var normalArray = [];

function Cylinder( radius, height ) {

    var facets = 30;
    var deltaAngle = Math.PI*2 / facets;
    var angle = 0;
    var height = height;
    var radius = radius;
    

    	cylinderArray.push(0.0);
    	cylinderArray.push(0.0);
    	cylinderArray.push(0.0);
    	normalArray.push(0.0);
    	normalArray.push(0.0);
    	normalArray.push(0.0);
    	
    	
	    for (var a=0; a < facets; a++) {
	        var alpha = angle + deltaAngle * a;
	        var sinAlpha = Math.sin(alpha);
	        var cosAlpha = Math.cos(alpha);
	        
	        var tx = radius * cosAlpha;
	        var ty = radius * sinAlpha;
	        var tz = 0.0;
	        cylinderArray.push(tx);
	        cylinderArray.push(ty);
	        cylinderArray.push(tz);
	        normalArray.push(sinAlpha);
	        normalArray.push(cosAlpha);
	        normalArray.push(tz);
	    }
	    
	    cylinderArray.push(0.0);
	    cylinderArray.push(0.0);
	    cylinderArray.push(-2.0);
	    normalArray.push(0.0);
	    normalArray.push(0.0);
	    normalArray.push(-2.0);

	    for (var b = 0; b < facets; b++ ) {
	        var alpha = angle + deltaAngle * b;
	        var sinAlpha = Math.sin(alpha);
	        var cosAlpha = Math.cos(alpha);
	        
	        var tx = radius * cosAlpha;
	        var ty = radius * sinAlpha;
	        var tz = -2.0;
	        cylinderArray.push(tx);
	        cylinderArray.push(ty);
	        cylinderArray.push(tz);
	        normalArray.push(sinAlpha);
	        normalArray.push(cosAlpha);
	        normalArray.push(tz);
	    }
    
	// bottom
    for (var ibx = 0; ibx < facets; ibx++) {
    	if (ibx === facets-1) {
    	    indexData.push(0);
    	    indexData.push(facets);
    	    indexData.push(1);
    	} else {
    		indexData.push(0);
    		indexData.push(ibx+1);
    		indexData.push(ibx+2);
    	}
    }
    
    // top 
    var skip = facets + 1; // skip over the sides in the bottom
    for (var itx = 0; itx < facets; itx++) {
    	if (itx === facets-1) {
    	    indexData.push(skip);
    	    indexData.push(facets + skip);
    	    indexData.push(1 + skip);
    	} else {
    		indexData.push(skip);
    		indexData.push(itx + 1 + skip);
    		indexData.push(itx + 2 + skip);
    
    	}
    }
    
    for (var tri = 1; tri <= facets ; tri++) {
    	if (tri === facets) {
    		indexData.push(tri);
    		indexData.push(1);
    		indexData.push(skip + 1);
    		
    		indexData.push(tri);
    		indexData.push(tri + skip);
    		indexData.push(skip + 1);
    	} else {
    		
    		indexData.push(tri); 
    		indexData.push(tri + 1);
    		indexData.push(tri + 1 + skip);
    		
    		indexData.push(tri);
    		indexData.push(tri + skip);
    		indexData.push(tri + 1 + skip);
    	}
    }	

    return {
    	v: cylinderArray,
    	i: indexData,
    	n: normalArray
    };

}


