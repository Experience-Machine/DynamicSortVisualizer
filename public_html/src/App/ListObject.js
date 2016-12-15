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
    SceneNode.call(this, shader, name, false);
    
    this.mSorting = false;
    
    // bubble = bubble sort - https://en.wikipedia.org/wiki/Bubble_sort
    // selection = selection sort - https://en.wikipedia.org/wiki/Selection_sort
    // merge = 
    // bogo = https://en.wikipedia.org/wiki/Bogosort
    this.mSortType = "bubble"; 
    
    this.mSortIndex = 0;
    this.mSorted = false;
    this.width = 0;
    this.levelsOfMerge = 0; // keep track of how many times to re-merge
    this.mergesDone = 1;
    this.levels = 1;
    this.target = 0;
    this.compare = 0;
    
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
               cXform.getYPos() !== cXform.getYDest()  || 
               this.mChildren[i].highlighted)
            {
                // Objects currently moving or highlighted
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

// called when the stop button is pressed
ListObject.prototype.stopSort = function()
{
    this.mSorting = false;
    this.mSortIndex = 0;
    this.mSorted = false;
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
        this.mMinPosition = 0;
        this.mNextSortIndex = 0;
        this.mSorted = true;
    }
    
    if(this.mSortType === "bogo")
    {
        this.mSortIndex = 0;
        this.mSorted = true;
    }
    
    if(this.mSortType === "merge")
    {
        this.mSortIndex = 0;
        this.levelsOfMerge = 0;
        this.mergesDone = 1;
        this.levels = 1;
        this.target = 0;
        this.compare = 0;
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
    
    if(this.mSortType === "bogo"){
        this.selectionBogoStep();
    }
    
    if(this.mSortType === "merge"){
        this.selectionMergeStep();
    }
};

// If our sort type is bubble sort, this is called once
//  per sort step
ListObject.prototype.bubbleSortStep = function()
{
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
    
    left.highlight();
    right.highlight();
    
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
    
    // If our next position is the end, sort this index
    this.mNextSortIndex++;
    if(this.mNextSortIndex === this.mChildren.length)
    {
        var left = this.mChildren[this.mSortIndex];
        var right = this.mChildren[this.mMinPosition];
        
        left.highlight();
        right.highlight();
        
        this.mChildren[this.mSortIndex] = right;
        this.mChildren[this.mMinPosition] = left;
    
        this.mSorted = false;
        
        this.updateListPos();
        
        this.mSortIndex++;
        this.mMinPosition = this.mSortIndex;
        this.mNextSortIndex = this.mSortIndex;
        return;
    }
    
    // Otherwise, look at left and right indicies
    var left = this.mChildren[this.mMinPosition];
    var right = this.mChildren[this.mNextSortIndex];
    
    left.highlight();
    right.highlight();

    // If our right index is better minimum, keep track
    if (left.getXform().area() > right.getXform().area())
    {   
        this.mMinPosition = this.mNextSortIndex; // hold the position of the new min in the array
    }
};

ListObject.prototype.selectionBogoStep = function()
{
    // check to see if it is actually sorted
    if (this.mChildren.length < 2)
    {
        this.mSorted = true;
        this.mSorting = false;
        return;
    }   
    var i;
    var flag = false;
    for (i = 0; i < this.mChildren.length - 1; i++)
    {
        // previous is larger
        if (this.mChildren[i].getXform().area() > this.mChildren[i + 1].getXform().area())
        {
            flag = true;
        }    
    }    
    if (flag)
    {
        this.mSorted = false;
        this.mSorting = true;
    }  else 
    {
        this.mSorted = true;
        this.mSorting = false;
        return;
    }  
    // stupid sort stuff
    var randomFrom = Math.floor(Math.random() * (this.mChildren.length));
    var randomTo = Math.floor(Math.random() * (this.mChildren.length));
    
    // swap
    var left = this.mChildren[randomFrom];
    var right = this.mChildren[randomTo];
    
    left.highlight();
    right.highlight();
    
    this.mChildren[randomFrom] = right;
    this.mChildren[randomTo] = left;
    
    this.mSorted = false;
        
    this.updateListPos();
};

ListObject.prototype.selectionMergeStep = function()
{
    
    // get how many times needed to merge back
    if (this.mChildren.length % 2 === 0)
    {
        this.levelsOfMerge = Math.floor(this.mChildren.length / 2); // even length
    } else 
    {
        this.levelsOfMerge = Math.ceil(this.mChildren.length / 2); // odd length
    }
        
    // out of range so a level has been sorted
    if (this.mSortIndex >= this.mChildren.length - 1)
    {
        this.mergesDone++; 
        this.mSortIndex = 0;
    }
    
    // merged as many times that should be required, so it should be sorted
    if (this.mergesDone > this.levelsOfMerge)
    {
        this.mSorted = true;
        this.mSorting = false;
        return;
    }
     
    // levelsOfMerge - keep track of how many times to re-merge
    // mergesDone - a way to figure out how big the chunk is
    // levels - a pointer to move along the chunk that var right uses
    // target - this is then end of the current chunk that is being compared
    // compare - a pointer to move along the chunk that var left uses
    // NOTE: a chunk is what is being merged [2, 5, 3, 4], so [2, 5] would be a chunk
    // and [3, 4] would be the next chunk
    
    // find out how far to compare i.e. (2, 4, 5, 8) would have to compare from 2 to 8
    this.target = (this.mergesDone * 2) - 1; 
    
    var left = this.mChildren[this.mSortIndex + this.compare];
    var right = this.mChildren[this.mSortIndex + this.levels];
    
    if(left.getXform().area() > right.getXform().area())
    {   
        this.mChildren[this.mSortIndex + this.compare] = right;
        this.mChildren[this.mSortIndex + this.levels] = left;
    } 
    
    this.mSorted = false;
    this.mSorting = true;
    
    this.updateListPos(); 
    
    this.levels++; // increment the pointer i.e. from 4 to 5 to 8
    
    if (this.mSortIndex + this.levels > this.mChildren.length - 1)
    {
        this.target = this.levels - 1;
    }
    
    if (this.levels > this.target) // is the pointer at the end?
    {
        if (this.compare < this.target) // has the left side been incremented as well?
        {
            this.compare++;
            this.levels = this.compare; // so you dont compare backwords
        } else // both are at the end so move to the next chunk
        {
            this.mSortIndex += 2 * this.mergesDone;
            this.levels = 1;
            this.compare = 0;
        }
    } 
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
};