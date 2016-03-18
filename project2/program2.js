var canvas;
var gl;
var program;

var nRows = 50;
var nColumns = 50;
var a = 1.0;
var b = 1.0;
var c = 1.0;
var n1 = 2.0;
var n2 = 2.0;

var vMin = -Math.PI/2;
var vMax = Math.PI/2
var uMin = -Math.PI;
var uMax = Math.PI;
var du = (uMax - uMin)/(nRows-2);
var dv = (vMax - vMin)/(nColumns-2);
var data = [];
var v = vMin;
var u = uMin;


var Wireframe_color;
var pointsArray = [];

var fColor;

var near = 1;
var far = 100;
var radius = 6.0;
var theta  = 0;
var phi    = 0;
var dr = 5.0 * Math.PI/180.0;
var aspect;
var fov = 45;

var black = vec4(0.0, 0.0, 0.0, 1.0);
const white = vec4(1.0, 1.0, 1.0, 1.0);

var camera = vec3(0.0, 0.0, 0.0);
const at = vec3(0.0, 0.0, 0.0);
var eye = vec3( radius*Math.sin(theta)*Math.cos(phi), 
                    radius*Math.sin(theta)*Math.sin(phi),
                    radius*Math.cos(theta));
var up = vec3(0.0, 1.0, 0.0);
var left = -2.0;
var right = 2.0;
var ytop = 2.0;
var bottom = -2.0;
var size = 1.0;

var modelViewMatrix = lookAt(eye, at, up);
var projectionMatrix  = ortho( left, right, bottom, ytop, near, far );
var rotationMatrix;
var modelViewMatrixLoc, projectionMatrixLoc, rotationMatrixLoc;

// Binds "on-change" events for the controls on the web page
function initControlEvents() {
	
	//change n1
    document.getElementById("superquadric-constant-n1").onchange = 
        function(e) {
			var getConstants = getSuperquadricConstants();
			n1 = getConstants.n1;
        };
	//change n2
    document.getElementById("superquadric-constant-n2").onchange = 
        function(e) {
			var getConstants = getSuperquadricConstants();
			n2 = getConstants.n2;
        };    
	//change a
    document.getElementById("superquadric-constant-a").onchange = 
        function(e) {
			var getConstants = getSuperquadricConstants();
			a = getConstants.a;
        };
	//change b
    document.getElementById("superquadric-constant-b").onchange = 
        function(e) {
			var getConstants = getSuperquadricConstants();
			b = getConstants.b;
        };
	//change c
    document.getElementById("superquadric-constant-c").onchange = 
        function(e) {
			var getConstants = getSuperquadricConstants();
			c = getConstants.c;
        };
	//change wireframe color
    document.getElementById("foreground-color").onchange = 
        function(e) {
			black = getWireframeColor();
        };
	// change FOV
	document.getElementById("fov").onchange =
		function(e){
			var getConstants = getSuperquadricConstants();
			fov = parseFloat(document.getElementById("fov").value);
			//projectionMatrix = perspective(fov, aspect, near, far);
		};
	//maps keys as a dictionary, first sets everything to false	
	var map = {190: false, 16: false, 188: false, 37: false, 38: false, 39: false, 40: false}; 
		/*The following functions are for when multiple keys are pressed
		     * We are seeing whether or not certain combinations are pressed
		     */
	window.onkeydown = function (e) {
		console.log(e.keyCode);
			if(e.keyCode in map){
				map[e.keyCode] = true;
			
				//Shift + >
				if(map[190]){
					size += 0.2;
				}
			
				//Shift + <
				if(map[188]){
					size -= 0.2;
				}
				//Left arrow
				if(map[37]){
					camera[0] += 0.2;
				}
				//up arrow
				if(map[38]){
					camera[1] -= 0.2;
				}
				//right arrow
				if(map[39]){
					camera[0] -= 0.2;
				}
				//down arrow
				if(map[40]){
					camera[1] += 0.2;
				}
			
			} 
		};
			
		//Restores everything to false once it is released
		window.onkeyup = function(e){
			if(e.keyCode in map){
				map[e.keyCode] = false;
			}
		}	
		
		//rotate on mouse click and drag
		var mouseDown = false;
		var yPos;
		var xPos;
		var rotationX, rotationY, rotationZ, rotationMatrix;
	   	canvas.onmousedown = function (e) { 
			mouseDown = true;
			yPos = e.clientY; 
			xPos = e.clientX;
		};
		canvas.onmouseup = function (e)  { mouseDown = false };
		canvas.onmousemove = function(e) { 
				
		if (mouseDown) {
			
			//calculate theta and phi according to position of mouse			
			theta += (e.clientX-xPos)*360 / 512;
			phi += (e.clientY-yPos)*360 / 512;
			yPos = e.clientY;
			xPos = e.clientX; 
		}
							
	};
			
}

// Function for querying the current superquadric constants: a, b, c, d, n1, n2
function getSuperquadricConstants() {
    return {
        n1: parseFloat(document.getElementById("superquadric-constant-n1").value),
        n2: parseFloat(document.getElementById("superquadric-constant-n2").value),
        a: parseFloat(document.getElementById("superquadric-constant-a").value),
		b: parseFloat(document.getElementById("superquadric-constant-b").value),
		c: parseFloat(document.getElementById("superquadric-constant-c").value),
		fov: parseFloat(document.getElementById("fov").value)
    }
}

// Function for querying the current wireframe color
function getWireframeColor() {
    var hex = document.getElementById("foreground-color").value;
    var red = parseInt(hex.substring(1, 3), 16);
    var green = parseInt(hex.substring(3, 5), 16);
    var blue = parseInt(hex.substring(5, 7), 16);
    return vec4(red / 255.0, green / 255.0, blue / 255.0, 1.0);
}

window.onload = function() {
    // Find the canvas on the page
    canvas = document.getElementById("gl-canvas");
    
    // Initialize a WebGL context
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { 
        alert("WebGL isn't available"); 
    }
   
	// enable depth testing and polygon offset
	// so lines will be in front of filled triangles
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);
   
   	aspect =  canvas.width/canvas.height;
	
	// initialize shaders
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
	
    fColor = gl.getUniformLocation(program, "fColor");
 
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
			
	// Set up events for the HTML controls
	initControlEvents();
	black = getWireframeColor();
	
	render();
}

///////////////////////////////////////////////////////////
// TODO: Put other global variables and functions here.
///////////////////////////////////////////////////////////

//function scale that takes three parameters of x, y, z
function scale( x, y, z ){
    if ( Array.isArray(x) && x.length == 3 ) {
        z = x[2];
        y = x[1];
        x = x[0];
    }

    var result = mat4();
    result[0][0] = x;
    result[1][1] = y;
    result[2][2] = z;

    return result;

}

//data is store is an array and the buffer
function getData()
{
	//Clear out buffer
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.ARRAY_BIUFFER);
	data = [];
	pointsArray = [];
	//make image and store in data
	for( var i = 0; i < nRows; ++i ) {
	    data.push( [] );
	    for( var j = 0; j < nColumns; ++j ) {
		    var x = a*Math.sign(Math.cos(v))*Math.pow(Math.abs(Math.cos(v)), 2/n1)*Math.sign(Math.cos(u))*Math.pow(Math.abs(Math.cos(u)), 2/n2);
			var y = b*Math.sign(Math.cos(v))*Math.pow(Math.abs(Math.cos(v)), 2/n1)*Math.sign(Math.sin(u))*Math.pow(Math.abs(Math.sin(u)), 2/n2);
			var z = c*Math.sign(Math.sin(v))*Math.pow(Math.abs(Math.sin(v)), 2/n1);
	    	data[i][j] = vec4(x, y, z, 1.0);		
			u = uMin + du*i;
			v = vMin + dv*j;
		}
	}
	
	//push to pointsArray
	for(var i = 0; i<nRows-1; i++) {
		for(var j=0; j<nColumns-1;j++) {
            pointsArray.push( data[i][j] );
			pointsArray.push( data[i+1][j] );
			pointsArray.push( data[i+1][j+1] );
			pointsArray.push( data[i][j+1]);
		}
	}
	
	//add to buffer
    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
	
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
 
	
}

//render process
function render()
{
	
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
	getData();

	eye = vec3 (camera[0], camera[1], radius+camera[2]);
	
	var worldMatrix = mult(mult(rotate(phi, 1, 0, 0), rotate(theta, 0, 1, 0)), scale(size, size, size));
	modelViewMatrix = mult(lookAt(eye, camera, up), worldMatrix);
	projectionMatrix = perspective(fov, aspect, near, far);

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
	
    // draw each quad as two filled red triangles
    // and then as two black line loops
    for(var i=0; i<pointsArray.length; i+=4) { 
        gl.uniform4fv(fColor, flatten(white));
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );
        gl.uniform4fv(fColor, flatten(black));
        gl.drawArrays( gl.LINE_LOOP, i, 4 );
    }
    

    requestAnimFrame(render);
}

