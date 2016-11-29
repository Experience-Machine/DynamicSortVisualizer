/* 
 * File: CSS450Slider.js
 * A slider utility   
 */

/*jslint node: true, vars: true, bitwise: true */
/*global angular */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

angular.module("CSS450Slider", [])
    .directive("cssSlider", function () {
        return {

            template:  "\
               <md-slider-container>\
                {{mLabel}}\
                <md-slider min={{mMin}} max={{mMax}} ng-model='mModel' \
                      ng-change='sliderService()'\
                      ng-mouseup='sliderService()'\
                      ng-disabled='!mActive'\
                      aria-label='slider'\
                      class='md-primary'\n\
                      style=''>\
                </md-slider>\
              </md-slider-container>",
                 // \n\ => 
                 //      "\n" <cr> in string
                 //      "\" escape the newline in editor
                 // display: inline-blick
                 //      wraps the div content


            scope: {
                mModel: "=model",       // binds to this variable
                mMin: "=min",           // value of min
                mMax: "=max",           // value of max
                mLabel: "@label",       // value of static string
                mActive: "=active",     // if the sldier is active
                mCallback: "=callback"  // for ng-change callback
            },

            controller: function ($scope) {
                // set defaults
                if (!angular.isDefined($scope.mLabel))
                    $scope.mLabel = "Label";
                
                if (!angular.isDefined($scope.mModel))
                    $scope.mModel = 0;
                
                if (!angular.isDefined($scope.mMin))
                    $scope.mMin = 0;
                
                if (!angular.isDefined($scope.mMax))
                    $scope.mMax = 100;
                
                if (!angular.isDefined($scope.mActive))
                    $scope.mActive = true;
                
                $scope.sliderService = function() {
                    if (angular.isDefined($scope.mCallback))
                        $scope.mCallback();
                }
            }
        };
    });