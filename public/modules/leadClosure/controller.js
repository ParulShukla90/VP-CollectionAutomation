"use strict";
angular.module('leadClosure', [])
taxiapp.controller("leadClosureController", ['$scope', '$rootScope','$localStorage',function($scope, $rootScope,$localStorage){
    /*Default functionality running for session management*/
	if($localStorage.userLoggedIn) {
		$rootScope.userLoggedIn = true;
		$rootScope.loggedInUser = $localStorage.loggedInUsername;
	}
	else {
		$rootScope.userLoggedIn = false;
	}
    $scope.step =1;
    
    $scope.closure = {};
    $scope.closure.newClosure = true;
    $scope.closure.bp = 1;
    $scope.closure.sp = 1;
    $scope.closure.type = 1;
    $scope.closure.teamEffort = true;
    $scope.closure.bko = 1;
    
    
    $scope.changeStep = function(step){
        console.log(typeof step,step);
        $scope.step = step;
    }
}]);