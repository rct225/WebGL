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

    var p1 = vec3(1,1,1);
    var p2 = vec3(1,1,-60);
    var A = vec3(10,0,0);
    var B = vec3(0,10,0);
    var r1 = 10;
    var r2 = 20;
    var facets = 30;
    
    for (var i = 0; i < facets ; i++) {
    	var theta1 = 0.21;
    	var theta2 = 0.42;
    	
    	theta = theta1 + i * (theta2 - theta1) / facets;
    	var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        var nx = cosTheta * A[0] + sinTheta * B[0];
        var ny = cosTheta * A[1] + sinTheta * B[1];
        var nz = cosTheta * A[2] + sinTheta * B[2];
        
        var x = p1[0] + r1 * nx;
        var y = p1[1] + r1 * ny;
        var z = p1[2] + r1 * nz;
        cylinderArray.push(x);
        cylinderArray.push(y);
        cylinderArray.push(z);
        cylinderArray.push(1);

        x = p2[0] + r2 * nx;
        y = p2[0] + r2 * ny;
        z = p2[0] + r2 * nz;
        cylinderArray.push(x);
        cylinderArray.push(y);
        cylinderArray.push(z);
        cylinderArray.push(1);        
        
    }
    
    for (var i = 0; i < facets ; i++) {
    	indexData.push(i);
    	indexData.push(i+1);
    	indexData.push(i+2);
    	
    	indexData.push(i);
    	indexData.push(i+2);
    	indexData.push(i+3);
    }
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(cylinderArray), gl.STATIC_DRAW);
    	
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