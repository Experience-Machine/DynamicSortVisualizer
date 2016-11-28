/* 
 * File: ColorVertexShader.js
 * 
 * Implements a Vertex Color Shader
 * 
 */

/*jslint node: true, vars: true */
/*global gEngine: false, alert: false, XMLHttpRequest: false, alert: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

// constructor of SimpleShader object
function ColorVertexShader(vertexShaderPath, fragmentShaderPath) {
    SimpleShader.call(this, vertexShaderPath, fragmentShaderPath);
    
    this.mColorBuffer = null;
    var vertexColors = [
        1.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];

    var gl = gEngine.Core.getGL();
    this.mColorBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.mColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.DYNAMIC_DRAW);
            // DYNAMIC_DRAW: says buffer content may change!    

    // get the reference of aTextureCoordinate within the shader
    var gl = gEngine.Core.getGL();
    this.mVertexColorAttribute = gl.getAttribLocation(this.mCompiledShader, "aVertexColorValue");
}
// get all the prototype functions from SimpleShader
gEngine.Core.inheritPrototype(ColorVertexShader, SimpleShader);

ColorVertexShader.prototype.setVertexColor = function (colors) {
    var gl = gEngine.Core.getGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mColorBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(colors));
};

// Activate the shader for rendering
ColorVertexShader.prototype.activateShader = function (buf, pixelColor, vpMatrix) {
    SimpleShader.prototype.activateShader.call(this, buf, pixelColor, vpMatrix);
    
    var gl = gEngine.Core.getGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mColorBuffer);
    gl.vertexAttribPointer(this.mVertexColorAttribute,
            4,
            gl.FLOAT,
            false,
            0,
            0);
    gl.enableVertexAttribArray(this.mVertexColorAttribute);
};
