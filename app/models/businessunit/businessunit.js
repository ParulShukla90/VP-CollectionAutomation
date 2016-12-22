var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var businessUnitSchema = new Schema({
	fld_busiUnitId:{
		type:Number,
		unique:true
	},
	fld_busiUnit:{
		type:String
	},
	fld_shortcode:{
		type:String
	},
	isRevenueGroup:{
		type:Number
	},
	fld_isSales:{
		type:Number
	},
	is_resourcegroup:{
		type:Number		
	},
	is_enggGroup:{
		type:Number		
	},
	group_id:{
		type:String
	},
	is_closure:{
		type:Number	
	},
	is_hc:{
		type:Number
	},
	hc_order:{
		type:Number
	},
	status:{
		type:Number
	}
})

module.exports = mongoose.model('businessUnit',businessUnitSchema);
// module.exports = businUnitObj;
