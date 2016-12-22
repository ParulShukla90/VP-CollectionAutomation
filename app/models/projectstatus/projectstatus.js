var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var proSchema = new Schema({
	id:{
		type:Number,
		unique:true
	},
	projectStatus:{
		type:String
	},
	statusOrder:{
		type:Number
	},
	status:{
		type:Number
	}
})

var proObj = mongoose.model('projectstatus',proSchema);
module.exports = proObj;