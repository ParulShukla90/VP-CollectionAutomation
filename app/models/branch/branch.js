var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var branchSchema = new mongoose.Schema({
	branch_id:{
		type:Number,
		unique:true
	},
	branchname: {
		type: String,
		unique: true
	},
	branchaddress: {
		type: String
	},
	branchstatus: {
		type: Boolean,
		default: true
	},
	branchphone: {
		type: Number
	},
	branchfex: {
		type: String
	},
	branchdate: {
		type: String
	}
})

var  branchObj = mongoose.model('branches',branchSchema);
module.exports = branchObj;