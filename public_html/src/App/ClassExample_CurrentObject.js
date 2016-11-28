/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global ClassExample, SquareRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


ClassExample.prototype.update = function () 
{
    var i;
    for (i=0; i<this.mAllObjects.length; i++)
        this.mAllObjects[i].update();
};

ClassExample.prototype.currentObject = function () {
    return this.mCurrentObject;
};

ClassExample.prototype.selectedXform = function()
{
    return this.mSelectedXform;
};

ClassExample.prototype.defineCenter = function (x, y) {
    
    this.mCurrentObject = new ArmSegment(this.vmUseShader, "newShape", 0, 0);
    this.mAllObjects[0].addAsChild(this.mCurrentObject);
    var xf = this.mCurrentObject.getXform();
    xf.setPosition(x, y);
    xf.setDestination(x, y);
    xf.setSize(2, 2);
    
    if (this.mCurrentObject.setFileTexture !== undefined)
        this.mCurrentObject.setFileTexture(this.mFileTexture);
};

// from center to current position is 1/2 of width
ClassExample.prototype.defineWidth = function (x, y) {
    var xf = this.mCurrentObject.getXform();
    var dx = Math.abs(x - xf.getXPos());
    var dy = Math.abs(y - xf.getYPos());
    xf.setSize(dx*2, dy*2);
};

// Called when a shape is finalized
// Update every object's destination
ClassExample.prototype.defined = function () 
{    
    // Update "every" lists' children destinations
    this.mAllObjects[0].updateListPos();
};

ClassExample.prototype.setConstShader = function() {
    this.vmUseShader = this.mConstColorShader;
};

ClassExample.prototype.setVertexColorShader = function() {
    this.vmUseShader = this.mVertexColorShader;
};

ClassExample.prototype.setFileTextureShader = function() {
    this.vmUseShader = this.mFileTextureShader;
};

ClassExample.prototype.newFileTexture = function(file, isURL) {
    this.mFileTexture = new FileTextureSupport(file, isURL);
    if (this.mCurrentObject.setFileTexture !== undefined)
        this.mCurrentObject.setFileTexture(this.mFileTexture);
};