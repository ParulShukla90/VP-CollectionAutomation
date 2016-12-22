"use strict";
angular.module('forecasting', [])
taxiapp.controller("forecastingController", ['$scope', 'toaster','$location','$rootScope','$localStorage',function($scope,toaster,$location,$rootScope,$localStorage){
    /*Default functionality running for session management*/
	if($localStorage.userLoggedIn) {
		$rootScope.userLoggedIn = true;
		$rootScope.loggedInUser = $localStorage.loggedInUsername;
	}
	else {
		$rootScope.userLoggedIn = false;
	}
    
    //console.log('forecasting');
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