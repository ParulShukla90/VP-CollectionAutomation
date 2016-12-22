var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var typeSchema = new Schema({
	TypeId:{
		type:Number,
		unique:true
	},
	TypeName:{
		type:String
	},
	TypeCode:{
		type:String
	}
})

var typeObj = mongoose.model('type', typeSchema);
module.exports = typeObj;