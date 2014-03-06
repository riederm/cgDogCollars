'use strict';

angular.module('cgDogCollarsApp')
  .controller('AddrivetsCtrl', function ($scope, $routeParams, $location) {
	$scope.form = {enabled: false, deleteEnabled: false};      
    
    var width = 7; //should be odd

    if ($routeParams.rivetId){
        gapi.client.rivet.get({key: $routeParams.rivetId}).execute(
            function(resp){
                $scope.$apply(function(){
			        $scope.rivet = resp;
			        $scope.form.enabled = true;
                    $scope.form.deleteEnabled = true;
 
                    var center = Math.floor(width/2);                   
                    //set the voidZone-points to true
                    if ($scope.rivet.voidZones){
                        for(var i=0; i<$scope.rivet.voidZones.length; i++){
                            var zone = $scope.rivet.voidZones[i];
                            var y = parseInt(zone.y, 10);
                            var x = parseInt(zone.x, 10);
                            $scope.voidZones.lines[y+center][x+center].value = true;
                        }
                    }
		        });
	        });         
    }else{
      	$scope.rivet = new Object();
        $scope.rivet.voidZones = [];
    }
	
    $scope.form.enabled = true;
    $scope.voidZones = {width:width, lines:[]};

    var voidZones = $scope.voidZones.lines;
    var center = Math.floor(width/2);
    
    //initialize the array to false
    for(var x = 0; x < width; x++) {
        var line = [];
        voidZones.push(line);
        for(var y=0; y < width; y++){
            line[y] ={value: (y===center) && (x===center)};
        }
    }

    // Save function              
    $scope.save = function(){
        var rivet = $scope.rivet;
        rivet.voidZones = [];
        var width = $scope.voidZones.lines.length;
        var center = Math.floor(width/2);
        for(var x = 0; x < width; x++) {
            for(var y=0; y < width; y++){
                var line = $scope.voidZones.lines;
                if (line[y][x].value ===true){
                    rivet.voidZones.push({x: x-center, y: y-center});
                }
            }
        }
        

        gapi.client.rivet.rivet.add($scope.rivet).execute(function(resp){
		    $scope.$apply(function(){
                    $location.url("/listRivets");
		    });
        });
    };

	$scope.delete = function(){
        var id = $scope.rivet.rivetId; 
	    gapi.client.rivet.delete({key: id}).execute(function(resp){
            $scope.$apply(function(){
                $location.url("/listRivets");
             });        
        });	
	}
  });
