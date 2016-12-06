var cardObj = require('./../../models/payment/payment.js');
var constantObj = require('./../../../constants.js');


		/**
		 * Add user card for future payments
		 * Input : email
		 * Output : log or error message
		 */
        exports.addCard = function (req, res) {
        var stripeToken = req.body.stripetoken;
        console.log(constantObj.stripeSettings)
        var stripe = require("stripe")(constantObj.stripeSettings.key);
        stripe.customers.create({
            card: stripeToken,
        }, function (err, customer) {
            if (err) {
                console.log(err);
                var response = constantObj.messages.stripeFailure;
                var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.stripeFailure};
                res.jsonp(response);
            }
            else if (!err) {
                //var cardNumber = customer['cards']['data'][0].last4;
                var cardNumber = customer['sources']['data'][0].last4;
                var customerId = customer.id;
                var cardInformation = { "customer_id": customerId,  "card_number": cardNumber};
                console.log(cardInformation);
                var outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
                'data': cardInformation}
            res.jsonp(outputJSON);  
        };
    })
}

/*
 * -----------------------------------------------------------------------------
 * Create transaction for payment
 * Input : nonce with customer information
 * Output :
 * -----------------------------------------------------------------------------
 */
exports.createTransactionForPayment = function (req, res){
    var amount = req.body.amount;
    var customerId = req.body.customerId;
    var stripe = require("stripe")(constantObj.stripeSettings.key);
       stripe.charges.create({
        amount: amount,
        currency: "usd",
        customer: customerId, // obtained with Stripe.js
        description: "Charge for Demo"
    }, function (err, charge) {
        if (err) {
           var outputJSON = {'status':'failure', 'messageId':203, 'message': err};
        }
        else{
            var outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
                'data': charge}
        }
        res.jsonp(outputJSON); 
    });
}



		