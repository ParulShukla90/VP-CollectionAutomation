"use strict"

angular.module("PaymentMilestone")

.factory('paymentMilestoneService', ['$http', 'communicationService', function($http, communicationService) {

	var service = {};
	service.reasonsForChange = function(callback) {
		communicationService.resultViaGet(webservices.reasonsForChange, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response);
		});
	}

	service.saveMilestones = function(inputJsonString, callback) {
		communicationService.resultViaPost(webservices.saveMilestones, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response);
		});
	}
	service.paymentMilestones = function(inputJsonString, callback) {
		communicationService.resultViaPost(webservices.paymentMilestones, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response);
		});
	}

	return service;
}]);
