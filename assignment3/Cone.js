function Cone() {

	var facets = 30;
	
	var r1 = 1;
	var r2 = 2;
	
    var vertexPositionData = [];
    
    var p2 = vec3(0,0,0);
    var p1 = vec3(0,0,1);
    
    var n = subtract(p2, p1);
    
    var B = n;
    if (n[0] == 0 && n[2] == 0) {
    	B[0] += 1;
    } else {
    	B[1] += 1;
    }
    
    var A = cross(B, n);
    var B = cross(n, A);
    
    B = normalize(B);
    A = normalize(A);
    
    var normalData = [];
    var textureCoordData = [];
    
    for (var i = 0; i < facets ; i++) {
    	n = 0;
    	var theta1 = i * 2 * Math.PI / n;
    	var theta2 = (i+1) * 2 * Math.PI / n;
    	var sinTheta1 = Math.sin(theta1);
        var cosTheta1 = Math.cos(theta1);
        var sinTheta2 = Math.sin(theta2);
        var cosTheta2 = Math.cos(theta2);
        
        var x = p1[0] + r1 * cosTheta1 * A[0] + r1 * sinTheta1 * B[0];
        var y = p1[1] + r1 * cosTheta1 * A[1] + r1 * sinTheta1 * B[1];
        var z = p1[2] + r1 * cosTheta1 * A[2] + r1 * sinTheta1 * B[2];
        vertexPositionData.push(x)
        vertexPositionData.push(y)
        vertexPositionData.push(z)
        
        x = p2[0] + r2 * cosTheta1 * A[0] + r2 * sinTheta1 * B[0];
        y = p2[1] + r2 * cosTheta1 * A[1] + r2 * sinTheta1 * B[1];
        z = p2[2] + r2 * cosTheta1 * A[2] + r2 * sinTheta1 * B[2];
        vertexPositionData.push(x)
        vertexPositionData.push(y)
        vertexPositionData.push(z)
        
        if (r2 != 0) {
        	x = p2[0] + r2 * cosTheta2 * A[0] + r2 * sinTheta2 * B[0];
        	y = p2[1] + r2 * cosTheta2 * A[1] + r2 * sinTheta2 * B[1];
        	z = p2[2] + r2 * cosTheta2 * A[2] + r2 * sinTheta2 * B[2];
            vertexPositionData.push(x)
            vertexPositionData.push(y)
            vertexPositionData.push(z)
        }
        if (r1 != 0 ) {
        	x = p1[0] + r1 * cosTheta2 * A[0] + r1 * sinTheta2 * B[0];
        	y = p1[1] + r1 * cosTheta2 * A[1] + r1 * sinTheta2 * B[1];
        	z = p1[2] + r1 * cosTheta2 * A[2] + r1 * sinTheta2 * B[2];
            vertexPositionData.push(x)
            vertexPositionData.push(y)
            vertexPositionData.push(z)
        }
        
        
    }
    
    var indexData = [];
    for (var i = 0; i < facets ; i++) {
    	indexData.push(i)
    	indexData.push(i+1)
    	indexData.push(i+2)
    	
    	indexData.push(i)
    	indexData.push(i+2)
    	indexData.push(i+3)
    }
    
    return {
    	v: vertexPositionData,
    	n: normalData,
    	t: textureCoordData,
    	i: indexData
    }
}
