"use strict";
angular.module('PaymentMilestone', [])
taxiapp.controller("paymentMilestoneController", ['$scope', '$rootScope','$localStorage','paymentMilestoneService',function($scope, $rootScope,$localStorage,paymentMilestoneService){
	$scope.selectedProject = {};
	$scope.projects = {};
	$scope.currDate = new Date();
	$scope.currDate = moment();
	$scope.parentResource = {};
	$scope.fcmData = [];
	$scope.format = 'MMM d, y';
	$scope.dateOptions = {
		minDate:new Date(),
		'show-button-bar' : false		
	}
	$scope.removedHourlyIds  = [];
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
	
	$scope.openCalenderMM = function(index){
		//console.log(index)
		setTimeout(function(){
			$scope.mmData[index].isOpen = true;
			//console.log($scope.mmData[index]);
			$scope.$apply();
		},20)
		
	}
	
	$scope.openCalenderFCM = function(index){
		setTimeout(function(){
			$scope.fcmData[index].isOpen = true;
			$scope.$apply();
		},20)
		
	}
	
	$scope.reasons = [] ;
	$scope.getReasons = function(){
		paymentMilestoneService.reasonsForChange(function(response){
			console.log(response);
			if(response.status == 200){
				$scope.reasons = response.data;
			}else{
				$scope.pop('error', 'Error', response.data.msg)
				//alert(response.data.msg);
			}
		})
	}
	$scope.getReasons();
	
	$scope.projects.val = [
		{_id:1,name:'LifeShareCare FC',budget: 22000,type:1,startDate:new Date('09/09/2016').setHours(0,0,0,0),endDate:new Date('02/12/2017').setHours(0,0,0,0),bdg : 'Rohit Verma',resources:2,tech:4,advance : 0,totalHours:1200,dailyLimit : 9,milestones : milestones},
		{_id:2,name:'Echolimousine TSK',budget: 25000,type:2,startDate:new Date('11/10/2016').setHours(0,0,0,0),endDate:new Date('02/02/2017').setHours(0,0,0,0),bdg : 'Nidhi Thakur',resources:2,tech:4,hourlyRate:12,totalHours:500,dailyLimit : 9},
		{_id:3,name: 'CollabMedia MM',budget:30000,type:3,startDate:new Date('07/09/2016').setHours(0,0,0,0),endDate:new Date('01/12/2017').setHours(0,0,0,0),bdg : 'Rahul Sharma',resources:2,tech:4,months :3,monthlyAmount :4000}
	]
	
	/*Default functionality running for session management*/
	if($localStorage.userLoggedIn) {
		$rootScope.userLoggedIn = true;
		$rootScope.loggedInUser = $localStorage.loggedInUsername;
	}
	else {
		$rootScope.userLoggedIn = false;
	}
	
	$scope.openDatePicker = function(index){
		$scope.fcmData[index].isOpen = true;
		setTimeout(function(){$scope.$apply()},1)
	}
	
	/* function that is called when selected project is changed*/
	$scope.onProjectChange = function(){
		$scope.removedHourlyIds = [];
		if($scope.selectedProject.hasOwnProperty('originalObject')){
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
					$scope.initMMData(data);
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
	
	$scope.initMMData = function(data){
		paymentMilestoneService.paymentMilestones({id:data._id},function(response){
			if(response.status == 200 && response.data.length > 0){
				$scope.selectedProject.originalObject.paymentSchedule = true;
				$scope.mmData = response.data;
				$scope.mmData.map(function(obj){
					obj.isNew = false;
					obj.isOpen = false;
					obj.payment = obj.amount;
					obj.date = new Date(obj.date)
				})
				return false;		
			}else if(response.status == 200 && response.data.length == 0){
				if(!data.resources || !data.months || !data.monthlyAmount){
					console.log('missing required information');
					return false;
				}
				$scope.mmData = [];
				$scope.addMmInvoice();
			}else{
				$scope.pop('error', 'Error', response.data.msg)
				//alert(response.data.msg);
			}
		})
	}
	
	$scope.addMmInvoice = function(){
		var maxMonths = $scope.selectedProject.originalObject.months * 2;
		if($scope.mmData.length >= maxMonths){
			var msg ='The project is of '+$scope.selectedProject.originalObject.months+' months. So, you can not have more than ' + maxMonths+' invoices.'
			$scope.pop('error', 'Error', msg)
			return;
		}
		var temp = {};
		temp.title = 'Invoice '+($scope.mmData.length+1);
		temp.payment = 0;
		temp.date = null;
		temp.isOpen = false;
		temp.isNew = true;
		$scope.mmData.push(temp);
	}
	
	$scope.remMmInvoice = function(index){
		if(index >= 0){
			if(confirm('Are you sure you want to delete this payment milestone?')){
				setTimeout(function(){
					$scope.mmData.splice(index,1);
					$scope.$apply();
				},1)
			}
		}
	}
	
	$scope.getTotalMmInvoice = function(check){
		var i = 0;
		$scope.mmPayment = 0;
		for(i = 0; i < $scope.mmData.length; i++){
			//console.log($scope.mmPayment,' + ',parseFloat($scope.mmData[i].payment),$scope.mmData)
			$scope.mmPayment = $scope.mmPayment + parseFloat($scope.mmData[i].payment);
		}
		if($scope.selectedProject.originalObject.budget < $scope.mmPayment){
			var msg = 'Total amount of payment milestones exceeds the budget by $'+ ($scope.mmPayment - $scope.selectedProject.originalObject.budget).toFixed(2);
			$scope.pop('error', 'Error', msg);
			return false;
		}
	}
	
	$scope.saveMmInvoice = function(){
		var i = 0;
		var j = 0;
		var index ;
		var milestoneNames = [];
		var flag = false;
		
		for(j = 0;j<$scope.mmData.length; j ++){
			if(milestoneNames.indexOf($scope.mmData[j].title) == -1){
				milestoneNames.push($scope.mmData[j].title);
			}else{
				flag = true;
			}
		}
		if(flag){
			var msg = 'You can not have duplicate milestone names.';
			$scope.pop('error', 'Error',msg)
			return;
		}
		$scope.mmPayment = 0;
		var flag1 = false;
		for(i =0; i < $scope.mmData.length; i++ ){
			$scope.mmData[i].isNew = false;
			$scope.mmData[i].isOpen= false;
			$scope.mmData[i].payment = parseFloat($scope.mmData[i].payment)
			$scope.mmData[i].amount = $scope.mmData[i].payment;
			if($scope.mmData[i].payment <1 ){
				flag1 = true;
			}
			$scope.mmPayment = $scope.mmPayment +parseFloat($scope.mmData[i].payment);
			
		}
		if(flag1){
			var msg = 'You can not have a milestone with amount $0.';
			$scope.pop('error', 'Error', msg);
			return;
		}
		if($scope.mmPayment > $scope.selectedProject.originalObject.budget){
			var msg = 'Total amount of payment milestones exceeds the budget by $'+ parseFloat(($scope.mmPayment - $scope.selectedProject.originalObject.budget).toFixed(2));
			$scope.pop('error', 'Error', msg);
			return;
		}else if($scope.mmPayment < $scope.selectedProject.originalObject.budget){
			var msg ='$'+ parseFloat(($scope.selectedProject.originalObject.budget-$scope.mmPayment ).toFixed(2))+ ' still remains unassigned.';
			$scope.pop('error', 'Error', msg);
			return;
		}
		var postdata ={
			data : $scope.mmData,
			projId :$scope.selectedProject.originalObject._id,
			projType :  $scope.selectedProject.originalObject.type
		}
		paymentMilestoneService.saveMilestones(postdata,function(response){
			if(response.status == 200){
				var msg = 'Payment schedule has been saved successfully';
				$scope.pop('success', 'Success', msg);
				$scope.selectedProject = {};
				$scope.$broadcast('angucomplete-alt:clearInput');
			}else{
				$scope.pop('error', 'Error', response.data.msg)
				//alert(response.data.msg);
			}
		});
	}
	
	/*======================================================================================*/
	/*=====================FUNCTIONS FOR FC(MILESTONE) PROJECTS=============================*/
	/*======================================================================================*/
	
	/*function to set data for fixed cost milestone projects*/
	$scope.setFCMData = function(data){
		paymentMilestoneService.paymentMilestones({id:data._id},function(response){
			$scope.fcmPayment = 0;
			if(response.status == 200 && response.data.length > 0){
				$scope.selectedProject.originalObject.paymentSchedule = true;
				$scope.fcmData = response.data;
				$scope.fcmData.map(function(obj){
					obj.isNew = false;
					obj.isOpen = false;
					obj.payment = obj.amount;
					obj.date = new Date(obj.date)
				})
				return false;		
			}else if(response.status == 200 && response.data.length == 0){
				if(!(data.advance>=0) || !data.startDate || !data.endDate || !data.resources || !data.totalHours){
					var msg = 'missing required information';
					$scope.pop('error', 'Error', msg);
					return false;
				}
				var weeklyData = [];
				var length = data.milestones.length;
				var i = 0;
				for(i = 0; i< length; i++){
					var temp = {};
					temp.title = data.milestones[i].title;
					temp.payment = null;
					temp.date = null;
					temp.isOpen = false;
					temp.isNew = false;
					weeklyData.push(temp);
				}
				$scope.fcmData = weeklyData;
				$scope.setPaymentsFC();
			}else{
				$scope.pop('error', 'Error', response.data.msg)
				//alert(response.data.msg);
			}
			
		})
		
	}
	
	/* function to set payment to be recieved for each payment milestone*/
	$scope.setPaymentsFC = function(){
		var data = angular.copy($scope.selectedProject.originalObject);
		var i = 0;
		var weeklydataLength = $scope.fcmData.length;
		var advance,paymentPerMilestone;
		advance = data.budget*(data.advance/100);
		paymentPerMilestone = data.budget/weeklydataLength;
		if(data.advance > 0){
			paymentPerMilestone = parseFloat(((data.budget-advance)/(weeklydataLength-1)).toFixed(2));
			$scope.fcmData[i].payment = advance;
			$scope.fcmPayment = advance;
		}
		if(weeklydataLength >1){
			for(i =0; i < weeklydataLength; i++){
				if(i == 0){
					if(data.advance == 0){
						$scope.fcmData[i].payment = paymentPerMilestone;
						$scope.fcmData[i].title = data.milestones[0].title;
					}else{
						$scope.fcmData[i].title = 'Advance / '+data.milestones[0].title;
					}
				}else{
					$scope.fcmData[i].payment = paymentPerMilestone;
				}
				$scope.fcmPayment = $scope.fcmPayment + parseFloat($scope.fcmData[i].payment);
			}
		}
		//$scope.getAllWeeksFCM();
	}
	
	$scope.reCalcFcmPayments = function(){
		var i = 0;
		var weeklydataLength = $scope.fcmData.length;
		$scope.fcmPayment = 0;
		for(i = 0; i < weeklydataLength; i++){
			$scope.fcmPayment = $scope.fcmPayment + parseFloat($scope.fcmData[i].payment);
		}
		if($scope.fcmPayment > $scope.selectedProject.originalObject.budget){
			var msg = 'Total amount of payment milestones exceeds the budget by $'+ ($scope.fcmPayment - $scope.selectedProject.originalObject.budget).toFixed(2);
			$scope.pop('error', 'Error', msg);
		}
	}
	
	/* */
	$scope.removeMilestone = function(index){
		if($scope.selectedProject.originalObject.advance > 0 && index == 0){
			var msg = 'You cannot remove advance milestone';
			$scope.pop('error', 'Error', msg);
			return;
		}
		if(confirm('Are you sure you want to delete this payment milestone?')){
			$scope.fcmPayment = 0;
			$scope.fcmData.splice(index,1);
			var i =0;
			for(i =0; i < $scope.fcmData.length; i++ ){
				$scope.fcmPayment = $scope.fcmPayment +parseFloat($scope.fcmData[i].payment);
			}
		}
	}
	$scope.addMilestone = function(index){
		var i =0;
		$scope.fcmPayment = 0;
		for(i =0; i < $scope.fcmData.length; i++ ){
			$scope.fcmPayment = $scope.fcmPayment +parseFloat($scope.fcmData[i].payment);
		}
		var temp = {};
		temp.title = 'Milestone '+($scope.fcmData.length+1);
		temp.payment = ($scope.selectedProject.originalObject.budget - $scope.fcmPayment) >0?parseFloat(($scope.selectedProject.originalObject.budget - $scope.fcmPayment).toFixed(2)):0 ;
		temp.date = null;
		temp.isOpen = false;
		temp.isNew = true;
		$scope.fcmData.push(temp);
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
			temp.title = 'Milestone '+ index;
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
			}
			temp.date = new Date(lastDate.days(5)).setHours(0,0,0,0);
			temp.acceptance = new Date(lastDate.days(5)).setDate(new Date(temp.date).getDate() + 14);
			temp.acceptance = new Date(temp.acceptance).setHours(0,0,0,0);
			if($scope.occupiedHrs < $scope.totalHrs){
				if(($scope.totalHrs - $scope.occupiedHrs) > (temp.days *  temp.resources * temp.dailyLimit)){
					temp.hrsThisWeek = temp.days *  temp.resources * temp.dailyLimit;
					$scope.occupiedHrs = $scope.occupiedHrs +temp.hrsThisWeek;
				}else{
					temp.hrsThisWeek = $scope.totalHrs - $scope.occupiedHrs;
					$scope.occupiedHrs = $scope.occupiedHrs + temp.hrsThisWeek;
					flag = true;
				}
			}else{
				temp.hrsThisWeek = $scope.totalHrs - $scope.occupiedHrs;
				$scope.occupiedHrs = $scope.occupiedHrs + temp.hrsThisWeek;
				flag = true;
			}
			weeklyData.push(temp);
			index++;
			if(lastDate < data.endDate ){
				
			}else{
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
			}
		}
		if($scope.occupiedHrs < $scope.totalHrs){
			var flag = false;
			var index = $scope.fcmData.length +1;
			var lastDate = moment($scope.fcmData[$scope.fcmData.length-1].date);
			while(flag == false){
				var temp = {};
				temp.title = 'Milestone '+ index;
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
		var milestoneNames = [];
		var flag = false;
		
		for(j = 0;j<$scope.fcmData.length; j ++){
			if(milestoneNames.indexOf($scope.fcmData[j].title) == -1){
				milestoneNames.push($scope.fcmData[j].title);
			}else{
				flag = true;
			}
		}
		if(flag){
			var msg = 'You can not have duplicate milestone names.';
			$scope.pop('error', 'Error', msg);
			return;
		}
		$scope.fcmPayment = 0;
		var flag1 = false;
		for(i =0; i < $scope.fcmData.length; i++ ){
			$scope.fcmData[i].isNew = false;
			$scope.fcmData[i].isOpen= false;
			//$scope.fcmData[i].date= new Date($scope.fcmData[i].date);
			$scope.fcmData[i].payment = parseFloat($scope.fcmData[i].payment);
			$scope.fcmData[i].amount = $scope.fcmData[i].payment;
			if($scope.fcmData[i].payment <1 ){
				flag1 = true;
			}
			$scope.fcmPayment = $scope.fcmPayment +parseFloat($scope.fcmData[i].payment);
			//for(j = 0; j < $scope.projects.val.length;j++){
			//	if($scope.selectedProject.originalObject._id == $scope.projects.val[j]._id){
			//		index = j;
			//	}
			//}
		}
		if(flag1){
			var msg = 'You can not have a milestone with amount $0.';
			$scope.pop('error', 'Error', msg);
			return;
		}
		if($scope.fcmPayment > $scope.selectedProject.originalObject.budget){
			var msg = 'Total amount of payment milestones exceeds the budget by $'+ parseFloat(($scope.fcmPayment - $scope.selectedProject.originalObject.budget).toFixed(2));
			$scope.pop('error', 'Error', msg);
			return;
		}else if($scope.fcmPayment < $scope.selectedProject.originalObject.budget){
			var msg = '$'+ parseFloat(($scope.selectedProject.originalObject.budget-$scope.fcmPayment ).toFixed(2))+ ' still remains unassigned.';
			$scope.pop('error', 'Error', msg);
			return;
		}
		var postdata ={
			data : $scope.fcmData,
			projId :$scope.selectedProject.originalObject._id,
			projType :  $scope.selectedProject.originalObject.type
		}
		paymentMilestoneService.saveMilestones(postdata,function(response){
				if(response.status == 200){
					var msg = 'Payment schedule has been saved successfully';
					$scope.pop('success', 'Success', msg);
					$scope.selectedProject = {};
					$scope.$broadcast('angucomplete-alt:clearInput');
					$scope.removedHourlyIds = [];
				}else{
					$scope.pop('error', 'Error', response.data.msg)
					//alert(response.data.msg);
				}
		});
	}
	
	/*======================================================================================*/
	/*======================FUNCTIONS FOR HOURLY PROJECTS===================================*/
	/*======================================================================================*/
	
	/* Set payment milestone data for */
	$scope.setHourlyData = function(data){
		paymentMilestoneService.paymentMilestones({id:data._id},function(response){
			if(response.status == 200 && response.data.length > 0){
				$scope.selectedProject.originalObject.paymentSchedule = true;
				$scope.hourlyData = response.data;
				$scope.occupiedHrs = 0;
				$scope.hourlyData.map(function(obj){
					$scope.occupiedHrs = $scope.occupiedHrs + obj.hrsThisWeek;
					obj.date = new Date(obj.date)
				})
				//alert(typeof response.data[0].date);
				return false;		
			}else if(response.status == 200 && response.data.length == 0){
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
					temp.title = 'Week '+ index;
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
			}else{
				$scope.pop('error', 'Error', response.data.msg)
				//alert(response.data.msg);
			}
			
		})
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
				if($scope.hourlyData[i]._id){
					$scope.removedHourlyIds.push($scope.hourlyData[i]._id)
				}
				$scope.hourlyData.splice(i,1);
				i--;
				//console.log('error--- come check ')
			}
		}
		if($scope.occupiedHrs < $scope.totalHrs){
			var flag = false;
			var index = $scope.hourlyData.length +1;
			var lastDate = moment($scope.hourlyData[$scope.hourlyData.length-1].date);
			while(flag == false){
				var temp = {}
				temp.title = 'Week '+ index;
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
		//for(i =0; i < $scope.hourlyData.length; i++ ){
		//	$scope.hourlyData[i].paymentDue = $scope.hourlyData[i].resources * ($scope.hourlyData[i].days- $scope.hourlyData[i].holidays) * $scope.hourlyData[i].dailyLimit * $scope.selectedProject.originalObject.hourlyRate;
		//	for(j = 0; j < $scope.projects.val.length;j++){
		//		if($scope.selectedProject.originalObject._id == $scope.projects.val[j]._id){
		//			index = j;
		//		}
		//	}
		//}
		//$scope.projects.val[index].paymentSchedule = $scope.hourlyData;
		
		for(i =0; i < $scope.hourlyData.length; i++ ){
			$scope.hourlyData[i].amount = $scope.hourlyData[i].hrsThisWeek * $scope.hourlyData[i].hourlyRate
		}
		var postdata ={
			data:$scope.hourlyData,
			projId :$scope.selectedProject.originalObject._id,
			projType :  $scope.selectedProject.originalObject.type
		}
		if($scope.removedHourlyIds.length > 0){
			postdata.removeIds = $scope.removedHourlyIds;
		}
		paymentMilestoneService.saveMilestones(postdata,function(response){
				console.log(response);
				if(response.status == 200){
					var msg = 'Payment schedule has been saved successfully';
					$scope.pop('success', 'Success', msg);
					$scope.selectedProject = {};
					$scope.$broadcast('angucomplete-alt:clearInput');
					$scope.removedHourlyIds = [];
				}else{
					$scope.pop('error', 'Error', response.data.msg)
					//alert(response.data.msg);
				}
		});
		
		
		
	}
	
	/* */
	$scope.parentResourceChange = function(type){
		var data = angular.copy($scope.selectedProject.originalObject);
		for(var i = 0; i< $scope[type].length; i++){
			if(data.paymentSchedule){
				if($scope[type][i].date >= $scope.currDate){
					$scope[type][i].resources = $scope.parentResource.val;
				}
			}else{
				//fresh case
				$scope[type][i].resources = $scope.parentResource.val;
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