/*
 * File: FileTextureSupport.js
 *  
 */
/*jslint node: true, vars: true */
/*global gEngine, Renderable */
/* find out more about jslint: http://www.jslint.com/help.html */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function FileTextureSupport(file, isURL) {
    this.mTexID= -1; // web-gl's texture resource 
    
    // shader must be a FileTextureShader
    // file: is eihter loaded from <input type="file">
    //        or a file path from the server
    this.mMyImage = new Image();
    
    if (isURL) {  // must load the image
        this.mMyImage.onload = (function() {
            this.processLoadedImage();
        }).bind(this);
        this.mMyImage.src = file; // this is a path on the server
    } else {
        this.mMyImage.src = file;
        this.processLoadedImage(); // image already loaded
    }
}

FileTextureSupport.prototype.processLoadedImage = function () {
    var gl = gEngine.Core.getGL();

    // Generate a texture reference to the webGL context
    this.mTexID = gl.createTexture();

    // bind the texture reference with the current texture functionality in the webGL
    gl.bindTexture(gl.TEXTURE_2D, this.mTexID);

    // Load the texture into the texture data structure with descriptive info.
    // Parameters:
    //  1: Which "binding point" or target the texture is being loaded to.
    //  2: Level of detail. Used for mipmapping. 0 is base texture level.
    //  3: Internal format. The composition of each element. i.e. pixels.
    //  4: Format of texel data. Must match internal format.
    //  5: The data type of the texel data.
    //  6: Texture Data.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.mMyImage);

    // Creates a mipmap for this texture.
    gl.generateMipmap(gl.TEXTURE_2D);

    // Tells WebGL that we are done manipulating data at the mGL.TEXTURE_2D target.
    gl.bindTexture(gl.TEXTURE_2D, null);

};

FileTextureSupport.prototype.activateFileTexture = function() {
    if (this.mTexID === -1)
        return;
    
    var gl = gEngine.Core.getGL();

    // Binds our texture reference to the current webGL texture functionality
    gl.activeTexture(gl.TEXTURE0); // <-- this is hard coded to webgl-unit0
    gl.bindTexture(gl.TEXTURE_2D, this.mTexID);

    // To prevent texture wrappings
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Handles how magnification and minimization filters will work.
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    // For pixel-graphics where you want the texture to look "sharp" do the following:
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
};


// The get/set color, and getXform funcitons are inherited