var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var channelSchema = new Schema ({
	ChannelId:{
		type:Number,
		unique:true
	},
	ChannelName:{
		type:String
	},
	fld_shortcode:{
		type:String
	}
})

var channelObj = mongoose.model('channel',channelSchema);
module.exports = channelObj;