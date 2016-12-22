var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var proTypeSchema = new Schema({
	id:{
		type:Number,
		unique:true
	},
	type_name:{
		type:String
	},
	status:{
		type:Number
	}
})

var proTypeObj = mongoose.model('project_type', proTypeSchema);
module.exports = proTypeObj;