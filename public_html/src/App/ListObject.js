/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

function ListObject(shader, name, xPivot, yPivot)
{
    SceneNode.call(this, shader, name, true);
    
    var xf = this.getXform();
    xf.setPivot(xPivot, yPivot);
};

gEngine.Core.inheritPrototype(ListObject, SceneNode);

ListObject.prototype.update = function()
{
        // Determine 'overall size' of objects
    if (this.mChildren.length > 0)
    {
        var numObjects = this.mChildren.length;
        var overallSize = 0;
        var i;
        for (i=0; i < numObjects; i++)
        {
            overallSize += this.mChildren[i].getXform().getWidth();
        }

        // Update first object first
        i = 0;
        var xf = this.mChildren[i].getXform();
        var xPos = (-overallSize/2); // Could be better
        var yPos = -20; // Arbitrary line
        xf.setDestination(xPos, yPos);
        var lastPosition = xPos;
        lastPosition += xf.getWidth()/2;

        // Update the rest of the objects
        for (i=1; i < numObjects; i++)
        {
            xf = this.mChildren[i].getXform();
            xPos = lastPosition + xf.getWidth()/2 + 2;
            xf.setDestination(xPos, yPos);
            lastPosition = xPos + xf.getWidth()/2;
        }
        for (var i=0; i<this.mChildren.length; i++)
        {
            this.mChildren[i].update();
        }
    }
}