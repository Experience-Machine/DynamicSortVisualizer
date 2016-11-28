/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ArmSegment(shader, name, xPivot, yPivot) 
{
    SceneNode.call(this, shader, name, true);   // calling super class constructor

    var xf = this.getXform();
    xf.setPivot(xPivot, yPivot);
    xf.setPosition(0, 0);
    
    // now create the children shapes
    var obj = new SquareRenderable(shader);  // The blue shirt
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(1, 2);
    xf.setPosition(xPivot, yPivot);
 
    // not sure if we want to keep this for something
 
    /*
    obj = new SquareRenderable(shader);  // The yellow face
    this.addToSet(obj);
    obj.setColor([1 , 1, 0, 1]);
    xf = obj.getXform();
    xf.setSize(1.3, 1.3); // so that we can see the connecting point
    xf.setPosition(xPivot, 1 + yPivot);
    
    obj = new SquareRenderable(shader); // The green leg (left)
    this.addToSet(obj);
    obj.setColor([0, 0, 1, 1]);
    xf = obj.getXform();
    xf.setSize(0.25, .5); // so that we can see the connecting point
    xf.setPosition(xPivot+0.375, yPivot - 1.25);
    
    obj = new SquareRenderable(shader); // The green leg (right)
    this.addToSet(obj);
    obj.setColor([0, 0, 1, 1]);
    xf = obj.getXform();
    xf.setSize(0.25, .5); // so that we can see the connecting point
    xf.setPosition(xPivot-0.375, yPivot - 1.25);
    
    obj = new SquareRenderable(shader); // The left red arm
    this.addToSet(obj);
    obj.setColor([0, 1, 0, 1]);
    xf = obj.getXform();
    xf.setSize(1, 0.5); // so that we can see the connecting point
    xf.setPosition(xPivot - .65, yPivot);
    
    obj = new SquareRenderable(shader); // The right red arm
    this.addToSet(obj);
    obj.setColor([0, 1, 0, 1]);
    xf = obj.getXform();
    xf.setSize(1, 0.5); // so that we can see the connecting point
    xf.setPosition(xPivot + .65, yPivot);
    
    obj = new SquareRenderable(shader); // left eye
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(.25, .25); // so that we can see the connecting point
    xf.setPosition(xPivot - .25, yPivot+1.25);
    
    obj = new SquareRenderable(shader); // right eye
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(.25, 0.25); // so that we can see the connecting point
    xf.setPosition(xPivot + .25, yPivot+1.25);
    
    obj = new SquareRenderable(shader); // left smile block
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(.15, 0.15); // so that we can see the connecting point
    xf.setPosition(xPivot - .25, yPivot+0.85);
    
    obj = new SquareRenderable(shader); // right smile block
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(.15, 0.15); // so that we can see the connecting point
    xf.setPosition(xPivot + .25, yPivot+0.85);
    
    obj = new SquareRenderable(shader); // bottom smile block
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(.45, 0.15); // so that we can see the connecting point
    xf.setPosition(xPivot, yPivot+0.75);
    
    this.mPulseRate = 0.005;
    this.mRotateRate = -10;
    */
}
gEngine.Core.inheritPrototype(ArmSegment, SceneNode);

ArmSegment.prototype.update = function () 
{
    SceneNode.prototype.update.call(this);
    
    /*
    var xf = this.getRenderableAt(4).getXform();
    xf.incRotationByDegree(-this.mRotateRate);
    
    var xf = this.getRenderableAt(5).getXform();
    xf.incRotationByDegree(this.mRotateRate);
    
    xf = this.getRenderableAt(6).getXform();
    xf.incSizeBy(this.mPulseRate);
    if (xf.getWidth() > 0.7 || xf.getWidth() < 0.4)
        this.mPulseRate = -this.mPulseRate;
    
    xf = this.getRenderableAt(7).getXform();
    xf.incSizeBy(this.mPulseRate);
    if (xf.getWidth() > 0.7 || xf.getWidth() < 0.4)
        this.mPulseRate = -this.mPulseRate;
    */
};