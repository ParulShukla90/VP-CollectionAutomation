"use strict"

angular.module("Payment")

.factory('PaymentService', ['$http', 'communicationService', function($http, communicationService) {

	var service = {};


	

	service.getBraintreeClientToken = function(callback) {
			communicationService.resultViaGet(webservices.getBraintreeClientToken, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});

	}

	service.addBraintreeCard = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.addBraintreeCard, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.createBraintreeTransaction = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.createBraintreeTransaction, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}
	service.addStripeCard = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.addStripeCard, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.createStripeTransaction = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.createStripeTransaction, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}
	service.addPaypalCard = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.addPaypalCard, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}
	service.createPaypalCardTransaction = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.createPaypalCardTransaction, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}
	service.createPaypalAccountTransaction = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.createPaypalAccountTransaction, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	return service;


}]);
