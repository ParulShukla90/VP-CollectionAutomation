var mongoose	=	require("mongoose");
var Schema	=	mongoose.Schema;

var projectcategorySchema	=	new mongoose.Schema({
	id:{type:Number},
	category_name:{type:String},
	status:{type:Number}
});



var projectcategoryObj	=	mongoose.model("projectcategories",projectcategorySchema);
module.exports	=	projectcategoryObj;
