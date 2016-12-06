module.exports = function(app, express, passport) {
	var router = express.Router();
	var paymentObj = require('./../app/controllers/payment/braintree.js');
	var paymentStripeObj = require('./../app/controllers/payment/stripe.js');
	var paymentPaypalObj = require('./../app/controllers/payment/paypal.js');
	router.get('/clientToken', passport.authenticate('basic', {session:false}), paymentObj.createNewClientTokenForNonce);
	router.post('/addBraintreeCard', passport.authenticate('basic', {session:false}), paymentObj.addNewCard);
    router.post('/createBraintreeTransaction', passport.authenticate('basic', {session:false}), paymentObj.createTransactionForPayment);
	router.post('/addStripeCard', passport.authenticate('basic', {session:false}), paymentStripeObj.addCard);
    router.post('/createStripeTransaction', passport.authenticate('basic', {session:false}), paymentStripeObj.createTransactionForPayment);
	router.post('/addPaypalCard', passport.authenticate('basic', {session:false}), paymentPaypalObj.addNewCard);
	router.post('/createPaypalCardTransaction', passport.authenticate('basic', {session:false}), paymentPaypalObj.createTransactionForPaymentUsingPaypalCard);
	router.post('/createPaypalAccountTransaction', passport.authenticate('basic', {session:false}), paymentPaypalObj.createTransactionForPaymentUsingPaypal);

	app.use('/payment', router);
};