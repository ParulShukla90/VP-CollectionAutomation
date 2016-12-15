var baseUrl = "http://172.24.0.210:4040";

var webservices = {	

	"authenticate" : baseUrl + "/adminlogin/authenticate",
	"forgot_password" : baseUrl + "/adminlogin/forgot_password",
	"listVehicleTypes" : baseUrl + "/vehicletypes/list",
	"addVehicleType": baseUrl + "/vehicletypes/add",
	"editVehicleType": baseUrl + "/vehicletypes/edit",
	"updateVehicleType": baseUrl + "/vehicletypes/update",
	"statusUpdateVehicleType": baseUrl + "/vehicletypes/update_status",
	"deleteVehicleType": baseUrl + "/vehicletypes/delete",



	//Payment
	"getBraintreeClientToken": baseUrl + "/payment/clientToken",
	"addBraintreeCard": baseUrl + "/payment/addBraintreeCard",
	"createBraintreeTransaction":  baseUrl + "/payment/createBraintreeTransaction",
	"addStripeCard": baseUrl + "/payment/addStripeCard",
	"createStripeTransaction":  baseUrl + "/payment/createStripeTransaction",
	"addPaypalCard": baseUrl + "/payment/addPaypalCard",
	"createPaypalCardTransaction":  baseUrl + "/payment/createPaypalCardTransaction",
	"createPaypalAccountTransaction":  baseUrl + "/payment/createPaypalAccountTransaction",

	//paymentMilestones -- collectionAutomation
	"reasonsForChange" : baseUrl + '/ca/reasonsForChange',



}

     const brainTreeSettings =  {
        key: {
            "merchantId": "5ntqytdv7xfd2vxg",
            "publicKey": "gnbpv7j6gbyzh8mn",
            "privateKey": "585bf65cb576a0ebde324d61f1ceebd8"
        },
        environment: "Sandbox"
    }

    const stripeSettings =  {
        "key": "sk_test_zHdSxoVel0XNlZlNy6W90Ao0"
    }
    




var appConstants = {

	"authorizationKey": "dGF4aTphcHBsaWNhdGlvbg=="	
}


var headerConstants = {

	"json": "application/json"

}

var pagingConstants = {
	"defaultPageSize": 10,
	"defaultPageNumber":1
}

var messagesConstants = {

	

    //Payment
	"enterCardNumber" : "Please enter the card number.",
	"enterCardExpiry" : "Please enter the card expiry.",
	"enterCardName" : "Please enter the card name.",
	"enterCardFirstName" : "Please enter the card first name.",
	"enterCardLastName" : "Please enter the card last name.",
	"enterCardCVC" : "Please enter the card CVC.",
	"enterCardAmount" : "Please enter the amount.",
	"paymentSuccess": "Payment has been made successfully.",

	




}