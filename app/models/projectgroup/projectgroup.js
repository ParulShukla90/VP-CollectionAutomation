var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var projectSchema = new Schema({
	id:{
		type:Number,
		unique:true
	},
	busi_id:{
		type:String
	},
	short_name:{
		type:String
	},
	name:{
		type:String
	},
	status:{
		type:Number
	}
})

var progrpobj = mongoose.model('project_groups',projectSchema);
module.exports = progrpobj;