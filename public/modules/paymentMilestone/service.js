"use strict"

angular.module("PaymentMilestone")

.factory('paymentMilestoneService', ['$http', 'communicationService', function($http, communicationService) {

	var service = {};
	service.reasonsForChange = function(callback) {
			communicationService.resultViaGet(webservices.reasonsForChange, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});
	}

	service.addBraintreeCard = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.addBraintreeCard, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	return service;
}]);
