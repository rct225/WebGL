"use strict";

var coneArray = [];
var indexData = [];
var normalArray = [];

function Cone( radius, height ) {

    //var degAngle = 0;
    var facets = 30;
    var deltaAngle = Math.PI*2 / facets;
    var angle = 0;
    var height = height;
    var radius = radius;
    

    	coneArray.push(0.0);
    	coneArray.push(0.0);
    	coneArray.push(0.0);
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
	        coneArray.push(tx);
	        coneArray.push(ty);
	        coneArray.push(tz);	
	        normalArray.push(cosAlpha);
	        normalArray.push(sinAlpha);
	        normalArray.push(tz);
	    }
	    
	    coneArray.push(0.0);
	    coneArray.push(0.0);
	    coneArray.push(-2.0);
	    normalArray.push(0.0);
	    normalArray.push(0.0);
	    normalArray.push(-1.0);
    
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
    
    // connect top point to bottom
    for (var itx = 0; itx <= facets; itx++) {
    	if (itx === facets) {
    	    indexData.push(facets+1);
    	    indexData.push(itx);
    	    indexData.push(1);
    	} else {
    		indexData.push(facets+1);
    		indexData.push(itx);
    		indexData.push(itx + 1);
    
    	}
    }
    
    return {
    	v: coneArray,
    	i: indexData,
    	n: normalArray
    };

}


