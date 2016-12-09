"use strict";
angular.module('PaymentMilestone', [])
taxiapp.controller("paymentMilestoneController", ['$scope', '$rootScope','$localStorage',function($scope, $rootScope,$localStorage){
	$scope.selectedProject = {};
	$scope.projects = {};
	$scope.currDate = new Date();
	$scope.parentResource = {};
	$scope.fcmData = [];
	/*
	type: 1 -FC(Milestone) , 2 - hr, 3 - MM, 4- FC(Hourly)
	tech: 1 - OS, 2 - MG, 3 - MS, 4 - BD, 5 - Ionic
	*/
	var milestones = [
		{title : 'Milestone 1'},
		{title : 'Milestone 2'},
		{title : 'Milestone 3'},
		{title : 'Milestone 4'},
		{title : 'Milestone 5'},
		{title : 'Milestone 6'},
		{title : 'Milestone 7'},
		{title : 'Milestone 8'},
		{title : 'Milestone 9'},
		{title : 'Milestone 10'},
	];
	
	$scope.projects.val = [
		{_id:1,name:'LifeShareCare FC',budget: 22000,type:1,startDate:new Date('09/09/2016').setHours(0,0,0,0),endDate:new Date('02/12/2017').setHours(0,0,0,0),bdg : 'Rohit Verma',resources:2,tech:4,advance : 0,totalHours:1200,dailyLimit : 9,milestones : milestones},
		{_id:2,name:'Echolimousine TSK',budget: 25000,type:2,startDate:new Date('11/10/2016').setHours(0,0,0,0),endDate:new Date('02/02/2017').setHours(0,0,0,0),bdg : 'Nidhi Thakur',resources:2,tech:4,hourlyRate:12,totalHours:500,dailyLimit : 9},
		{_id:3,name: 'CollabMedia MM',budget:30000,type:3,startDate:new Date('07/09/2016').setHours(0,0,0,0),endDate:new Date('01/12/2017').setHours(0,0,0,0),bdg : 'Rahul Sharma',resources:3,tech:4}
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
		if($scope.selectedProject.hasOwnProperty('originalObject')){
			//console.log('selectedProject',$scope.selectedProject);
			var data = angular.copy($scope.selectedProject.originalObject);
			data.startDate = moment(data.startDate);
			data.endDate = moment(data.endDate);
			$scope.parentResource.val = $scope.selectedProject.originalObject.resources;
			switch($scope.selectedProject.originalObject.type){
				case 1:
					//get fixed cost  milestone data
					$scope.setFCMData(data);
					break;
				case 2:
					//get hourly data
					$scope.setHourlyData(data);
					break;
				case 3:
					//get man month data
					break;
				default:
					console.log('error');
			}
			
		}
	}
	
	/*======================================================================================*/
	/*=====================FUNCTIONS FOR FC(MILESTONE) PROJECTS=============================*/
	/*======================================================================================*/
	
	/*function to set data for fixed cost milestone projects*/
	$scope.setFCMData = function(data){
		if(data.paymentSchedule){
			$scope.fcmData = data.paymentSchedule;
			return false;	
		}
		if(!data.advance || !data.startDate || !data.endDate || !data.resources || !data.totalHours){
			console.log('missing required information')
			return false;
		}
		var flag = false;
		var weeklyData = [];
		var index = 1;
		var lastDate = null;
		$scope.occupiedHrs = 0;
		$scope.totalHrs = data.totalHours;
		while(flag == false){
			var temp = {};
			temp.name = 'Milestone '+ index;
			var currentDayOfWeek;
			if(lastDate){
				lastDate = lastDate.day(12);
				currentDayOfWeek = 1;
			}else{
				currentDayOfWeek = data.startDate.day();
				lastDate = data.startDate.day(5);
			}
			temp.days = (5-currentDayOfWeek)+1;
			temp.start = new Date(lastDate.days(1)).setHours(0,0,0,0);
			temp.date = new Date(lastDate.days(5)).setHours(0,0,0,0);
			temp.weeks = 1;
			temp.holidays = 0;
			//temp.hourlyRate = data.hourlyRate;
			temp.resources = parseInt(data.resources);
			temp.dailyLimit = data.dailyLimit;
			if(data.endDate <= lastDate){
				lastDate = 	data.endDate;
				temp.days = (lastDate.day()-currentDayOfWeek)+1;
				temp.start = new Date(lastDate.days(1)).setHours(0,0,0,0);
				temp.date = new Date(lastDate.days(5)).setHours(0,0,0,0);	
			}
			temp.acceptance = new Date(lastDate.days(5)).setDate(new Date(temp.date).getDate() + 14);
			temp.acceptance = new Date(temp.acceptance).setHours(0,0,0,0);
			//temp.acceptance = temp.acceptance.setDate(temp.acceptance.getDate() + 14);
			if($scope.occupiedHrs < $scope.totalHrs){
				if(($scope.totalHrs - $scope.occupiedHrs) > (temp.days *  temp.resources * temp.dailyLimit)){
					//console.log(1);
					temp.hrsThisWeek = temp.days *  temp.resources * temp.dailyLimit;
					$scope.occupiedHrs = $scope.occupiedHrs +(temp.days *  temp.resources * temp.dailyLimit);
				}else{
					temp.hrsThisWeek = $scope.totalHrs - $scope.occupiedHrs;
					$scope.occupiedHrs = $scope.occupiedHrs + ($scope.totalHrs - $scope.occupiedHrs);
					//console.log(2);
					flag = true;
				}
			}else{
				console.log(3);
				temp.hrsThisWeek = $scope.totalHrs - $scope.occupiedHrs;
				$scope.occupiedHrs = $scope.occupiedHrs + ($scope.totalHrs - $scope.occupiedHrs);
				flag = true;
			}
			weeklyData.push(temp);
			index++;
			if(lastDate < data.endDate ){
				
			}else{
				console.log(4);
				flag = true;
			}
		}
		
		$scope.fcmData = weeklyData;
		$scope.setPaymentsFC();
	}
	
	/* function to set payment to be recieved for each payment milestone*/
	$scope.setPaymentsFC = function(){
		var data = angular.copy($scope.selectedProject.originalObject);
		var i = 0;
		var weeklydataLength = $scope.fcmData.length;
		var advance = data.budget*(data.advance/100);
		var paymentPerMilestone = (data.budget-advance)/(weeklydataLength-1);
		$scope.fcmData[0].payment = 0;
		if(weeklydataLength >1){
			for(i =1; i < weeklydataLength; i++){
				$scope.fcmData[i].payment = paymentPerMilestone;
			}
		}
		$scope.getAllWeeksFCM();
	}
	
	
	/* */
	$scope.addWeekFCM = function(index){
		if(($scope.fcmData.length -1) == index){
			alert('You can not add week to this milestone');
			return;
		}
		$scope.fcmData[index].weeks = 2;
		$scope.addRemWeekFCM();
	}
	$scope.removeWeekFCM = function(index){
		$scope.fcmData[index].weeks = 1;
		$scope.addRemWeekFCM();
	}
	
	$scope.getAllWeeksFCM = function(){
		var i = 0;
		var fcmLength = $scope.fcmData.length;
		var start = moment($scope.fcmData[0].date);
		var end = moment($scope.fcmData[fcmLength-1].date);
		end = end.add(14,'days');
		$scope.fcmWeeks = [];
		while(start <= end){
			var temp = {};
			temp.start = new Date(start.days(1)).setHours(0,0,0,0);
			temp.end = new Date(start.days(5)).setHours(0,0,0,0);
			start = start.add(7,'days');
			$scope.fcmWeeks.push(temp);
		}
	}
	
	
	$scope.addRemWeekFCM = function(){
		var data = angular.copy($scope.selectedProject.originalObject);
		data.startDate = moment(data.startDate);
		data.endDate = moment(data.endDate);
		var flag = false;
		var weeklyData = [];
		var index = 1;
		var lastDate = null;
		$scope.occupiedHrs = 0;
		$scope.totalHrs = data.totalHours;
		while(flag == false){
			var temp = {};
			temp.name = 'Milestone '+ index;
			var weeks = $scope.fcmData[index-1] ? $scope.fcmData[index-1].weeks : 1 ;
			var currentDayOfWeek;
			if(lastDate){
				lastDate = lastDate.day(12);
				currentDayOfWeek = 1;
			}else{
				currentDayOfWeek = data.startDate.day();
				lastDate = data.startDate.day(5);
			}
			temp.days = (5-currentDayOfWeek)+1;
			temp.weeks = weeks;
			temp.holidays = $scope.fcmData[index-1]?$scope.fcmData[index-1].holidays : 0;
			temp.resources = parseInt($scope.fcmData[index-1] ? $scope.fcmData[index-1].resources : data.resources);
			temp.dailyLimit = data.dailyLimit;
			if(data.endDate <= lastDate){
				lastDate = 	data.endDate;
				temp.days = (lastDate.day()-currentDayOfWeek)+1;
				temp.date = new Date(lastDate.days(5)).setHours(0,0,0,0);	
			}
			temp.start = new Date(lastDate.days(1)).setHours(0,0,0,0);
			if(weeks > 1){
				//if(($scope.totalHrs - $scope.occupiedHrs) > (temp.days *  temp.resources * temp.dailyLimit)){
					var x=1;
					for(x = 1; x < weeks; x++){
						lastDate = lastDate.day(12);
						currentDayOfWeek = 1;
						if(data.endDate <= lastDate){
							lastDate = 	data.endDate;
							temp.days = temp.days + (lastDate.day()-currentDayOfWeek)+1;
							break;
						}else{
							temp.days = temp.days+(5-currentDayOfWeek)+1;
						}
					}
				//}
			}
			temp.date = new Date(lastDate.days(5)).setHours(0,0,0,0);
			temp.acceptance = new Date(lastDate.days(5)).setDate(new Date(temp.date).getDate() + 14);
			temp.acceptance = new Date(temp.acceptance).setHours(0,0,0,0);
			//temp.acceptance = temp.acceptance.setDate(temp.acceptance.getDate() + 14);
			if($scope.occupiedHrs < $scope.totalHrs){
				//console.log(temp.days,' *  ',temp.resources,' * ',temp.dailyLimit)
				if(($scope.totalHrs - $scope.occupiedHrs) > (temp.days *  temp.resources * temp.dailyLimit)){
					console.log(1);
					temp.hrsThisWeek = temp.days *  temp.resources * temp.dailyLimit;
					$scope.occupiedHrs = $scope.occupiedHrs +temp.hrsThisWeek;
				}else{
					console.log(2);
					temp.hrsThisWeek = $scope.totalHrs - $scope.occupiedHrs;
					$scope.occupiedHrs = $scope.occupiedHrs + temp.hrsThisWeek;
					flag = true;
				}
			}else{
				
				console.log(3);
				temp.hrsThisWeek = $scope.totalHrs - $scope.occupiedHrs;
				$scope.occupiedHrs = $scope.occupiedHrs + temp.hrsThisWeek;
				flag = true;
			}
			weeklyData.push(temp);
			index++;
			if(lastDate < data.endDate ){
				
			}else{
				console.log(4);
				flag = true;
			}
		}
		
		$scope.fcmData = weeklyData;
		$scope.setPaymentsFC();
	}
	/**/
	$scope.reCalcFCMData = function(){
		var data = angular.copy($scope.selectedProject.originalObject);
		data.startDate = moment(data.startDate);
		data.endDate = moment(data.endDate);
		$scope.occupiedHrs = 0;
		$scope.totalHrs = data.totalHours;
		for(var i = 0; i< $scope.fcmData.length; i++){
			if(data.paymentSchedule){
				if($scope.fcmData[i].date >= $scope.currDate){
					$scope.fcmData[i].dailyLimit = data.dailyLimit;
				}
			}else{
				$scope.fcmData[i].dailyLimit = data.dailyLimit;
			}
			console.log($scope.occupiedHrs,'< ',$scope.totalHrs)
			if($scope.occupiedHrs < $scope.totalHrs){
				if(($scope.totalHrs - $scope.occupiedHrs) > (($scope.fcmData[i].days - $scope.fcmData[i].holidays) *  $scope.fcmData[i].resources * $scope.fcmData[i].dailyLimit)){
					if(!data.paymentSchedule || $scope.fcmData[i].date >= $scope.currDate){
						$scope.fcmData[i].hrsThisWeek = ($scope.fcmData[i].days - $scope.fcmData[i].holidays) *  $scope.fcmData[i].resources * $scope.fcmData[i].dailyLimit;
					}
				}else{
					if(!data.paymentSchedule || $scope.fcmData[i].date >= $scope.currDate){
						$scope.fcmData[i].hrsThisWeek = $scope.totalHrs - $scope.occupiedHrs;
					}
				}
				$scope.occupiedHrs = $scope.occupiedHrs + $scope.fcmData[i].hrsThisWeek;
			}else{
				$scope.fcmData.splice(i,1);
				i--;
				console.log('error--- come check ')
			}
		}
		if($scope.occupiedHrs < $scope.totalHrs){
			var flag = false;
			var index = $scope.fcmData.length +1;
			var lastDate = moment($scope.fcmData[$scope.fcmData.length-1].date);
			while(flag == false){
				var temp = {};
				temp.name = 'Milestone '+ index;
				var currentDayOfWeek;
				if(lastDate){
					lastDate = lastDate.day(12);
					currentDayOfWeek = 1;
				}else{
					currentDayOfWeek = data.startDate.day();
					lastDate = data.startDate.day(5);
				}
				temp.days = (5-currentDayOfWeek)+1;
				temp.start = new Date(lastDate.days(1)).setHours(0,0,0,0);
				temp.date = new Date(lastDate.days(5)).setHours(0,0,0,0);
				temp.weeks = 1;
				temp.holidays = 0;
				temp.resources = parseInt($scope.parentResource.val);
				temp.dailyLimit = data.dailyLimit;
				if(data.endDate <= lastDate){
					lastDate = 	data.endDate;
					temp.days = (lastDate.day()-currentDayOfWeek)+1;
					temp.start = new Date(lastDate.days(1)).setHours(0,0,0,0);
					temp.date = new Date(lastDate.days(5)).setHours(0,0,0,0);
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
				$scope.fcmData.push(temp);
				index++;
				if(lastDate < data.endDate ){
					
				}else{
					console.log(4);
					flag = true;
				}
			}
		}
		$scope.setPaymentsFC();
	}
	
	/* save payment scheduile for houly projects */
	$scope.saveFCMMilestones = function(){
		var i = 0;
		var j = 0;
		var index ;
		for(i =0; i < $scope.fcmData.length; i++ ){
			for(j = 0; j < $scope.projects.val.length;j++){
				if($scope.selectedProject.originalObject._id == $scope.projects.val[j]._id){
					index = j;
				}
			}
		}
		$scope.projects.val[index].paymentSchedule = $scope.fcmData;
		alert('Payment schedule has been saved successfully');
		$scope.selectedProject = {};
	}
	
	/*======================================================================================*/
	/*======================FUNCTIONS FOR HOURLY PROJECTS===================================*/
	/*======================================================================================*/
	
	/* Set payment milestone data for */
	$scope.setHourlyData = function(data){
		
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
		$scope.hourlyData = weeklyData;
	}
	
	
	
	$scope.reCalcHourlyData = function(){
		var data = angular.copy($scope.selectedProject.originalObject);
		data.startDate = moment(data.startDate);
		data.endDate = moment(data.endDate);
		$scope.occupiedHrs = 0;
		$scope.totalHrs = $scope.selectedProject.originalObject.totalHours;
		for(var i = 0; i< $scope.hourlyData.length; i++){
			if(data.paymentSchedule){
				//saved case
				//console.log($scope.hourlyData[i].date < $scope.currDate)
				if($scope.hourlyData[i].date >= $scope.currDate){
					$scope.hourlyData[i].dailyLimit = data.dailyLimit;
					$scope.hourlyData[i].hourlyRate = data.hourlyRate;
				}
			}else{
				//fresh case
				$scope.hourlyData[i].dailyLimit = data.dailyLimit;
				$scope.hourlyData[i].hourlyRate = data.hourlyRate;
			}
			if($scope.occupiedHrs < $scope.totalHrs){
				if(($scope.totalHrs - $scope.occupiedHrs) > (($scope.hourlyData[i].days - $scope.hourlyData[i].holidays) *  $scope.hourlyData[i].resources * $scope.hourlyData[i].dailyLimit)){
					if(!data.paymentSchedule || $scope.hourlyData[i].date >= $scope.currDate){
						$scope.hourlyData[i].hrsThisWeek = ($scope.hourlyData[i].days - $scope.hourlyData[i].holidays) *  $scope.hourlyData[i].resources * $scope.hourlyData[i].dailyLimit;
					}
				}else{
					if(!data.paymentSchedule || $scope.hourlyData[i].date >= $scope.currDate){
						$scope.hourlyData[i].hrsThisWeek = $scope.totalHrs - $scope.occupiedHrs;
					}
				}
				$scope.occupiedHrs = $scope.occupiedHrs + $scope.hourlyData[i].hrsThisWeek;
			}else{
				$scope.hourlyData.splice(i,1);
				i--;
				console.log('error--- come check ')
			}
		}
		if($scope.occupiedHrs < $scope.totalHrs){
			var flag = false;
			var index = $scope.hourlyData.length +1;
			var lastDate = moment($scope.hourlyData[$scope.hourlyData.length-1].date);
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
				$scope.hourlyData.push(temp);
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
		alert('Payment schedule has been saved successfully');
		$scope.selectedProject = {};
	}
	
	/* */
	$scope.parentResourceChange = function(type){
		console.log($scope[type].length,type,$scope.parentResource.val)
		var data = angular.copy($scope.selectedProject.originalObject);
		for(var i = 0; i< $scope[type].length; i++){
			if(data.paymentSchedule){
				if($scope[type][i].date >= $scope.currDate){
					$scope[type][i].resources = $scope.parentResource.val;
				}
			}else{
				//fresh case
				console.log($scope[type][i].resources,$scope.parentResource.val)
				$scope[type][i].resources = $scope.parentResource.val;
				console.log($scope[type][i].resources);
			}
		}
		switch(type){
			case 'hourlyData' :
				$scope.reCalcHourlyData();
				break;
			case 'fcmData' :
				$scope.reCalcFCMData();
				break;
			default:
				break;
		}
	}
	
	/* watching change in selected project to detect changes and change UI accordingly*/
	$scope.$watch(function(){
		return $scope.selectedProject;
	},function(oldVal,newVal){
		$scope.onProjectChange();
	})
}]);