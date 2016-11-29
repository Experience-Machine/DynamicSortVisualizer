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
    
    this.mSorting = false;
    
    // bubble = bubble sort - https://en.wikipedia.org/wiki/Bubble_sort
    // selection = selection sort - https://en.wikipedia.org/wiki/Selection_sort
    this.mSortType = "bubble"; 
    
    this.mSortIndex = 0;
    this.mSorted = false;
    this.width = 0;
    
    var xf = this.getXform();
    xf.setPivot(xPivot, yPivot);
};

gEngine.Core.inheritPrototype(ListObject, SceneNode);

ListObject.prototype.updateListPos = function()
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
    }
};

ListObject.prototype.update = function()
{
    Object.getPrototypeOf(ListObject.prototype).update.call(this);
    
    for (var i=0; i<this.mChildren.length; i++)
    {
        this.mChildren[i].update();
    }
    
    // This should be the LAST thing in update:
    if(this.mSorting && this.mChildren.length > 0)
    {
        for (var i=0; i<this.mChildren.length; i++)
        {
            var cXform = this.mChildren[i].getXform();
            /*
            console.log("Child[" + i + "] Pos: " + cXform.getXPos() + ", " + cXform.getYPos() + 
                        " Dest: " + cXform.getXDest() + ", " + cXform.getYDest());
                        */
            if(cXform.getXPos() !== cXform.getXDest() ||
               cXform.getYPos() !== cXform.getYDest())
            {
                // Objects currently moving
                //console.log("Moving..");
                return;
            }
        }
        
        // Ready for next step!
        this.sortStep();
    }
};

ListObject.prototype.determineIndices = function()
{
    this.mChildren.sort(function(a, b) { 
        return a.getXform().getXPos() - b.getXform().getXPos();
    });
};

// This method is called when the 'sort' button is pressed, to initiate the sort
ListObject.prototype.activeSort = function()
{
    this.mSorting = true;
    this.initSort();
};

// Called when the sort button is pressed -- these are sort specific initilizations
ListObject.prototype.initSort = function()
{
    //console.log("Init Sort");
    
    if(this.mSortType === "bubble")
    {
        this.mSortIndex = 0;
        this.mSorted = true; // This is set to false on swap
    }
    
    if(this.mSortType === "selection")
    {
        this.mSortIndex = 0;
        this.mSorted = true;
    }
};

// This is called once per 'step' of a sort. This means
//  that all objects have reached their intended positions
//  and the program is ready for the next sort step
ListObject.prototype.sortStep = function()
{
    if(this.mSortType === "bubble")
    {
        this.bubbleSortStep();
    }
    
    if(this.mSortType === "selection"){
        this.selectionSortStep();
    }
};

// If our sort type is bubble sort, this is called once
//  per sort step
ListObject.prototype.bubbleSortStep = function()
{
    //console.log("Bubble Sort Step");
    
    // If we're at the final list item..
    if(this.mSortIndex === this.mChildren.length - 1)
    {
        // Is sorted?
        if(this.mSorted)
        {
            this.mSorting = false;
        }
        else // Restart bubble sort
        {
            this.mSortIndex = 0;
            this.mSorted = true;
        }
        return;
    }
    
    var left = this.mChildren[this.mSortIndex];
    var right = this.mChildren[this.mSortIndex + 1];
    
    if(left.getXform().area() > right.getXform().area())
    {
        // Swap
        this.mChildren[this.mSortIndex] = right;
        this.mChildren[this.mSortIndex + 1] = left;
        this.mSorted = false;
        this.updateListPos();
    }
    
    this.mSortIndex++;
};

// if the sort type is selection sort, called once per sort step
ListObject.prototype.selectionSortStep = function()
{
    // If we're out of the index, we've sorted the entire thing
    if(this.mSortIndex === this.mChildren.length)
    {
        this.mSorted = true;
        this.mSorting = false;
        return;
    }
    
    var min = this.mChildren[this.mSortIndex].getXform().area(); // assume the first is the smallest
    
    var minPosition = 0; 
   
    var i;
    
    // got through the entire list to find the min
    for (i = this.mSortIndex; i < this.mChildren.length; i++){
        if (this.mChildren[i].getXform().area() < min){ // is it smaller than the current min
            min = this.mChildren[i].getXform().area(); // set the new min
            minPosition = i; // hold the position of the new min in the array
        }
    } // minPosition now holds the smallest

    // time to swap
    if (min !== this.mChildren[this.mSortIndex].getXform().area()){
        var left = this.mChildren[this.mSortIndex];
        var right = this.mChildren[minPosition];
    
        this.mChildren[this.mSortIndex] = right;
        this.mChildren[minPosition] = left;
    
        this.mSorted = false;
        
        this.updateListPos();
    }
    
    this.mSortIndex++;
};

ListObject.prototype.getWidth = function()
{
        var numObjects = this.mChildren.length;
        var overallSize = 0;
        var i;
        for (i=0; i < numObjects; i++)
        {
            overallSize += this.mChildren[i].getXform().getWidth();
        }
        return overallSize;
}