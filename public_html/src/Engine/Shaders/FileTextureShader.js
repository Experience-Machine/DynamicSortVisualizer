/* 
 * File: FileTextureShader.js
 *  
 */

/*jslint node: true, vars: true */
/*global gEngine: false, alert: false, XMLHttpRequest: false, alert: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

// constructor of SimpleShader object
function FileTextureShader(vertexShaderPath, fragmentShaderPath) {
    ColorVertexShader.call(this, vertexShaderPath, fragmentShaderPath);
    
    this.mShaderTextureCoordAttribute = null;
    this.mSamplerRef = null;

    var gl = gEngine.Core.getGL();
    this.mSamplerRef = gl.getUniformLocation(this.mCompiledShader, "uSampler");
    this.mShaderTextureCoordAttribute = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate");
}
// get all the prototype functions from SimpleShader
gEngine.Core.inheritPrototype(FileTextureShader, ColorVertexShader);

// Activate the shader for rendering
FileTextureShader.prototype.activateShader = function (buf, pixelColor, vpMatrix) {
    ColorVertexShader.prototype.activateShader.call(this, buf, pixelColor, vpMatrix);
        
    // now our own functionality: enable texture coordinate array
    var gl = gEngine.Core.getGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, gEngine.VertexBuffer.getGLTexCoordRef());
    gl.enableVertexAttribArray(this.mShaderTextureCoordAttribute);
    gl.vertexAttribPointer(this.mShaderTextureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(this.mSamplerRef, 0); // <-- binds to texture unit 0
};
