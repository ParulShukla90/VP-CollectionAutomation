"use strict";
angular.module('main', [])
taxiapp.controller("mainCtrl", ['$scope', 'toaster','$location',function($scope,toaster,$location){
    console.log('main')
	$scope.pop = function(msgClass, title, msg) {
		toaster.pop(msgClass, title, msg);
	};
    
    $scope.checkState = function(path){
        var currPath = $location.path();
        if(path == currPath){
            return true;
        }else{
            return false;
        }
    }
}]);