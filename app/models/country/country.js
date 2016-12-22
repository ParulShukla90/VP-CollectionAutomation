var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var countrySchema = new Schema({
	id:{
		type:Number,
		unique:true
	},
	name:{
		type:String
	},
	code2:{
		type:String
	},
	code3:{
		type:String
	}
})

var countryObj = mongoose.model('country',countrySchema);
module.exports = countryObj;