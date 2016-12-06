	"use strict";

    angular.module('Payment', ['angularPayments','braintree-angular','stripe'])
    .constant('clientTokenPath', '/payment/clientToken');

	taxiapp.controller("paymentController", ['$scope', '$rootScope', '$localStorage','PaymentService', 'ngTableParams', '$routeParams', '$route','$location', '$braintree','$window',  function($scope, $rootScope, $localStorage,  PaymentService, ngTableParams, $routeParams, $route, $location, $braintree, $window){

		
		if($localStorage.userLoggedIn) {
			$rootScope.userLoggedIn = true;
			$rootScope.loggedInUser = $localStorage.loggedInUsername;
		}
		else {
			$rootScope.userLoggedIn = false;
		}

		 $scope.paypalType = [{id: 1, name:'Pay through Card'}, {id:2, name:'Pay through Paypal account'}];
		if($rootScope.message != "") {

			$scope.message = $rootScope.message;
		}

		//empty the $scope.message so the field gets reset once the message is displayed.
		$scope.message = "";
		$scope.card = {number: "", name: "", expiry: null, cvc: "", amount: ""}
		$scope.paypalCard = {number: "", first_name: "", last_name: "", expiry: null, cvv2: "", amount: "",expire_month: "", expire_year: "", type:""}
		$scope.paymentType = [{id: 0, name: "Braintree"},{id: 1, name: "Stripe"},{id: 2, name: "Paypal"}];
		$scope.itemKey = 0;
		$scope.paypalData = {id: ""};
		$scope.paypentTypeForpaypal = 0;




			$scope.changePaymentMethod = function(payment){
				$scope.itemKey =payment.id;
				if(payment.id == 1){
					$scope.stripeCounter = 0;
				}
		       }

			/*
			 * -----------------------------------------------------------------------------
			 * Implement Braintree payment
			 * Methods: getClientToken,payButtonClicked
			 * Output :
			 * -----------------------------------------------------------------------------
			 */


			$scope.getClientToken = function(){
			PaymentService.getBraintreeClientToken(function(response) {
				console.log(response);
			if(response.messageId == 200) {
				$scope.clientToken = response.data.clientToken;
				$scope.client = new $braintree.api.Client({
          		clientToken: response.data.clientToken
             });
			}	
			});
		}

		$scope.validateForm = function() {
					console.log($scope.card)
                     if($scope.card.number == "" || $scope.number){
						$scope.message =  messagesConstants.enterCardNumber;
                        return false;
                    }  
                    else if($scope.card.expiry == "" || $scope.card.expiry == null) {
                    	$scope.message =  messagesConstants.enterCardExpiry;
                        return false;
                    }
                     else if($scope.card.name == "") {
                    	$scope.message =  messagesConstants.enterCardName;
                        return false;
                    }
                     else if($scope.card.cvc == "") {
                    	$scope.message =  messagesConstants.enterCardCVC;
                        return false;
                    }
                    else if($scope.card.amount == "") {
                    	$scope.message =  messagesConstants.enterCardAmount;
                        return false;
                    }
                
                return true;
            }


				 $scope.payButtonClicked = function() {
			      if(!$scope.validateForm()) {
			                    return;
			                }
			      $scope.message = "";
			      $scope.loading = true;
			      $scope.client.tokenizeCard({
			        number: $scope.card.number,
			        expirationDate: $scope.card.expiry,
			      }, function (err, nonce) {
			      	console.log(nonce);
			        // - Send nonce to your server (e.g. to make a transaction or to save card)
			        $scope.nonce =  nonce;
			       var inputJsonString = {nonceData: {paymentMethodNonce: $scope.nonce}};
			        PaymentService.addBraintreeCard(inputJsonString, function(response) {
							console.log(response);
						if(response.messageId == 200) {
							console.log(response)
							var paymentToken = response.data.payment_token;
							//Creating transaction
							console.log($scope.card)
							var inputJsonString = {paymentToken: paymentToken, amount: $scope.card.amount};
						PaymentService.createBraintreeTransaction(inputJsonString, function(response) {
						console.log(response);
						$scope.loading = false;
						if(response.messageId == 200) {
							console.log(messagesConstants.paymentSuccess); 
							$scope.message = messagesConstants.paymentSuccess;
							$scope.card = {};
						}
						else{
							$scope.message = response.message;
							$scope.card = {};
						}
							});
						}
						
						else{
							$scope.loading = false;
							$scope.message = response.message;
						}
			      });
			    });
			    };


            /*
			 * -----------------------------------------------------------------------------
			 * Implement Stripe payment
			 * Methods: getDate,saveCustomer
			 * Output :
			 * -----------------------------------------------------------------------------
			 */


				$scope.getDate = function(){
				  	console.log($scope.card.expiry);
				  	var dateString = $scope.card.expiry.split('/')
				  	$scope.month = dateString[0]
				  	$scope.year = dateString[1]
		           }

				$scope.saveCustomer = function(status, response) {
					$scope.message = "";
					$scope.loading = true;
					++$scope.stripeCounter
					if($scope.stripeCounter == 2){
						if(response.id){
							$scope.stripeCounter = 0;
							var inputJsonString = {stripetoken : response.id}
							PaymentService.addStripeCard(inputJsonString, function(response) {
							console.log(response);
							if(response.messageId == 200) {
								var customerId = response.data.customer_id;
								//Creating transaction
								var inputJsonString = {customerId: customerId, amount: $scope.card.amount};
							PaymentService.createStripeTransaction(inputJsonString, function(response) {
							console.log(response);
							if(response.messageId == 200) {
								 $scope.loading = false;
								$scope.message = messagesConstants.paymentSuccess;
								// $route.reload()
							}
							else{
								$scope.message = response.message.message;
							}
								});
							}
						});
						}
						else{
							$scope.message = response.error.message;
							console.log('ERROR')
							$scope.stripeCounter = 0;
						}
					}

				  };
 

 			/*
			 * -----------------------------------------------------------------------------
			 * Implement Stripe payment
			 * Methods: getDate,saveCustomer
			 * Output :
			 * -----------------------------------------------------------------------------
			 */
  

			  $scope.getPaypalDate = function(){
			  	var dateString = $scope.paypalCard.expiry.split('/')
			  	$scope.paypalCard.expire_month = dateString[0]
			  	$scope.paypalCard.expire_year = dateString[1]
			  }
    

				$scope.getPaymentTypefromPaypal = function(){
					$scope.paypentTypeForpaypal = $scope.paypalData.id;
					console.log($scope.paypentTypeForpaypal)
				}

				

					$scope.validatePaypalForm = function() {
					console.log($scope.paypalCard)
                     if($scope.paypalCard.number == "" || $scope.paypalCard.number == undefined){
						$scope.message =  messagesConstants.enterCardNumber;
                        return false;
                    }  
                    else if($scope.paypalCard.expiry == "" || $scope.paypalCard.expiry == null) {
                    	$scope.message =  messagesConstants.enterCardExpiry;
                        return false;
                    }
                    else if($scope.paypalCard.first_name == "") {
                    	$scope.message =  messagesConstants.enterCardFirstName;
                        return false;
                    }
                    else if($scope.paypalCard.last_name == "") {
                    	$scope.message =  messagesConstants.enterCardLastName;
                        return false;
                    }
                     else if($scope.paypalCard.cvv2 == "") {
                    	$scope.message =  messagesConstants.enterCardCVC;
                        return false;
                    }
                    else if($scope.paypalCard.amount == "") {
                    	$scope.message =  messagesConstants.enterCardAmount;
                        return false;
                    }
                
                return true;
            }


            $scope.payPalButtonClicked = function(type){
            	if(type == 1){
            	 if(!$scope.validatePaypalForm()) {
                    return;
                }
                $scope.message = "";
                $scope.loading = true;
	            $scope.paypalCard.type = $scope.cardType;
			    var inputJsonString = {card: {credit_card: {number: $scope.paypalCard.number, first_name: $scope.paypalCard.first_name,type:$scope.paypalCard.type,
			     last_name: $scope.paypalCard.last_name, cvv2: $scope.paypalCard.cvv2, expire_month: $scope.paypalCard.expire_month,expire_year: $scope.paypalCard.expire_year}}, amount: $scope.paypalCard.amount};
			    PaymentService.createPaypalCardTransaction(inputJsonString, function(response) {
		    	console.log(response);
		    	if(response.messageId == 200) {
		    		console.log(response);
		    		 $scope.loading = false;
		    		$scope.message = messagesConstants.paymentSuccess;
		    	}
		        });
			}
		        if(type == 2){
		        $scope.loading = true;
				var inputJsonString = {amount: $scope.paypalCard.amount}
				PaymentService.createPaypalAccountTransaction(inputJsonString, function(response) {
					console.log(response);
		    	if(response.messageId == 200) {
		    		 $scope.loading = false;
		    		$window.location.href = response.data;
		    		$scope.paypalCard = {}
		    	}
		        });
			}
            }

            $scope.getType = function(type){
            	$scope.cardType = type;
            	return type
            }
		

	}

	]);