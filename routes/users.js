module.exports = function(app, express, passport) {

	var router = express.Router();

	var userObj = require('./../app/controllers/users/users.js');
    router.post('/authenticate', passport.authenticate('userLogin', {session:false}), userObj.authenticate);
	router.get('/list', passport.authenticate('basic', {session:false}), userObj.list);
	router.post('/add', passport.authenticate('basic', {session:false}), userObj.add);
	router.param('id', userObj.user);
	router.post('/update/:id', passport.authenticate('basic', {session:false}), userObj.update);
	router.get('/userOne/:id', passport.authenticate('basic', {session:false}), userObj.findOne);
	 router.post('/bulkUpdate', passport.authenticate('basic', {session:false}), userObj.bulkUpdate);

	app.use('/users', router);

}