var canvas;
var gl;
var programId;

// Define two constants (by convention) for the number of subdivisions of u and v.
var SUBDIV_U = 50;
var SUBDIV_V = 50;

var lightPosition = vec4(1.0, 1.0, 10.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4(0.0, 0.0, 0.0, 1.0);
var materialDiffuse = vec4(1.0, 1.0, 0.0, 1.0);
var materialSpecular = vec4(0.6, 0.6, 0.5, 1.0);
var materialShininess = 50.0;

var ctm;
var ambientColor, diffuseColor, specularColor;

var texCoordsArray = [];

var texture;
var image, imgSource;
var flag = 0.0;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

// Binds "on-change" events for the controls on the web page
function initControlEvents() {
    // Use one event handler for all of the shape controls
    document.getElementById("superquadric-constant-n1").onchange =
    document.getElementById("superquadric-constant-n2").onchange =
    document.getElementById("superquadric-constant-a").onchange =
    document.getElementById("superquadric-constant-b").onchange =
    document.getElementById("superquadric-constant-c").onchange =
        function(e) {
            updateWireframe(superquadrics.superellipsoid, getSuperquadricConstants(), SUBDIV_U, SUBDIV_V);
        };

    // Event handler for the foreground color control
    document.getElementById("foreground-color").onchange =
        function(e) {
            updateWireframeColor(getWireframeColor());
        };

    // Event handler for the FOV control
    document.getElementById("fov").onchange =
        function(e) {
            updateProjection(perspective(getFOV(), 1, 0.01, 100));
        };
	//Event handler for surface material control
	document.getElementById("surface-material").onchange = 
		function (e) {
			imgSource = getImage();
			// yellow plastic
			if (imgSource == "yellow"){
				materialAmbient = vec4(0.0, 0.0, 0.0, 1.0);
				materialDiffuse = vec4(1.0, 1.0, 0.0, 1.0);
				materialSpecular = vec4(0.6, 0.6, 0.5, 1.0);
				materialShininess = 50.0;
				flag = 0.0;
			    gl.uniform1f( gl.getUniformLocation(programId,
			       "flag"), flag );
			   	ambientProduct = mult(lightAmbient, materialAmbient);
			    diffuseProduct = mult(lightDiffuse, materialDiffuse);
			    specularProduct = mult(lightSpecular, materialSpecular);

			   	gl.uniform4fv( gl.getUniformLocation(programId,
			       "ambientProduct"),flatten(ambientProduct) );
			    gl.uniform4fv( gl.getUniformLocation(programId,
			       "diffuseProduct"),flatten(diffuseProduct) );
			    gl.uniform4fv( gl.getUniformLocation(programId,
			       "specularProduct"),flatten(specularProduct) );
			}
			//brass metal
			else if (imgSource == "brass"){
				materialAmbient = vec4(0.2, 0.15, 0.1, 1.0);
				materialDiffuse = vec4(0.7, 0.4, 0.2, 1.0);
				materialSpecular = vec4(0.4, 0.3, 0.15, 1.0);
				materialShininess = 28.0;
				flag = 0.0;
			    gl.uniform1f( gl.getUniformLocation(programId,
			       "flag"), flag );
   			   	ambientProduct = mult(lightAmbient, materialAmbient);
   			    diffuseProduct = mult(lightDiffuse, materialDiffuse);
   			    specularProduct = mult(lightSpecular, materialSpecular);

   			   	gl.uniform4fv( gl.getUniformLocation(programId,
   			       "ambientProduct"),flatten(ambientProduct) );
   			    gl.uniform4fv( gl.getUniformLocation(programId,
   			       "diffuseProduct"),flatten(diffuseProduct) );
   			    gl.uniform4fv( gl.getUniformLocation(programId,
   			       "specularProduct"),flatten(specularProduct) );
			}
			// tile
			else if (imgSource == "tile") {
				materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
				materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
				materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
				materialShininess = 1.0;
				image = document.getElementById("tile-img");
				flag = 1.0;
			    gl.uniform1f( gl.getUniformLocation(programId,
			       "flag"), flag );
      			ambientProduct = mult(lightAmbient, materialAmbient);
      			diffuseProduct = mult(lightDiffuse, materialDiffuse);
      			specularProduct = mult(lightSpecular, materialSpecular);

      			gl.uniform4fv( gl.getUniformLocation(programId,
      			   "ambientProduct"),flatten(ambientProduct) );
      			gl.uniform4fv( gl.getUniformLocation(programId,
      			   "diffuseProduct"),flatten(diffuseProduct) );
      			gl.uniform4fv( gl.getUniformLocation(programId,
      			   "specularProduct"),flatten(specularProduct) );
				configureTexture(image);
			}
			// wood
			else if (imgSource == "wood"){
				materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
				materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
				materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
				materialShininess = 1.0;
				image = document.getElementById("wood-img");
				flag = 1.0;
			    gl.uniform1f( gl.getUniformLocation(programId,
			       "flag"), flag );
      			ambientProduct = mult(lightAmbient, materialAmbient);
      			diffuseProduct = mult(lightDiffuse, materialDiffuse);
      			specularProduct = mult(lightSpecular, materialSpecular);

      			gl.uniform4fv( gl.getUniformLocation(programId,
      			   "ambientProduct"),flatten(ambientProduct) );
      			gl.uniform4fv( gl.getUniformLocation(programId,
      			   "diffuseProduct"),flatten(diffuseProduct) );
      			gl.uniform4fv( gl.getUniformLocation(programId,
      			   "specularProduct"),flatten(specularProduct) );
				configureTexture(image);
			}
		}
}

// Function for querying the current superquadric constants: a, b, c, d, n1, n2
function getSuperquadricConstants() {
    return {
        a: parseFloat(document.getElementById("superquadric-constant-a").value),
        b: parseFloat(document.getElementById("superquadric-constant-b").value),
        c: parseFloat(document.getElementById("superquadric-constant-c").value),
        n1: parseFloat(document.getElementById("superquadric-constant-n1").value),
        n2: parseFloat(document.getElementById("superquadric-constant-n2").value)
    }
}

// Function for querying the current wireframe color
function getWireframeColor() {
    var hex = document.getElementById("foreground-color").value;
    var red = parseInt(hex.substring(1, 3), 16);
    var green = parseInt(hex.substring(3, 5), 16);
    var blue = parseInt(hex.substring(5, 7), 16);
    return vec3(red / 255.0, green / 255.0, blue / 255.0);
}

function getImage() {
	var img = document.getElementById("surface-material").value;
	return img;
	
}

// Function to map texture
function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    
    gl.uniform1i(gl.getUniformLocation(programId, "texture"), 0);
}

// Function for querying the current field of view
function getFOV() {
    return parseFloat(document.getElementById("fov").value);
}

window.onload = function() {
    // Find the canvas on the page
    canvas = document.getElementById("gl-canvas");

    // Initialize a WebGL context
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    // Load shaders
    programId = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(programId);

    // Set up events for the HTML controls
    initControlEvents();

    // Setup mouse and keyboard input
    initWindowEvents();

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Load the initial data into the GPU
    updateWireframe(superquadrics.superellipsoid, getSuperquadricConstants(), SUBDIV_U, SUBDIV_V);

    // Initialize the view and rotation matrices
    findShaderVariables();
    viewMatrix = lookAt(vec3(0,0,5), vec3(0,0,0), vec3(0,1,0));
    rotationMatrix = mat4(1);
    updateModelView(viewMatrix);

    // Initialize the projection matrix
    updateProjection(perspective(getFOV(), 1, 0.01, 100));

    // Initialize the wireframe color
    updateWireframeColor(getWireframeColor());

	// calculate lighting and material product
	ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	
	// pass variables to html file
	gl.uniform4fv( gl.getUniformLocation(programId,
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(programId,
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(programId,
       "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(programId,
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(programId,
       "shininess"),materialShininess );
    gl.uniform1f( gl.getUniformLocation(programId,
       "flag"), flag );

    // Start continuous rendering
    window.setInterval(render, 33);
};

// The current view matrix
var viewMatrix;

// The current rotation matrix produced as the result of cumulative mouse drags.
// I chose to implement the effect of mouse dragging as "rotating the object."
// It would also be acceptable to implement it as "moving the camera."
var rotationMatrix;

// The OpenGL ID of the vertex buffer containing the current shape
var wireframeBufferId;

// The number of vertices in the current vertex buffer
var wireframePointCount;

// Sets up keyboard and mouse events
function initWindowEvents() {

    // Affects how much the camera moves when the mouse is dragged.
    var sensitivity = 1;

    // Additional rotation caused by an active drag.
    var newRotationMatrix;

    // Whether or not the mouse button is currently being held down for a drag.
    var mousePressed = false;

    // The place where a mouse drag was started.
    var startX, startY;
	var lightX, lightY;
	
	var shift = false;

    canvas.onmousedown = function(e) {
        // A mouse drag started.
        mousePressed = true;

        // Remember where the mouse drag started.
        lightX = startX = e.clientX;
        lightY = startY = e.clientY;
    }

    canvas.onmousemove = function(e) {
		//regular rotation of image
        if (mousePressed && !shift) {
            // Handle a mouse drag by constructing an axis-angle rotation matrix
            var axis = vec3(e.clientY - startY, e.clientX - startX, 0.0);
            var angle = length(axis) * sensitivity;

            if (angle > 0.0) {
                // Update the temporary rotation matrix
                newRotationMatrix = mult(rotate(angle, axis), rotationMatrix);

                // Update the model-view matrix.
                updateModelView(mult(viewMatrix, newRotationMatrix));
            }
        }
		// moving of light position
		if (mousePressed && shift){
            var x = ((e.clientX-lightX) * 0.1);
            var y = ((lightY- e.clientY) * 0.1);
			updateLightPosition(x,y);
		}
		lightX = e.clientX;
		lightY = e.clientY;
    }

    window.onmouseup = function(e) {
        // A mouse drag ended.
        mousePressed = false;

        if (newRotationMatrix) {
            // "Lock" the temporary rotation as the current rotation matrix.
            rotationMatrix = newRotationMatrix;
        }
        newRotationMatrix = null;
    }

    var speed = 0.1; // Affects how fast the camera pans and "zooms"
	
	window.onkeyup = function(e){
		if (e.keyCode === 16) { // shift key is released
			shift = false;
		}
	}
	
    window.onkeydown = function(e) {
        if (e.keyCode === 190) { // '>' key
            // "Zoom" in
            viewMatrix = mult(translate(0,0,speed), viewMatrix);
        }
		else if (e.keyCode === 16){ // shift key is pressed
			shift = true;
		}
        else if (e.keyCode === 188) { // '<' key
            // "Zoom" out
            viewMatrix = mult(translate(0,0,-speed), viewMatrix);
        }
        else if (e.keyCode === 37) { // Left key
            // Pan left
            viewMatrix = mult(translate(speed,0,0), viewMatrix);

            // Prevent the page from scrolling, which is the default behavior for the arrow keys
            e.preventDefault();
        }
        else if (e.keyCode === 38) { // Up key
            // Pan up
            viewMatrix = mult(translate(0,-speed,0), viewMatrix);

            // Prevent the page from scrolling, which is the default behavior for the arrow keys
            e.preventDefault();
        }
        else if (e.keyCode === 39) { // Right key
            // Pan right
            viewMatrix = mult(translate(-speed,0,0), viewMatrix);

            // Prevent the page from scrolling, which is the default behavior for the arrow keys
            e.preventDefault();
        }
        else if (e.keyCode === 40) { // Down key
            // Pan down
            viewMatrix = mult(translate(0,speed,0), viewMatrix);

            // Prevent the page from scrolling, which is the default behavior for the arrow keys
            e.preventDefault();
        }

        // Update the model-view matrix and render.
        updateModelView(mult(viewMatrix, rotationMatrix));
        render();
    }
	
}

// Define the four possible superquadrics
var superquadrics = {
    superellipsoid: {
        evaluate: function(constants, u, v) {
            var cosU = Math.cos(u);
            var sinU = Math.sin(u);
            var cosV = Math.cos(v);
            var sinV = Math.sin(v);
            return vec3(
                constants.a * Math.sign(cosV * cosU) * Math.pow(Math.abs(cosV), 2 / constants.n1) *
                    Math.pow(Math.abs(cosU), 2 / constants.n2),
                constants.b * Math.sign(cosV * sinU) * Math.pow(Math.abs(cosV), 2 / constants.n1) *
                    Math.pow(Math.abs(sinU), 2/constants.n2),
                constants.c * Math.sign(sinV) * Math.pow(Math.abs(sinV), 2 / constants.n1)
            );
        },
        uMin: -Math.PI,
        uMax: Math.PI,
        vMin: -Math.PI / 2,
        vMax: Math.PI / 2
    }
}

//function for querying new position of light
function updateLightPosition(x, y){
	lightPosition[0] += x;
	lightPosition[1] += y;
	gl.uniform4fv( gl.getUniformLocation(programId, "lightPosition"),flatten(lightPosition) );
}


// Regenerates the superquadric vertex data.
// Only needs to be called when the intrinsic properties (n1, n2, a, b, c, d) of the superquadric change,
// or the type of superquadric itself changes.
function updateWireframe(superquadric, constants, subdivU, subdivV) {
    // Initialize an empty array of points
    var points = [];
    var normalsArray = [];

    // Determine how much u and v change with each segment
    var du = (superquadric.uMax - superquadric.uMin) / subdivU;
    var dv = (superquadric.vMax - superquadric.vMin) / subdivV;

    // Reset the vertex count to 0
    wireframePointCount = 0;

    // Loop over u and v, generating all the required line segments
    for (var i = 0; i < subdivU; i++) {
        for (var j = 0; j < subdivV; j++) {
            // Determine u and v
            var u = superquadric.uMin + i * du;
            var v = superquadric.vMin + j * dv;

            // p is the "current" point at surface coordinates (u,v)
            var p = superquadric.evaluate(constants, u, v);

            // pu is the point at surface coordinates (u+du, v)
            var pu = superquadric.evaluate(constants, u + du, v);

            // pv is the point at surface coordinates (u, v+dv)
            var pv = superquadric.evaluate(constants, u, v + dv);

            // pw is the point at surface coordinates (u + du, v + dv);
            var pw = superquadric.evaluate(constants, u + du, v + dv);

            // Verify that all the points actually used are not infinite or NaN
            // (Could be an issue for hyperboloids)
            if (isFinite(p[0]) && isFinite(p[1]) && isFinite(p[2])) {
                if (isFinite(pu[0]) && isFinite(pu[1]) && isFinite(pu[2])) {
                        // Add a line segment between p and pu
                        var a = subtract(pu, p);
                        var b = subtract(pv, p);
                        var normal = cross(a, b);
                        normal = vec3(normal);

                        points.push(p);
                        normalsArray.push(normal);
                        points.push(pu);
                        normalsArray.push(normal);
                        points.push(pv);
                        normalsArray.push(normal);
						texCoordsArray.push(texCoords(superquadric, u, v));
						texCoordsArray.push(texCoords(superquadric, u+du, v));
						texCoordsArray.push(texCoords(superquadric, u, v+dv));
						

                        wireframePointCount += 3;
                    }
                     if (isFinite(pv[0]) && isFinite(pv[1]) && isFinite(pv[2])) {
                         // Add a line segment between p and pv
                         var a = subtract(pw,pu);
                         var b = subtract(pv,pu);
                         var normal = cross(a,b);
                         normal = vec3(normal);

                         points.push(pu);
                         normalsArray.push(normal);
                         points.push(pw);
                         normalsArray.push(normal);
                         points.push(pv);
                         normalsArray.push(normal);
						 texCoordsArray.push(texCoords(superquadric, u+du, v));
						 texCoordsArray.push(texCoords(superquadric, u+du, v+dv));
						 texCoordsArray.push(texCoords(superquadric, u, v+dv));

                         wireframePointCount += 3;
                     }

            }
            v += dv;
        }
        v = superquadric.vMax;
        u += du;
    }

    // Pass the new set of vertices to the graphics card
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( programId, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( programId, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
	
	var tBuffer = gl.createBuffer();
  	gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
 	gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

	var vTexCoord = gl.getAttribLocation( programId, "vTexCoord" );
  	gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vTexCoord );
	
	if (flag == 1.0){
		configureTexture(image);
	}
}


// The locations of the required GLSL uniform variables.
var locations = {};

// Looks up the locations of uniform variables once.
function findShaderVariables() {
    locations.modelView = gl.getUniformLocation(programId, "modelView");
    locations.projection = gl.getUniformLocation(programId, "projection");
    locations.wireframeColor = gl.getUniformLocation(programId, "wireframeColor");
}

// Pass an updated model-view matrix to the graphics card.
function updateModelView(modelView) {
    gl.uniformMatrix4fv(locations.modelView, false, flatten(modelView));
}

// Pass an updated projection matrix to the graphics card.
function updateProjection(projection) {
    gl.uniformMatrix4fv(locations.projection, false, flatten(projection));
}

// Pass an updated projection matrix to the graphics card.
function updateWireframeColor(wireframeColor) {
    gl.uniform3fv(locations.wireframeColor, wireframeColor);
}

function texCoords(superquadric, u, v) {
    //variables we need
    var tu, tv;

    // Map vertex u and v values to texture coordinates [0, 1]
    var tu = (u - superquadric.uMin) / (superquadric.uMax - superquadric.uMin);
    var tv = (v - superquadric.vMin) / (superquadric.vMax - superquadric.vMin);

    //Smooth texture repeat
    tu = Math.abs(2 * tu-1);
    tv = Math.abs(2 * tv-1);

    //return coordinates as tuple
    return [tu, tv];
}

// Render the scene
function render() {
    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw the wireframe using gl.LINES
    gl.drawArrays(gl.TRIANGLES, 0, wireframePointCount);
}
