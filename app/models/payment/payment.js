'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var paymentSchema = new Schema({
    card_name: {type:String}, 
    card_number: {type:String}, 
    email: {type:String},
    payment_token: {type:String}, 
    created: {type: Date,default: Date.now},
    updated: {type:Date}
})


var Payment = mongoose.model('payment' , paymentSchema);
module.exports = Payment;