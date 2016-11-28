/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode, ArmSegment, ListObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ClassExample() {
    
    this.drawManipulator = false; // have it off at the beginning
    
    this.mConstColorShader = new SimpleShader(
        "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
        "src/GLSLShaders/SimpleFS.glsl");    // Path to the simple FragmentShader
    
    this.mVertexColorShader = new ColorVertexShader(
        "src/GLSLShaders/ColorVertexVS.glsl",      // Path to the VertexShader 
        "src/GLSLShaders/ColorVertexFS.glsl");    // Path to the simple FragmentShader
    
    this.mFileTextureShader = new FileTextureShader(
        "src/GLSLShaders/TextureVS.glsl",      // Path to the VertexShader 
        "src/GLSLShaders/TextureFS.glsl");    // Path to the simple FragmentShader
    
    this.mCurrentObject = new ArmSegment(this.mConstColorShader, "newShape", 0, 0);
    this.mFileTexture = new FileTextureSupport("assets/minion_portal.png", true);

    this.mCurrentObject.getXform().setPosition(20, 20);
    this.mCurrentObject.getXform().setSize(20, 20);
    this.mCurrentObject.getXform().setDestination(0,0);
    
    this.mAllObjects = [];
    
    this.vmUseRandomColor = false;
    this.setConstShader();
    this.mAllObjects.push(new ListObject(this.mConstColorShader, "newList", 0,0));
    
    // draw the manipulators
    this.mManipulatorTranslate = new SquareRenderable(this.mConstColorShader);
    this.mManipulatorTranslate.setColor([0, 0, 1, 1]);
    this.mManipulatorTranslate.getXform().setSize(2, 2);
    
    this.mManipulatorRotation = new SquareRenderable(this.mConstColorShader);
    this.mManipulatorRotation.setColor([0, 1, 0, 1]);
    this.mManipulatorRotation.getXform().setSize(2, 2);
    
    this.mManipulatorScaling = new SquareRenderable(this.mConstColorShader);
    this.mManipulatorScaling.setColor([1, 0, 0, 1]);
    this.mManipulatorScaling.getXform().setSize(2, 2);
    
    this.mBarOne = new SquareRenderable(this.mConstColorShader);
    this.mBarOne.setColor([0, 0, 0, 1]);
    this.mBarOne.getXform().setSize(4, .2);
    
    this.mBarTwo = new SquareRenderable(this.mConstColorShader);
    this.mBarTwo.setColor([0, 0, 0, 1]);
    this.mBarTwo.getXform().setSize(.2, 4);
    
};

ClassExample.prototype.draw = function (camera) {
    // Step F: Starts the drawing by activating the camera
    camera.setupViewProjection();
    
    // center red square
    var i;
    for (i=0; i<this.mAllObjects.length; i++)
        this.mAllObjects[i].draw(camera);
    
    // check to see if the manipulators sshould be drawn (after the arms)
    if (this.drawManipulator){ // draw the direct manipulator
        this.mBarOne.draw(camera);
        this.mBarTwo.draw(camera);
        this.mManipulatorTranslate.draw(camera);
        this.mManipulatorRotation.draw(camera);
        this.mManipulatorScaling.draw(camera);
    }
};

// Determine if any objects contain the point
// If they contain the point, they become selected
ClassExample.prototype.select = function(x, y)
{
    var i;
    for (i=0; i<this.mAllObjects.length; i++)
    {
        var obj = this.mAllObjects[i];
        for (var j = 0; j < obj.mChildren.length; j++)
        {
            var child = obj.mChildren[j];
            var cXform = new Transform();
                cXform.setPosition(obj.getXform().getXPos() + child.getXform().getXPos()*obj.getXform().getWidth(), 
                    obj.getXform().getYPos() + child.getXform().getYPos()*obj.getXform().getHeight());
                cXform.setSize(obj.getXform().getWidth()*child.getXform().getWidth(), 
                                obj.getXform().getHeight()*child.getXform().getHeight());
            if(child.containsPointOffset(x, y, obj.getXform()))
            {
                this.mCurrentObject = child;
                this.mSelectedXform = obj.getXform();
                return true;
            }

        }
           
        if(obj.containsPoint(x, y))
        {
            this.mCurrentObject = obj;
            this.mSelectedXform = null;
            return true;
        }
    }

    return false;
};