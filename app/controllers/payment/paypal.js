"use strict";
var paypal = require('paypal-rest-sdk');
var constantObj = require('./../../../constants.js');
paypal.configure({
    'mode': constantObj.paypalSettings.mode, //sandbox or live
    'client_id': constantObj.paypalSettings.client_id,
    'client_secret': constantObj.paypalSettings.client_secret
});



/*
 * -----------------------------------------------------------------------------
 * Add new customer or card to braintree
 * Input : nonce with customer information
 * Output :
 * -----------------------------------------------------------------------------
 */
exports.addNewCard = function (req, res){
    console.log(req.body);
//     var savedCard = {
//     "type": "visa",
//     "number": "4417119669820331",
//     "expire_month": "11",
//     "expire_year": "2019",
//     "cvv2": "123",
//     "first_name": "Joe",
//     "last_name": "Shopper"
// };
var savedCard = req.body;
paypal.creditCard.create(savedCard, function (error, credit_card) {
    if (error) {
        var outputJSON = {'status':'failure', 'messageId':203, 'message': error};
    } else {
        console.log("Save Credit Card Response");
        var outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
                'data': credit_card}
    }
     res.jsonp(outputJSON);  
    })
}


/*
 * -----------------------------------------------------------------------------
 * Create transaction for payment using paypal
 * Input : 
 * Output :
 * -----------------------------------------------------------------------------
 */


exports.createTransactionForPaymentUsingPaypal = function (req, res){
    console.log(req.body);
    var amount = req.body.amount;
var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": constantObj.messages.redirectPaypalUrl,
        "cancel_url": constantObj.messages.redirectPaypalUrl
    },
    "transactions": [{ "item_list": {
            "items": [{
                "name": "item",
                "sku": "item",
                "price": amount,
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": amount
        },
        "description": "This is the payment description."
    }]
};


paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        var outputJSON = {'status':'failure', 'messageId':203, 'message': error};
         res.jsonp(outputJSON);
    } else {
        console.log("Create Payment Response");
        console.log(payment);
        if (payment.payer.payment_method === 'paypal') {
                var redirectUrl;
                for (var i = 0; i < payment.links.length; i++) {
                    var link = payment.links[i];
                    if (link.method === 'REDIRECT') {
                        redirectUrl = link.href;
                    }
                }
              var outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
                'data': redirectUrl}
                 res.jsonp(outputJSON); 
            }
    }
});
}


/*
 * -----------------------------------------------------------------------------
 * Create transaction for payment using credit card
 * Input : 
 * Output :
 * -----------------------------------------------------------------------------
 */
exports.createTransactionForPaymentUsingPaypalCard = function (req, res){
    console.log(req.body);
    var cardInfo = req.body.card;
    var amount = req.body.amount;
    //4032037797196710
    /*{
            "credit_card": {
                "type": "visa",
                "number": "4032037797196710",
                "expire_month": "11",
                "expire_year": "2019",
                "cvv2": "875",
                "first_name": "Joe",
                "last_name": "Shopper"
            }
        }*/
var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "credit_card",
        "funding_instruments": [cardInfo]
    },
    "transactions": [{
        "amount": {
            "total": amount,
            "currency": "USD",
            
        },
        "description": "This is the payment transaction description."
    }]
};

paypal.payment.create(create_payment_json, function (error, credit_card) {
    if (error) {
        console.log(error)
       var outputJSON = {'status':'failure', 'messageId':203, 'message': error};
    } else {
         var outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
                'data': credit_card}

    }
     res.jsonp(outputJSON); 
});
}