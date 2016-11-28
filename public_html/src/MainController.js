/* 
 * File: MainController.js
 * Container controller for the entire world
 */

/*jslint node: true, vars: true, bitwise: true */
/*global angular, document, ClassExample, Camera, CanvasMouseSupport */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

// Creates the "backend" logical support for appMyExample
var myModule = angular.module("appMyExample", ["CSS450Timer", "CSS450Slider", "CSS450Xform"]);

// registers the constructor for the controller
// NOTE: the constructor is only called _AFTER_ the </body> tag is encountered
//       this code does NOT run until the end of loading the HTML page
myModule.controller("MainCtrl", function ($scope) {
    // Initialize the graphics system
    gEngine.Core.initializeWebGL('GLCanvas');
    $scope.mCanvasMouse = new CanvasMouseSupport('GLCanvas');
    
    $scope.mMyWorld = new ClassExample();
    $scope.mView = new Camera(
         [0, 0],
         80,
         [0, 0, 800, 600]);
    
    $scope.mSelectedXform = $scope.mMyWorld.currentObject().getXform();
    $scope.mMyImagePath = null;
    
    $scope.slectedTransform = "scale"; // none scale translate rotate
        
    $scope.mUseShader = [
        {label: "Constant Color", value: "Constant"},
        {label: "Per Vertex Color", value:"PerVertex"},
        {label: "File Texture", value:"FileTexture"}
    ];
    $scope.mSelectedShader = $scope.mUseShader[0].value;
    $scope.selectShader = function() {
        switch ($scope.mSelectedShader) {
            case $scope.mUseShader[0].value:
                 $scope.mMyWorld.setConstShader();
                break;
            case $scope.mUseShader[1].value:
                $scope.mMyWorld.setVertexColorShader();
                break;
            case $scope.mUseShader[2].value:
                $scope.mMyWorld.setFileTextureShader();
                break;
        }
    };

    $scope.mainTimerHandler = function () {
        $scope.mMyWorld.update();
        gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]); // Clear the canvas
        $scope.mMyWorld.draw($scope.mView);
        $scope.handleManipulators(); // make sure it follows when using the sliders
    };

    $scope.defineSquare = function (event) 
    {
        var mWCX = $scope.mView.mouseWCX($scope.mCanvasMouse.getPixelXPos(event));
        var mWCY = $scope.mView.mouseWCY($scope.mCanvasMouse.getPixelYPos(event));
        
        if($scope.mMyWorld.select(mWCX, mWCY) && $scope.mMyWorld.drawManipulator === false) // selecting an object
        {
            //$scope.mSelectedXform = $scope.mMyWorld.currentObject().getXform();
            $scope.mSelectedXform = $scope.mMyWorld.mSelectedXform;
            $scope.slectedTransform = "none"; // selecting an object but not a manipulator yet
            $scope.mMyWorld.drawManipulator = true; // selecting an object so draw
            $scope.handleManipulators(); 
  
        } // check to see if the scale manipulator is being clicked
        else if($scope.checkClicks($scope.mMyWorld.mManipulatorScaling.getXform().getXPos(), 
            $scope.mMyWorld.mManipulatorScaling.getXform().getYPos(), mWCX, mWCY))
        { // clicking on the scale manipulator
            $scope.slectedTransform = "scale";
        } // check to see if the translate manipulator is being clicked
        else if($scope.checkClicks($scope.mMyWorld.mManipulatorTranslate.getXform().getXPos(), 
            $scope.mMyWorld.mManipulatorTranslate.getXform().getYPos(), mWCX, mWCY))
        {
            $scope.slectedTransform = "translate";
        } // check to see if the rotation manipulator is being clicked
        else if($scope.checkClicks($scope.mMyWorld.mManipulatorRotation.getXform().getXPos(), 
            $scope.mMyWorld.mManipulatorRotation.getXform().getYPos(), mWCX, mWCY))
        {
            $scope.slectedTransform = "rotate";
        }
        
        else // making a new object
        {
            $scope.mMyWorld.drawManipulator = false; // stop drawing
            
            $scope.mMyWorld.defineCenter( // make a new object
                mWCX,
                mWCY);
            $scope.mSelectedXform = $scope.mMyWorld.currentObject().getXform();
        }
        $scope.mForceRedraw = true;
    };

    $scope.dragSquare = function (event) {
        var mWCX = $scope.mView.mouseWCX($scope.mCanvasMouse.getPixelXPos(event));
        var mWCY = $scope.mView.mouseWCY($scope.mCanvasMouse.getPixelYPos(event));
        
        switch (event.which) {
        case 1: // left
            if ($scope.slectedTransform === "scale"){ // change the scale
                $scope.mMyWorld.defineWidth(mWCX,mWCY);
                $scope.mForceRedraw = true;
            }
            if ($scope.slectedTransform === "translate")
            { // change the translation
                var listXform = $scope.mMyWorld.mLists[$scope.mMyWorld.mActiveList].getXform();
                $scope.mMyWorld.currentObject().getXform().setDestination(mWCX - listXform.getXPos(), mWCY - listXform.getYPos());
                $scope.mMyWorld.currentObject().getXform().setPosition(mWCX - listXform.getXPos(), mWCY - listXform.getYPos());
            }
            if ($scope.slectedTransform === "rotate")
            { // change the rotation
                $scope.mMyWorld.currentObject().getXform().setRotationInDegree(mWCX * 10);
            }
            break;
        }
    };
    
    $scope.squareDefined = function(event)
    {
        switch (event.which) {
        case 1: // left
            $scope.mMyWorld.defined();
            $scope.mForceRedraw = true;
            $scope.slectedTransform = "scale"; // object created prepare for another
            break;
        }
    };
    
    $scope.acceptFiles = function (event) {
        var input = event.target;
        var reader = new FileReader();
        reader.onload = function () {
            // hacky for now
            $scope.mMyImage = new Image();
            $scope.mMyImage.src = reader.result;
            $scope.mMyWorld.newFileTexture(reader.result, false);
        };
        $scope.mMyImagePath = input.files[0];
        reader.readAsDataURL(input.files[0]);
    };
    
    // handle the movement of the various direct manipulators
    $scope.handleManipulators = function (){
        var targetX = $scope.mMyWorld.currentObject().getXform().getXPos();   
        var targetY = $scope.mMyWorld.currentObject().getXform().getYPos();   
                
        if($scope.mMyWorld.selectedXform() && $scope.mMyWorld.selectedXform() !== null)
        {
            targetX += $scope.mMyWorld.selectedXform().getXPos();
            targetY += $scope.mMyWorld.selectedXform().getYPos();  
        }
        
        // translate manipulator
        $scope.mMyWorld.mManipulatorTranslate.getXform().setPosition(targetX, targetY);
        
        // rotate manipulator
        $scope.mMyWorld.mManipulatorRotation.getXform().setPosition(targetX, targetY - 5);
        
        // scale manipulator
        $scope.mMyWorld.mManipulatorScaling.getXform().setPosition(targetX - 5, targetY);
        
        // black connecting bars (purely aesthetic) 
        $scope.mMyWorld.mBarOne.getXform().setPosition(targetX - 2.5, targetY);
        $scope.mMyWorld.mBarTwo.getXform().setPosition(targetX, targetY - 2.5);
    };

    $scope.checkClicks = function (manipulatorX, manipulatorY, x, y){
        
       if(Math.abs(x - manipulatorX) < 1 &&
            Math.abs(y - manipulatorY) < 1) {
            return true;
       }
       return false;
    };
    
    $scope.handleSort = function()
    {
        console.log('Sort!');
        $scope.mMyWorld.mLists[$scope.mMyWorld.mActiveList].activeSort();
    };
});