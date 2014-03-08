'use strict';

function RivetPoint(x, y) {
    this.isCell = true;
    this.highlight = false;
    this.x = x;
    this.y = y;
    this.available = true;
    this.rivet = null;
    this.isVisible = true;

    this.clear = function() {
        this.rivet = null;
    };

    this.enable = function() {
        this.available = true;
    };

    this.disable = function() {
        this.available = false;
    };

    this.isOccupied = function() {
        return this.rivet !== null;
    };
}

function Matrix() {
    this.rows = [];
    this.set = function(x, y, value) {
        if (!(this.rows[y])) {
            this.rows[y] = [];
        }
        this.rows[y][x] = value;
    };

    this.get = function(x, y) {
        if (this.rows[y] && this.rows[y][x]) {
            return this.rows[y][x];
        }
        return null;
    };

    this.has = function(x, y) {
        return this.rows[y] && this.rows[y][x];
    };
}

function Collar(xRange, yRange) {
    this.xRange = xRange;
    this.yRange = yRange;
    this.data = new Matrix();

    this.buildHelperArrays = function(xRange, yRange) {
        this.iterableRow = [];
        this.allCells = [];
        this.width = xRange.length;
        this.height = yRange.length;
        for (var y = 0; y < yRange.length; y++) {
            this.iterableRow.push([]);
            for (var x = 0; x < xRange.length; x++) {
                var cell = this.data.get(xRange[x], yRange[y]);
                if (!cell) {
                    cell = new RivetPoint(xRange[x], yRange[y]);
                    this.data.set(xRange[x], yRange[y], cell);
                }
                cell.available = true;
                this.iterableRow[y].push(cell);
                this.allCells.push(cell);
            }
        }
    };

    this.deleteAll = function() {
        for (var c = 0; c < this.allCells.length; c++) {
            this.allCells[c].available = true;
            this.allCells[c].rivet = null;
            this.allCells[c].key = null;            
        }
    };

    this.place = function(x, y, key, rivet) {
        if (this.data.has(x, y)) {
            var cell = this.data.get(x, y);
            cell.key = key;
            cell.rivet = rivet;
        }
    };

    this.toSaveMessage = function() {
        var placedRivets = [];
        for (var c = 0; c < this.allCells.length; c++) {
            var point = this.allCells[c];
            if (point.isOccupied()) {
                var placedRivet = {rivetId: point.rivet.rivetId, x: point.x, y: point.y};
                placedRivets.push(placedRivet);
            }
        }
        return placedRivets;
    };

    //disables all relativePoints as seen from the point of x,y
    this.disable = function(x, y, relativePoints) {
        for (var index = 0; index < relativePoints.length; index++) {
            var point = relativePoints[index];
            var dX = x + parseInt(point.x, 10);
            var dY = y + parseInt(point.y, 10);

            if (this.data.has(dX, dY)) {
                this.data.get(dX, dY).disable();
            }
        }
    };

    //enables all cells of this collar
    this.enableAll = function() {
        for (var c = 0; c < this.allCells.length; c++) {
            this.allCells[c].enable();
        }
    };

    //updtes the enablements of all points of the collar respecting the voidZones of the
    //rivets already placed on the collar
    this.updateDisablements = function() {
        this.enableAll();

        for (var c = 0; c < this.allCells.length; c++) {
            var currentRivet = this.allCells[c];
            if (currentRivet.isVisible && currentRivet.isOccupied()) {
                this.disable(currentRivet.x, currentRivet.y, currentRivet.rivet.voidZones);
            }
        }
    };

    this.removeTopAndBottom = function() {
        var lastRow = this.height - 1;
        this.allCells.splice(lastRow * this.width, this.width); //remove the bottom row
        this.allCells.splice(0, this.width); //remove the top row
    };

    this.removeMaxColumn = function() {
        for (var col = this.height - 1; col >= 0; col++) {
            this.allCells.splice(col * this.width, 1);
        }
    };

    this.resize = function(xRange, yRange) {
        _.each(this.allCells, function(cell) {
            cell.isVisible = false;
        });
        //this.buildHelperArrays(xRange, yRange);
        for (var y = 0; y < yRange.length; y++) {
            for (var x = 0; x < xRange.length; x++) {
                this.data.get(xRange[x], yRange[y]).isVisible = true;
            }
        }

        this.enableAll();
        this.updateDisablements();
    };

    this.copyFrom = function(otherCollar) {
        for (var c = 0; c < this.allCells.length; c++) {
            var currentCell = this.allCells[c];
            var otherCell = otherCollar.allCells[c];

            currentCell.available = otherCell.available;
            currentCell.rivet = otherCell.rivet;
        }
    };

    this.mirrorFrom = function(otherCollar) {
        for (var c = 0; c < this.allCells.length; c++) {
            var currentCell = this.allCells[c];
            var otherCell = otherCollar.data.get(-currentCell.x, currentCell.y);

            currentCell.available = otherCell.available;
            currentCell.rivet = otherCell.rivet;
        }
    };

    this.buildHelperArrays(xRange, yRange);
}

angular.module('cgDogCollarsApp')
        .controller('DesignerCtrl', function($scope, $routeParams, $modal, $location) {

            $scope.progress = {
                steps: 4,
                message: "Laden ...",
                value: 1,
                done: false
            };

            var rivetsIndex = new Object();
            gapi.client.rivet.rivets.list().execute(function(resp) {
                $scope.$apply(function() {
                    $scope.progress.value = $scope.progress.value + 1;
                    $scope.rivetGroups = resp.collections;
                    for (var ci = 0; ci < $scope.rivetGroups.length; ci++) {
                        var group = $scope.rivetGroups[ci];
                        for (var ri = 0; ri < group.rivets.length; ri++) {
                            var rivet = group.rivets[ri];
                            rivetsIndex[rivet.rivetId] = rivet;
                        }
                    }
                });

                //load the available collar size information
                gapi.client.rivet.collar.getsizes().execute(function(result) {
                    $scope.$apply(function() {
                        $scope.progress.value = $scope.progress.value + 1;
                    });

                    $scope.availableHeights = result.heightParameters;
                    $scope.availableWidths = result.widthParameters;
                    $scope.currentWidth = result.widthParameters[3];
                    $scope.currentHeight = result.heightParameters[2];

                    var width = parseInt($scope.currentWidth.value, 10);
                    var height = Math.max(Math.floor(parseInt($scope.currentHeight.value, 10) / 2), 0);

                    $scope.leftCollar = new Collar(_.range(-width, 0), _.range(-height, height + 1));
                    $scope.rightCollar = new Collar(_.range(1, width + 1), _.range(-height, height + 1));

                    //load the colar to edit
                    if ($routeParams.key) {
                        $scope.key = $routeParams.key;
                        gapi.client.rivet.collar.get($routeParams).execute(function(resp) {
                            $scope.$apply(function() {
                                $scope.progress.value = $scope.progress.value + 1;
                                $scope.collarName = resp.name;
                                $scope.importRivets(resp.rivets);
                                $scope.progress.done = true;
                            });
                        });
                    } else {
                        $scope.progress.value = $scope.progress.value + 1;
                        $scope.progress.done = true;
                    }

                });
            });

            $scope.importRivets = function(rivets) {
                for (var i = 0; i < rivets.length; i++) {
                    var rivet = rivets[i];
                    var localRivet = rivetsIndex[rivet.rivetId];
                    if (rivet.x < 0) {
                        $scope.leftCollar.place(rivet.x, rivet.y, rivet.rivetId, localRivet);
                    } else {
                        $scope.rightCollar.place(rivet.x, rivet.y, rivet.rivetId, localRivet);
                    }
                }
                $scope.updateDisablements();

            };

            $scope.no = false;
            $scope.zoom = 40;
            $scope.showPreview = false;

            $scope.rivetPointClicked = function(x, y) {
                $scope.lastX = x;
                $scope.lastY = y;
            };

            $scope.dropOn = function(drag, dropTarget, element) {
                var targetRivet = drag;
                if (drag.isCell) {
                    targetRivet = drag.rivet;
                }

                dropTarget.rivet = targetRivet;
                //clear the cell if we dragged from a cell
                if (drag !== dropTarget && drag.isCell === true) {
                    drag.clear();
                }
                $scope.updateDisablements();
                $scope.save();
            };

            $scope.updateDisablements = function() {
                $scope.leftCollar.updateDisablements();
                $scope.rightCollar.updateDisablements();
            };

            $scope.clearRivet = function(dragData, element) {
                dragData.clear();
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

            $scope.save = function() {
                var collar = {name: $scope.collarName, height: $scope.currentHeight.value, partWidth: $scope.currentWidth.value, key: $scope.key};
                collar.rivets = [];
                collar.rivets = $scope.leftCollar.toSaveMessage().concat($scope.rightCollar.toSaveMessage());
                gapi.client.rivet.collar.save(collar).execute(function(resp) {
                    $scope.$apply(function() {
                        $scope.key = resp.key;
                    });
                });
            };

            $scope.openSettings = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'designerSettings.html',
                    controller: SettingsCtrl,
                    resolve: {
                        availableHeights: function() {
                            return $scope.availableHeights;
                        },
                        availableWidths: function() {
                            return $scope.availableWidths;
                        },
                        currentWidth: function() {
                            return $scope.currentWidth;
                        },
                        currentHeight: function() {
                            return $scope.currentHeight;
                        }
                    }});

                modalInstance.result.then(function(newSize) {
                    var collarWidth = parseInt(newSize.selectedWidth.value, 10);
                    var collarHeight = Math.max(Math.floor(parseInt(newSize.selectedHeight.value, 10) / 2), 0);

                    $scope.currentHeight = newSize.selectedHeight;
                    $scope.currentWidth = newSize.selectedWidth;

                    $scope.leftCollar.resize(_.range(-collarWidth, 0), _.range(-collarHeight, collarHeight + 1));
                    $scope.rightCollar.resize(_.range(1, collarWidth + 1), _.range(-collarHeight, collarHeight + 1));
                });
            };

            $scope.openMyCollars = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'myCollars.html',
                    controller: MyCollarCtrl,
                    resolve: {
                        location: function() {
                            return $location;
                        }
                    }
                });


            };


            $scope.toolbar = new Object();
            $scope.toolbar.copyRightToLeft = function() {
                $scope.leftCollar.copyFrom($scope.rightCollar);
            };
            $scope.toolbar.copyLeftToRight = function() {
                $scope.rightCollar.copyFrom($scope.leftCollar);
            };
            $scope.toolbar.mirrorRightToLeft = function() {
                $scope.leftCollar.mirrorFrom($scope.rightCollar);
            };
            $scope.toolbar.mirrorLeftToRight = function() {
                $scope.rightCollar.mirrorFrom($scope.leftCollar);
            };
            $scope.toolbar.deleteAll = function() {
                $scope.leftCollar.deleteAll();
                $scope.rightCollar.deleteAll();
            };


            $scope.showRivetPoints();
        });


var MyCollarCtrl = function($scope, $modalInstance, location) {
    $scope.collars = [];
    gapi.client.rivet.collar.list().execute(function(resp) {
        $scope.$apply(function() {
            $scope.collars = resp.collars;
        });
    });

    $scope.select = function(key) {
        location.path('designer/' + key);
        $modalInstance.dismiss('load');
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};

var SettingsCtrl = function($scope, $modalInstance, availableHeights, availableWidths,
        currentWidth, currentHeight) {

    $scope.availableHeights = availableHeights;
    $scope.availableWidths = availableWidths;
    $scope.collarHeight = currentHeight;
    $scope.collarWidth = currentWidth;

    $scope.ok = function() {
        $modalInstance.close({
            selectedHeight: $scope.collarHeight,
            selectedWidth: $scope.collarWidth});
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.selectHeight = function(height) {
        $scope.collarHeight = height;
    };

    $scope.selectWidth = function(width) {
        $scope.collarWidth = width;
    };
};