"use strict";

var canvas;
var gl;


var index = 0;

var cylinderArray = [];
var indexData = [];

var near = -10;
var far = 10;
var radius = 1.0;
var theta  = 0.5;
var phi    = 0.4;

var left = -4.0;
var right = 2.0;
var ytop = 2.0;
var bottom = -2.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var indexBuffer;

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    //var degAngle = 0;
    var facets = 30;
    var deltaAngle = Math.PI*2 / facets;
    var angle = 0;
    var height = 2;
    

    	cylinderArray.push(0.0);
    	cylinderArray.push(0.0);
    	cylinderArray.push(0.0);
    	
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
	    }
	    
	    cylinderArray.push(0.0);
	    cylinderArray.push(0.0);
	    cylinderArray.push(-2.0);

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
    
    
    console.log(cylinderArray);
    console.log(indexData);
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cylinderArray), gl.STATIC_DRAW);
    	
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vPosition);
    
    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
    //indexBuffer.itemSize = 1;
    //indexBuffer.numItems = indexData.length;

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    
    render();
}


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    gl.drawElements(gl.LINE_LOOP, indexData.length, gl.UNSIGNED_SHORT, 0);

    //gl.drawArrays(gl.LINE_LOOP, 0, cylinderArray.length/3);
    
    window.requestAnimFrame(render);


}