
var braintree = require('braintree');
 var constantObj = require('./../../../constants.js');



/*
 * -----------------------------------------------------------------------------
 * Add new customer or card to braintree
 * Input : nonce with customer information
 * Output :
 * -----------------------------------------------------------------------------
 */
exports.addNewCard = function (req, res){
    var paymentGatewaySettings = {};
    console.log(req.body);
    var nonceData = req.body.nonceData
    paymentGatewaySettings = constantObj.brainTreeSettings.key;
    paymentGatewaySettings.environment = braintree.Environment[constantObj.brainTreeSettings.environment];
    var gateway = braintree.connect(
        paymentGatewaySettings
    );
    
    gateway.customer.create(nonceData, function (err, resultFromGateway) {
    console.log(err);
    console.log(resultFromGateway);
        if (err) {
           var outputJSON = {'status':'failure', 'messageId':203, 'message': err};
           res.jsonp(outputJSON);  
        }
        else if (resultFromGateway['errors']) {
            var response = constantObj.messages.braintreeFailure;
            var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.braintreeFailure};
            res.jsonp(outputJSON);  
        }
        else {
            var cardArray = resultFromGateway['customer']['creditCards'].length;
            var timestamp = new Date();
            if (cardArray > 0) {
                var cardInformation = {
                    card_name: resultFromGateway['customer']['creditCards'][0]['cardType'],
                    card_number: resultFromGateway['customer']['creditCards'][0]['last4'],
                    payment_token: resultFromGateway['customer']['creditCards'][0]['token'],
                    customer_id: resultFromGateway['customer']['creditCards'][0]['customerId'],
                    is_default: 1,
                    created_at: timestamp
                };
                cardInformation.email = ''
            }
            else {
                var cardInformation = {
                    payment_token: resultFromGateway['customer']['paymentMethods'][0]['token'],
                    customer_id: resultFromGateway['customer']['id'],
                    email: resultFromGateway['customer']['paymentMethods'][0]['email'],
                    is_default: 1,
                    created_at: timestamp
                };
                cardInformation.card_name = '';
                cardInformation.card_number = '';
        }
            var outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
                'data': cardInformation}
            res.jsonp(outputJSON);  
        }
    });
}

/*
 * -----------------------------------------------------------------------------
 * Create new payment method for existing customer
 * Input : nonce with customer information
 * Output :
 * -----------------------------------------------------------------------------
 */
exports.createNewPaymentMethodForExistingCustomer = function (nonceData, callback){
    var paymentGatewaySettings = {};
    paymentGatewaySettings = constantObj.brainTreeSettings.key;
    paymentGatewaySettings.environment = braintree.Environment[constantObj.brainTreeSettings.environment];
    var gateway = braintree.connect(
        paymentGatewaySettings
    );
    gateway.paymentMethod.create(nonceData, function (err, resultFromGateway) {
        if (err) {
            return callback(err, null);
        }
        else if (resultFromGateway['errors']) {
            var response = constantObj.messages.braintreeFailure;
            return callback(response, null);
        }
        else {
            var timestamp = new Date();
            if ("creditCard" in resultFromGateway) {
                var cardInformation = {
                    card_name: resultFromGateway['creditCard']['cardType'],
                    card_number: resultFromGateway['creditCard']['last4'],
                    payment_token: resultFromGateway['creditCard']['token']
                };
                cardInformation.email = ''
            }
            else {
                var cardInformation = {
                    payment_token: resultFromGateway['paymentMethod']['token'],
                    email: resultFromGateway['paymentMethod']['email']
                };
                cardInformation.card_name = '';
                cardInformation.card_number = '';
            }
        }
        return callback(null, cardInformation);
});
    }


/*
 * -----------------------------------------------------------------------------
 * Create client token for nonce
 * Input : nonce with customer information
 * Output :
 * -----------------------------------------------------------------------------
 */
exports.createNewClientTokenForNonce = function (req, res){
    //customer id for creating unique nonce
    var paymentGatewaySettings = {};
    console.log(constantObj.brainTreeSettings)
    paymentGatewaySettings = constantObj.brainTreeSettings.key;
    paymentGatewaySettings.environment = braintree.Environment[constantObj.brainTreeSettings.environment];
    var gateway = braintree.connect(
        paymentGatewaySettings
    );
    var customerData = {}
    gateway.clientToken.generate(customerData, function (err, responseFromClientToken) {
        if (err) {
                var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
        }
        else {
                var outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
                'data': responseFromClientToken}
            }
            res.jsonp(outputJSON);  
                
    });
}


/*
 * -----------------------------------------------------------------------------
 * Create transaction for payment
 * Input : nonce with customer information
 * Output :
 * -----------------------------------------------------------------------------
 */
exports.createTransactionForPayment = function (req, res){

    var paymentGatewaySettings = {};
    paymentGatewaySettings = constantObj.brainTreeSettings.key;
    paymentGatewaySettings.environment = braintree.Environment[constantObj.brainTreeSettings.environment];
    var gateway = braintree.connect(
        paymentGatewaySettings
    );
        gateway.transaction.sale({
        paymentMethodToken: req.body.paymentToken,
        amount: req.body.amount
    }, function (err, resultFromGateway) {
        if(err){
            var outputJSON = {'status':'failure', 'messageId':203, 'message': err};
        }
        else if (resultFromGateway['errors']) {
            console.log(resultFromGateway);
             var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.braintreeFailure};
        }
        else{
            var outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
                'data': resultFromGateway}
        }
        res.jsonp(outputJSON); 
    });
}


