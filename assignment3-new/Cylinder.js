"use strict";

var canvas;
var gl;


var index = 0;

var cylinderArray = [];
var indexData = [];

var near = -10;
var far = 10;
var radius = 2.0;
var theta  = 0.0;
var phi    = 0.0;

var left = -2.0;
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

    var degAngle = 90;
    var facets = 360 / degAngle;
    var angle = radians(degAngle);
    var height = 2;
    
    console.log(facets);
    
    for (var h = 0; h <= height; h += height) {
    	var cylPts = vec4(0,0,h,1);

    	cylinderArray.push(cylPts);
	    
    	cylPts = vec4(radius, 0, h, 1);
	    cylinderArray.push(cylPts);
	    
	    for (var n=1; n <= facets; n++) {
	        var alpha = n * angle;
	        var sinAlpha = Math.sin(alpha);
	        var cosAlpha = Math.cos(alpha);
	        
	        var tx = radius * cosAlpha;
	        var ty = radius * sinAlpha;
	        var tz = h;
	        var ta = 1;
	        cylPts = vec4(tx, ty, tz, ta)
	        cylinderArray.push(cylPts);
	
	    }
    
    }
    
    for (var ix = 1; ix < facets; ix++) {
    	indexBuffer.push(0);
    	indexBuffer.push(ix)
    	indexBuffer.push(ix+1)
    }
    
    indexBuffer.push(0);
    indexBuffer.push(facets);
    indexBuffer.push(1);
    
    for (var ix = facets + 2; ix <= 2 * facets; ix++) {
    	indexBuffer.push(facets + 1);
    	indexBuffer.push(ix)
    	indexBuffer.push(ix + 1)
    }
   
    indexBuffer.push(facets + 1);
    indexBuffer.push(2*facets + 1);
    indexBuffer.push(facets + 2);

    indexBuffer.push(1);
    indexBuffer.push(2);
    indexBuffer.push(facets+2);
    
    var tri = 0;
    for (tri = 1; tri < facets - 1 ; tri++){
    	indexBuffer.push(tri+1); 
    	indexBuffer.push(facets + tri + 1);
    	indexBuffer.push(facets + tri + 2);
    	indexBuffer.push(tri+1);
    	indexBuffer.push(tri+2);
    	indexBuffer.push(facets + tri + 2);
    }
    
    indexBuffer.push(tri+1);
    indexBuffer.push(facets + tri + 1);
    indexBuffer.push(facets + tri + 2);
    
    indexBuffer.push(tri+1);
    indexBuffer.push(1);
    indexBuffer.push(facets + tri + 2);
    
    indexBuffer.push(1);
    indexBuffer.push(facets + tri + 2);
    indexBuffer.push(facets+2);
    
    
    console.log(cylinderArray);
    console.log(indexBuffer);
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cylinderArray), gl.STATIC_DRAW);
    	
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vPosition);
    
    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
    indexBuffer.itemSize = 1;
    indexBuffer.numItems = indexData.length;

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

    gl.drawElements(gl.LINE_LOOP, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    window.requestAnimFrame(render);


}