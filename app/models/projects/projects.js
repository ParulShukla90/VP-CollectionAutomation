var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var branchSchema = new mongoose.Schema({
  id:{type:Number, required:true, unique: true},
  branch_name:{type:String,required:true}
});


var projectsSchema = new mongoose.Schema({
  project:[{
          id:{type:Number,required:true},
          project_name:{type:String,required:true}
  }],
 
  branch : [branchSchema],
  enable:{type:Boolean, default:true},
  is_deleted:{type:Boolean, default:false},
    createdDate:{type:Date, default: Date.now} 

});

var projectsObj = mongoose.model('projects', projectsSchema);
module.exports = projectsObj;