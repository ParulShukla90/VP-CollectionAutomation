"use strict";

angular.module("Authentication", []);
angular.module("Home", []);
angular.module("communicationModule", []);
angular.module("PaymentMilestone", []);
angular.module('Payment', ['angularPayments', 'braintree-angular', 'stripe'])

var taxiapp = angular.module('taxiapp', ['ngRoute', 'ngStorage', 'ngTable', 'ngResource', 'ui.grid', 'Authentication', 'Home',  'communicationModule', 'satellizer',  'Payment' ,'chart.js','PaymentMilestone','angucomplete','ui.bootstrap'])

.factory('basicAuthenticationInterceptor', function() {
	
	var basicAuthenticationInterceptor = {
		request:function(config) {
			config.headers['Authorization'] = 'Basic ' + appConstants.authorizationKey;
 			config.headers['Content-Type'] = headerConstants.json;
	
			return config;
		}
	};

	return basicAuthenticationInterceptor;
	
})

.config(['$routeProvider', '$httpProvider', '$authProvider', '$locationProvider', function($routeProvider, $httpProvider, $authProvider, $locationProvider) {

	//$httpProvider.interceptors.push('basicAuthenticationInterceptor');
	Stripe.setPublishableKey('pk_test_Iuf7VPeNfp1PHWZFn9Q27hmQ');
	

	$routeProvider
	.when('/', {
		controller:'homeController',
		templateUrl:'/modules/home/views/home.html'
	})

	.when('/home', {
		controller:'homeController',
		templateUrl:'/modules/home/views/home.html'
	})

	.when('/login', {
		controller:'loginController',
		templateUrl:'/modules/authentication/views/login.html'
	})

	.when('/paymentMilestone', {
	   controller : "paymentMilestoneController",
	   templateUrl : "/modules/paymentMilestone/views/paymentMilestone.html"
	})

	// .when('/card/add', {
	// 	controller : "paymentController",
	// 	templateUrl : "/modules/payment/views/add_card.html"
	// })

	.otherwise({
		redirectTo:'/'
	});

	//to remove the # from the URL
	//$locationProvider.html5Mode({enabled : true, requireBase : false});
}])

.run(['$rootScope', '$location', '$http', '$localStorage','datepickerPopupConfig','datepickerConfig', function($rootScope, $location, $http, $localStorage,datepickerPopupConfig,datepickerConfig) {
	datepickerPopupConfig.showWeeks = false;
	//datepickerConfig.minDate = new Date();
	//datepickerPopupConfig.minDate = new Date();
	if(!$localStorage.userLoggedIn) {
		$location.path('/login');
	}
}]);
