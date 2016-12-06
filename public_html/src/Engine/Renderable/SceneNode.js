/* File: SceneNode.js 
 *
 * Support for grouping of Renderables with custom pivot ability
 */

/*jslint node: true, vars: true */
/*global PivotedTransform, SquareRenderable  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


function SceneNode(shader, name, drawPivot) {
    this.mName = name;
    this.mSet = [];
    this.mChildren = [];
    this.mXform = new PivotedTransform();

    // this is for debugging only: for drawing the pivot position
    this.mPivotPos = null;
    if ((drawPivot !== undefined) && (drawPivot === true)) {
        this.mPivotPos = new SquareRenderable(shader);
        this.mPivotPos.setColor([1, 0, 0, 1]); // default color
        var xf = this.mPivotPos.getXform();
        xf.setSize(0.2, 0.2); // always this size
    }
}
SceneNode.prototype.setName = function (n) { this.mName = n; };
SceneNode.prototype.getName = function () { return this.mName; };

SceneNode.prototype.getXform = function () { return this.mXform; };

SceneNode.prototype.size = function () { return this.mSet.length; };

SceneNode.prototype.containsPoint = function(x, y)
{
    // If we have any renderables..
    if(this.mSet.length > 0)
    {
        //console.log("Mouse XY: " + x + ", " + y + "\tSN XY: " + this.getXform().getXPos() + ", " + this.getXform().getYPos());
        // For each renderable..
        for(var i = 0; i < this.mSet.length; i++)
        {
            // Get the true x/y pos, with respect to this SN
            var xf = this.mSet[i].getXform();
            var xPos = this.getXform().getXPos() + xf.getXPos() * this.getXform().getWidth();
            var yPos = this.getXform().getYPos() + xf.getYPos() * this.getXform().getHeight();
            var xfWidth = this.getXform().getWidth()*xf.getWidth();
            var xfHeight = this.getXform().getHeight()*xf.getHeight();
            
            //console.log("\tObj[" + i + "]: " + xPos + ", " + yPos);
            
            // If they're in our bounding box
            if(Math.abs(x - xPos) < xfWidth / 2 &&
                Math.abs(y - yPos) < xfHeight / 2)
            {
                return true;
            }
        }
    }
    else
    {
        var xf = this.getXform();
        if(Math.abs(x - xf.getXPos()) < xf.getWidth() / 5 &&
           Math.abs(y - xf.getYPos()) < xf.getHeight() / 5)
        {
            return true;
        }
    }
    return false;
};

SceneNode.prototype.containsPointOffset = function(x, y, offsetXform)
{    
    // If we have any renderables..
    if(this.mSet.length > 0)
    {
        //console.log("Mouse XY: " + x + ", " + y + "\tSN XY: " + this.getXform().getXPos() + ", " + this.getXform().getYPos());
        // For each renderable..
        for(var i = 0; i < this.mSet.length; i++)
        {
            // Get the true x/y pos, with respect to this SN
            var xf = this.mSet[i].getXform();
            var xPos = (this.getXform().getXPos() + xf.getXPos() * this.getXform().getWidth())*offsetXform.getWidth() + offsetXform.getXPos();
            var yPos = (this.getXform().getYPos() + xf.getYPos() * this.getXform().getHeight())*offsetXform.getHeight() + offsetXform.getYPos();
            var xfWidth = this.getXform().getWidth()*xf.getWidth()*offsetXform.getWidth();
            var xfHeight = this.getXform().getHeight()*xf.getHeight()*offsetXform.getHeight();
            
            //console.log("\tObj[" + i + "]: " + xPos + ", " + yPos);
            
            // If they're in our bounding box
            if(Math.abs(x - xPos) < xfWidth / 2 &&
                Math.abs(y - yPos) < xfHeight / 2)
            {
                return true;
            }
        }
    }
    else
    {
        var xf = this.getXform();
        if(Math.abs(x - xf.getXPos()+offsetXform.getXPos()) < xf.getWidth() / 2 &&
           Math.abs(y - xf.getYPos()+offsetXform.getYPos()) < xf.getHeight() / 2)
        {
            return true;
        }
    }
    return false;
};

SceneNode.prototype.getRenderableAt = function (index) {
    return this.mSet[index];
};

SceneNode.prototype.addToSet = function (obj) {
    this.mSet.push(obj);
};
SceneNode.prototype.removeFromSet = function (obj) {
    var index = this.mSet.indexOf(obj);
    if (index > -1)
        this.mSet.splice(index, 1);
};
SceneNode.prototype.moveToLast = function (obj) {
    this.removeFromSet(obj);
    this.addToSet(obj);
};

// support children opeations
SceneNode.prototype.addAsChild = function (node) {
    this.mChildren.push(node);
};
SceneNode.prototype.removeChild= function (node) {
    var index = this.mChildren.indexOf(node);
    if (index > -1)
        this.mChildren.splice(index, 1);
};
SceneNode.prototype.getChildAt = function (index) {
    return this.mChildren[index];
};

SceneNode.prototype.draw = function (aCamera, parentMat) {
    var i;
    var xfMat = this.mXform.getXform();
    if (parentMat !== undefined)
        mat4.multiply(xfMat, parentMat, xfMat);
    
    // Draw our own!
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].draw(aCamera, xfMat); // pass to each renderable
    }
    
    // now draw the children
    for (i = 0; i < this.mChildren.length; i++) {
        this.mChildren[i].draw(aCamera, xfMat); // pass to each renderable
    }
    
    // for debugging, let's draw the pivot position
    if (this.mPivotPos !== null) {
        var pxf = this.getXform();
        var t = pxf.getPosition();
        var p = pxf.getPivot();
        var xf = this.mPivotPos.getXform();
        xf.setPosition(p[0] + t[0], p[1] + t[1]);
        this.mPivotPos.draw(aCamera, parentMat);
    }
};

SceneNode.prototype.update = function () 
{
    
    var xf = this.getXform();
    
    var barSetting = document.getElementById("speed").value; // value of the slider bar
    var movementSpeed = (parseInt(barSetting, 10)) / 10; // so that 10 equals 1 per update
     
    // handle Y direction movement
    if(xf.getYPos() !== xf.getYDest())
    {
        if(xf.getYPos() > xf.getYDest())
        {
            xf.incYPosBy(-movementSpeed);
        }
        else
        {
            xf.incYPosBy(movementSpeed);
        }
        
        if(Math.abs(xf.getYPos() - xf.getYDest()) < movementSpeed)
        {
            xf.setYPos(xf.getYDest());
        }
    }

    // handle X direction movement
    if(xf.getXPos() !== xf.getXDest()) 
    {
        if(xf.getXPos() > xf.getXDest())
        {
            xf.incXPosBy(-movementSpeed);
        }
        else
        {
            xf.incXPosBy(movementSpeed);
        }
        
        if(Math.abs(xf.getXPos() - xf.getXDest()) < movementSpeed)
        {
            xf.setXPos(xf.getXDest());
        }
    }
};
