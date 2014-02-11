'use strict';

angular.module('cgDogCollarsApp')
        .controller('DesignerCtrl', function($scope, $http) {
            $http.get('data/collar.json').success(function(data){
                $scope.rivetGroups = data;
            });

            var rows = 5;
            var cols = 18;
            var rowArray = [];
            
            for (var row = 0; row < rows; row++) {
                var currentRow = [];
                
                for (var col = 0; col < cols; col++) {
                    var cell = new Object();
                    cell.x = col;
                    cell.y = row;
                    cell.rivetId = -1;
                    cell.image = "";
                    cell.isCell = true;
                    cell.highlight = false;
                    currentRow.push(cell);
                }
                
                rowArray.push(currentRow);
            }
            
            $scope.collar = new Object();
            $scope.collar.rows = rowArray;

            $scope.x = 3;
            
            $scope.lastX = -1;
            $scope.lastY = -1;
            $scope.rivetPointClicked = function (x, y){
                $scope.lastX = x;
                $scope.lastY = y;
            };
            
            $scope.dropOn = function(dragData, dropTarget, element){
 
                dropTarget.image = dragData.image;
                
                //clear the cell if we dropped from a cell
                if (dropTarget !== dragData && dragData.isCell === true){
                    dragData.image = "";
                }
           };
           
           $scope.clearRivet = function(dragData, element){
                dragData.image = "";
           };
           
           $scope.binVisible=true;
           
           $scope.showRivetPoints = function(){
               $scope.dragMode = true;
           };
           $scope.hideRivetPoints = function(){
             $scope.dragMode = false;
           };
           
           $scope.highlightRivetPoint = function(dragData, rivet, element){
               rivet.highlight = true;
           };
           $scope.unhighlightRivetPoint = function(dragData, rivet, element){
               rivet.highlight = false;
           };
           
           
           $scope.hideRivetPoints();
        });
