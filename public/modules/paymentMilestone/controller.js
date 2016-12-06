"use strict";
angular.module('PaymentMilestone', [])
taxiapp.controller("paymentMilestoneController", ['$scope', '$rootScope','$localStorage',function($scope, $rootScope,$localStorage){
	$scope.selectedProject = {};
	$scope.projects = {};
	$scope.currDate = new Date();
	/*
	type: 1 -FC(Milestone) , 2 - hr, 3 - MM, 4- FC(Hourly)
	tech: 1 - OS, 2 - MG, 3 - MS, 4 - BD, 5 - Ionic
	*/
	$scope.projects.val = [
		{_id:1,name:'LifeShareCare FC',budget: 22000,type:1,startDate:new Date('09/09/2016'),endDate:new Date('12/12/2016'),bdg : 'Rohit Verma',resources:2,tech:4},
		{_id:2,name:'Echolimousine TSK',budget: 25000,type:2,startDate:new Date('11/10/2016'),endDate:new Date('02/02/2017'),bdg : 'Nidhi Thakur',resources:2,tech:4,hourlyRate:12,totalHours:500,dailyLimit : 9},
		{_id:3,name: 'CollabMedia MM',budget:30000,type:3,startDate:new Date('07/09/2016'),endDate:new Date('01/12/2017'),bdg : 'Rahul Sharma',resources:3,tech:4}
	]
	/*Default functionality running for session management*/
	if($localStorage.userLoggedIn) {
		$rootScope.userLoggedIn = true;
		$rootScope.loggedInUser = $localStorage.loggedInUsername;
	}
	else {
		$rootScope.userLoggedIn = false;
	}
	
	/* function that is called when selected project is changed*/
	$scope.onProjectChange = function(){
		console.log('selectedProject',$scope.selectedProject);
		if($scope.selectedProject.hasOwnProperty('originalObject')){
			switch($scope.selectedProject.originalObject.type){
				case 1:
					//get fixed cost data
					break;
				case 2:
					//get hourly data
					$scope.setHourlyData();
					break;
				case 3:
					//get man month data
					break;
				default:
					console.log('error');
			}
			
		}
	}
	
	/* Set payment milestone data for */
	$scope.setHourlyData = function(){
		var data = angular.copy($scope.selectedProject.originalObject);
		data.startDate = moment(data.startDate);
		data.endDate = moment(data.endDate);
		if(data.paymentSchedule){
			$scope.hourlyData = data.paymentSchedule;
			return false;	
		}
		if(!data.hourlyRate || !data.startDate || !data.endDate || !data.resources || !data.totalHours){
			console.log('missing required information')
			return false;
		}
		var flag = false;
		var weeklyData = [];
		//var totalHrs =
		var index = 1;
		var lastDate = null;
		$scope.occupiedHrs = 0;
		$scope.totalHrs = data.totalHours;
		while(flag == false){
			var temp = {}
			temp.name = 'Week '+ index;
			var currentDayOfWeek;
			if(lastDate){
				lastDate = lastDate.day(12);
				currentDayOfWeek = 1;
			}else{
				currentDayOfWeek = data.startDate.day();
				lastDate = data.startDate.day(5);
			}
			temp.days = (5-currentDayOfWeek)+1;
			temp.date = new Date(lastDate);
			temp.holidays = 0;
			temp.hourlyRate = data.hourlyRate;
			temp.resources = parseInt(data.resources);
			temp.dailyLimit = data.dailyLimit;
			if(data.endDate <= lastDate){
				lastDate = 	data.endDate;
				temp.days = (lastDate.day()-currentDayOfWeek)+1;
				temp.date = new Date(lastDate);	
			}
			if($scope.occupiedHrs < $scope.totalHrs){
				if(($scope.totalHrs - $scope.occupiedHrs) > (temp.days *  temp.resources * temp.dailyLimit)){
					temp.hrsThisWeek = temp.days *  temp.resources * temp.dailyLimit;
					$scope.occupiedHrs = $scope.occupiedHrs +(temp.days *  temp.resources * temp.dailyLimit);
				}else{
					temp.hrsThisWeek = $scope.totalHrs - $scope.occupiedHrs;
					$scope.occupiedHrs = $scope.occupiedHrs + ($scope.totalHrs - $scope.occupiedHrs);
					flag = true;
				}
			}else{
				temp.hrsThisWeek = $scope.totalHrs - $scope.occupiedHrs;
				$scope.occupiedHrs = $scope.occupiedHrs + ($scope.totalHrs - $scope.occupiedHrs);
				flag = true;
			}
			weeklyData.push(temp);
			index++;
			if(lastDate < data.endDate ){
				
			}else{
				flag = true;
			}
		}
		console.log('weeklyData--',weeklyData)
		$scope.hourlyData = weeklyData;
	}
	
	
	
	$scope.reCalcHourlyData = function(){
		var data = angular.copy($scope.selectedProject.originalObject);
		data.startDate = moment(data.startDate);
		data.endDate = moment(data.endDate);
		$scope.occupiedHrs = 0;
		$scope.totalHrs = $scope.selectedProject.originalObject.totalHours;
		for(var i = 0; i< $scope.hourlyData.length; i++){
			if($scope.occupiedHrs < $scope.totalHrs){
				if(($scope.totalHrs - $scope.occupiedHrs) > (($scope.hourlyData[i].days - $scope.hourlyData[i].holidays) *  $scope.hourlyData[i].resources * $scope.hourlyData[i].dailyLimit)){
					if(!($scope.hourlyData[i].date < $scope.currDate) || !data.paymentSchedule){
						$scope.hourlyData[i].dailyLimit = data.dailyLimit;
						$scope.hourlyData[i].hourlyRate = data.hourlyRate;
						$scope.hourlyData[i].hrsThisWeek =($scope.hourlyData[i].days - $scope.hourlyData[i].holidays) *  $scope.hourlyData[i].resources * $scope.hourlyData[i].dailyLimit;
					}
					$scope.occupiedHrs = $scope.occupiedHrs +($scope.hourlyData[i].days *  $scope.hourlyData[i].resources * $scope.hourlyData[i].dailyLimit);
				}else{
					if(!($scope.hourlyData[i].date < $scope.currDate) || !data.paymentSchedule){
						$scope.hourlyData[i].dailyLimit = data.dailyLimit;
						$scope.hourlyData[i].hourlyRate = data.hourlyRate;
						$scope.hourlyData[i].hrsThisWeek = $scope.totalHrs - $scope.occupiedHrs;
					}
					$scope.occupiedHrs = $scope.occupiedHrs + ($scope.totalHrs - $scope.occupiedHrs);
				}
			}else{
				$scope.hourlyData[i].hrsThisWeek = $scope.totalHrs - $scope.occupiedHrs;
				$scope.occupiedHrs = $scope.occupiedHrs + ($scope.totalHrs - $scope.occupiedHrs);
			}
			if($scope.hourlyData[i].hrsThisWeek == 0){
				$scope.hourlyData.splice(i,1);
				i--;
			}
		}
		if($scope.occupiedHrs < $scope.totalHrs){
			var flag = false;
			var index = $scope.hourlyData.length +1;
			var lastDate = $scope.hourlyData[$scope.hourlyData.length-1].date;
			while(flag == false){
				var temp = {}
				temp.name = 'Week '+ index;
				var currentDayOfWeek;
				if(lastDate){
					lastDate = lastDate.day(12);
					currentDayOfWeek = 1;
				}else{
					currentDayOfWeek = data.startDate.day();
					lastDate = data.startDate.day(5);
				}
				temp.days = (5-currentDayOfWeek)+1;
				temp.date = new Date(lastDate);
				temp.holidays = 0;
				temp.hourlyRate = data.hourlyRate;
				temp.resources = parseInt(data.resources);
				temp.dailyLimit = data.dailyLimit;
				if(data.endDate <= lastDate){
					lastDate = 	data.endDate;
					temp.days = (lastDate.day()-currentDayOfWeek)+1;
					temp.date = new Date(lastDate);	
				}
				if($scope.occupiedHrs < $scope.totalHrs){
					if(($scope.totalHrs - $scope.occupiedHrs) > (temp.days *  temp.resources * temp.dailyLimit)){
						temp.hrsThisWeek = temp.days *  temp.resources * temp.dailyLimit;
						$scope.occupiedHrs = $scope.occupiedHrs +(temp.days *  temp.resources * temp.dailyLimit);
					}else{
						temp.hrsThisWeek = $scope.totalHrs - $scope.occupiedHrs;
						$scope.occupiedHrs = $scope.occupiedHrs + ($scope.totalHrs - $scope.occupiedHrs);
						flag = true;
					}
				}else{
					temp.hrsThisWeek = $scope.totalHrs - $scope.occupiedHrs;
					$scope.occupiedHrs = $scope.occupiedHrs + ($scope.totalHrs - $scope.occupiedHrs);
					flag = true;
				}
				weeklyData.push(temp);
				index++;
				if(lastDate < data.endDate ){
					
				}else{
					flag = true;
				}
			}
		}
	}
	
	
	/* save payment scheduile for houly projects */
	$scope.saveHrlyMilestones = function(){
		var i = 0;
		var j = 0;
		var index ;
		for(i =0; i < $scope.hourlyData.length; i++ ){
			$scope.hourlyData[i].paymentDue = $scope.hourlyData[i].resources * ($scope.hourlyData[i].days- $scope.hourlyData[i].holidays) * $scope.hourlyData[i].dailyLimit * $scope.selectedProject.originalObject.hourlyRate;
			for(j = 0; j < $scope.projects.val.length;j++){
				if($scope.selectedProject.originalObject._id == $scope.projects.val[j]._id){
					index = j;
				}
			}
		}
		$scope.projects.val[index].paymentSchedule = $scope.hourlyData;
		console.log($scope.projects.val);
		alert('Payment schedule has been saved successfully');
		$scope.selectedProject = {};
	}
	
	/* watching change in selected project to detect changes and change UI accordingly*/
	$scope.$watch(function(){
		return $scope.selectedProject;
	},function(oldVal,newVal){
		$scope.onProjectChange();
	})
}]);