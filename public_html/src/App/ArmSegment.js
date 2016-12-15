/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ArmSegment(shader, name, xPivot, yPivot, texture, highlightShader) 
{
    SceneNode.call(this, shader, name, false);   // calling super class constructor

    var xf = this.getXform();
    xf.setPivot(xPivot, yPivot);
    xf.setPosition(0, 0);
    
    this.texShader = shader;
    this.highShader = highlightShader;
    this.highlighted = false;
    this.curHighlightTime = 0;
    this.minHighlightTime = 16; // Arbitrary number
    
    // now create the children shapes
    var obj = new SquareRenderable(this.texShader);
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    obj.setFileTexture(texture);
    xf = obj.getXform();
    xf.setSize(1, 2);
    xf.setPosition(xPivot, yPivot);
};

gEngine.Core.inheritPrototype(ArmSegment, SceneNode);

ArmSegment.prototype.highlight = function () 
{
    this.mSet[0].setShader(this.highShader);
    this.highlighted = true;
};

ArmSegment.prototype.unhighlight = function () 
{
    this.mSet[0].setShader(this.texShader);
    this.highlighted = false;
};

ArmSegment.prototype.update = function () 
{
    SceneNode.prototype.update.call(this);
    
    var xf = this.getXform();
    
    // If at position, and min time, remove highlight
    if(xf.getXPos() === xf.getXDest() && xf.getYPos() === xf.getYDest()
            && this.curHighlightTime > this.minHighlightTime)
    {
        this.unhighlight();
        this.curHighlightTime = 0;
    }
    else if(this.highlighted)
    {
        this.curHighlightTime += this.movementSpeed;
    }
};