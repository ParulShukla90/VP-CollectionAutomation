var baseUrl = "http://localhost:3000";

const messages = {
	"errorRetreivingData": "Error occured while retreiving the data from collection",
	"successRetreivingData" : "Data retreived successfully from the collection",

	//Braintree
	"braintreeFailure" : "An error has been occurred while processing Braintree.",
	"paymentSuccess": "Payment has been made successfully.",
	//Stripe
	"stripeFailure" : "An error has been occurred while processing Stripe.",
	//paypal
	"redirectPaypalUrl": baseUrl + '/#/card/add'

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
        key: "sk_test_zHdSxoVel0XNlZlNy6W90Ao0"
    }


const paypalSettings = {
    mode: 'sandbox', //sandbox or live
    client_id: 'AdmDFm0WbeQAXaiNnGSFvNIuTgYW2Z3NaSAOcUtPt0GNCyIhV2CsTrvCl4rxMEneT7T6AJ3SS4BrT0fP',
    client_secret: 'EKOA7jVUl1tupIOQ4a7AP4wiB5_SZwIPCsSjWgIZMRI50Iu8JE1smpQVBju41NipfHyfEyW09ABs2ofT'
};


var obj = {messages:messages, brainTreeSettings: brainTreeSettings, stripeSettings: stripeSettings, paypalSettings: paypalSettings};
module.exports = obj; 