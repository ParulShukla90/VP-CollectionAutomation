module.exports = function(app, express, passport) {

	var router = express.Router();

	var caObj = require('./../app/controllers/collectionAutomation/collectionAutomation.js');
	router.get('/reasonsForChange', caObj.reasonsForChange);
	router.get('/forecasting', caObj.forecastingData);
	router.post('/saveMilestones', caObj.saveMilestones);
	router.post('/paymentMilestones', caObj.paymentMilestones);
    
	app.use('/ca', router);

}