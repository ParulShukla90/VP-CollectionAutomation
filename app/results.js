module.exports = function(app, express, passport) {

	var router = express.Router();

	var interviewObj = require('./../app/controllers/results/results.js');
	router.get('/list', passport.authenticate('basic', {session:false}), interviewObj.list);
	router.post('/create', passport.authenticate('basic', {session:false}), interviewObj.scheduleInterview);
	router.param('interviewId', interviewObj.interview);
	router.post('/update/:interviewId', passport.authenticate('basic', {session:false}), interviewObj.updateScheduledInterview);
	router.get('/interviewer/:interviewId', passport.authenticate('basic', {session:false}), interviewObj.findOne);
	router.post('/addresult', passport.authenticate('basic', {session:false}), interviewObj.addresult);
	app.use('/interview', router);

}