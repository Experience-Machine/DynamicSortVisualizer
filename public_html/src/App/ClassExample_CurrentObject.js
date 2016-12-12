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
    for (i=0; i<this.mLists.length; i++)
        this.mLists[i].update();
};

ClassExample.prototype.currentObject = function () {
    return this.mCurrentObject;
};

ClassExample.prototype.selectedXform = function()
{
    return this.mSelectedXform;
};

ClassExample.prototype.defineCenter = function (x, y) {
    
    this.mCurrentObject = new ArmSegment(this.mFileTextureShader, "newShape", 0, 0, this.mFileTexture, this.mHighlightTextureShader);
    this.mLists[this.mActiveList].addAsChild(this.mCurrentObject);
    var parentXf = this.mLists[this.mActiveList].getXform();
    var xf = this.mCurrentObject.getXform();
    xf.setPosition(x - parentXf.getXPos(), y - parentXf.getYPos());
    xf.setDestination(x - parentXf.getXPos(), y - parentXf.getYPos());
    xf.setSize(2, 2);
    this.mCurrentObject.changeMovementSpeed(this.moveSpeed);
    
    if (this.mCurrentObject.setFileTexture !== undefined)
        this.mCurrentObject.setFileTexture(this.mFileTexture);
};

// from center to current position is 1/2 of width
ClassExample.prototype.defineWidth = function (x, y) 
{
    var listXf = this.mLists[this.mActiveList].getXform();
    var xf = this.mCurrentObject.getXform();
    var dx = Math.abs(x - (xf.getXPos() + listXf.getXPos()) );
    var dy = Math.abs(y - (xf.getYPos() + listXf.getYPos()) );
    
    /*
    console.log("WIDTH: ");
    console.log("\tX: " + x);
    console.log("\tY: " + y);
    console.log("\txPos: " + xf.getXPos());
    console.log("\tyPos: " + xf.getYPos());
    console.log("\tListXPos: " + listXf.getXPos());
    console.log("\tListYPos: " + listXf.getYPos());
    console.log("\tDX: " + dx);
    console.log("\tDY: " + dy);
    */
   
    xf.setSize(dx*2, dy*2);
};

// Called when a shape is finalized or moved
// Update every object's destination
ClassExample.prototype.defined = function () 
{    
    // Determine "every" lists' children indicies
    var i;
    for (i=0; i<this.mLists.length; i++)
        this.mLists[i].determineIndices();
    
    // Vertical Positions
    // Update every lists' destination
    this.updateVertListDests();
    
    // Horizontal Positions
    // Update "every" lists' children destinations
    for (i=0; i<this.mLists.length; i++)
        this.mLists[i].updateListPos();
};

// This belongs in ListObject (is here for merge errors)
ClassExample.prototype.updateVertListDests = function() 
{
    var listHeights = [];
    var totalHeight = 0;
    var i = 0;
    for (i=0; i<this.mLists.length; i++)
    {
        var thisHeight = this.getListMaxHeight(this.mLists[i]);
        listHeights.push(thisHeight);
        totalHeight += thisHeight;
    }

    // Update first list first
    i = 0;
    var xf = this.mLists[i].getXform();
    var xPos = 0; // Arbitrary line
    var yPos = -10 + listHeights[i]; // Could be better
    
    xf.setDestination(xPos, yPos);
    var lastPosition = yPos;
    lastPosition += listHeights[i];

    // Update the rest of the objects
    for (i=1; i < listHeights.length; i++)
    {
        xf = this.mLists[i].getXform();
        yPos = lastPosition + listHeights[i];
        xf.setDestination(xPos, yPos);
        lastPosition = yPos + listHeights[i];
    }
};

// This also belongs in ListObject
ClassExample.prototype.getListMaxHeight = function(list)
{
    var maxHeight = 0;
    for (var i=0; i<list.mChildren.length; i++)
    {
        if(list.mChildren[i].getXform().getHeight() > maxHeight)
        {
            maxHeight = list.mChildren[i].getXform().getHeight();
        }
    }
    return maxHeight;
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