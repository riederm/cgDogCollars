'use strict';

function Rivet(x, y) {
    this.isCell = true;
    this.highlight = false;
    this.x = x;
    this.y = y;
    this.image = "";
    this.available = true;

    this.clear = function() {
        this.image = "";
    };

    this.enable = function() {
        this.available = true;
    };

    this.disable = function() {
        this.available = false;
    };
    
    this.isOccupied = function(){
        return this.image !== "";
    }
}

function Collar(width, height) {
    this.width = width;
    this.height = height;
    this.rows = [];
    for (var row = 0; row < this.height; row++) {
        var currentRow = [];
        for (var col = 0; col < this.width; col++) {
            var cell = new Rivet(col, row);
            cell.rivetId = -1;
            currentRow.push(cell);
        }
        this.rows.push(currentRow);
    }

    this.disable = function(x, y, relativePoints) {
        for (var index = 0; index < relativePoints.length; index++) {
            var point = relativePoints[index];
            var dX = x + point.relX;
            var dY = y + point.relY;

            if (dX >= 0 && dX < this.width && dY >= 0 && dY < this.height) {
                this.rows[dY][dX].disable();
            }
        }
    };

    this.enableAll = function() {
        for (var row = 0; row < this.height; row++) {
            var currentRow = this.rows[row];
            for (var col = 0; col < this.width; col++) {
                currentRow[col].enable();
            }
        }
    };

    this.updateDisablements = function() {
        this.enableAll();
        for (var row = 0; row < this.height; row++) {
            var currentRow = this.rows[row];
            for (var col = 0; col < this.width; col++) {
                var currentRivet = currentRow[col];
                if (currentRivet.isOccupied()){
                    this.disable(currentRivet.x, currentRivet.y, currentRivet.voidZones);
                }
            }
        }
    };

}

angular.module('cgDogCollarsApp')
        .controller('DesignerCtrl', function($scope, $http) {
            $http.get('data/collar.json').success(function(data) {
                $scope.rivetGroups = data;
            });

            var rows = 5;
            var cols = 30;


            $scope.leftCollar = new Collar(cols, rows);
            $scope.rightCollar = new Collar(cols, rows);
            
            $scope.rivetPointClicked = function(x, y) {
                $scope.lastX = x;
                $scope.lastY = y;
            };

            $scope.dropOn = function(rivet, rivetPoint, element) {

                rivetPoint.image = rivet.image;
                rivetPoint.voidZones = rivet.voidZones;
                
                //clear the cell if we dropped from a cell
                if (rivetPoint !== rivet && rivet.isCell === true) {
                    rivet.image = "";
                }
                $scope.leftCollar.updateDisablements();
                $scope.rightCollar.updateDisablements();
            };

            $scope.clearRivet = function(dragData, element) {
                dragData.image = "";
            };

            $scope.showRivetPoints = function() {
                $scope.dragMode = true;
            };
            $scope.hideRivetPoints = function() {
                //$scope.dragMode = false;
            };

            $scope.highlightRivetPoint = function(dragData, rivet, element) {
                if (rivet.available) {
                    rivet.highlight = true;
                }
            };
            $scope.unhighlightRivetPoint = function(dragData, rivet, element) {
                rivet.highlight = false;
            };


            $scope.showRivetPoints();
        });
