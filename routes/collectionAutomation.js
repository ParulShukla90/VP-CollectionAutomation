module.exports = function(app, express, passport) {

	var router = express.Router();

	var caObj = require('./../app/controllers/collectionAutomation/collectionAutomation.js');
	router.get('/reasonsForChange', caObj.reasonsForChange);
    
	app.use('/ca', router);

}