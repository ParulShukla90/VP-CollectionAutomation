var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
  first_name: {type:String, required:'Please enter the first name.'},
  last_name: {type:String, required: 'Please enter the last name.'},
  email: { type: String, lowercase: true , unique: true, required: 'Please enter the email.'},
  user_name: {type: String, unique: true, required: 'Please enter the username.'},
  password: { type: String, select: false, required: 'Please enter the password.' },
  display_name: String,
  facebook: String,
  google: String,
  twitter: String,
  enable: {type: Boolean, default:false},
  is_deleted:{type:Boolean, default:false},
  role: [{type: Schema.Types.ObjectId, ref: 'Roles'}],
  created_date:{type:Date, default: Date.now}  
});

userSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    })
    .exec(cb);
};
userSchema.statics.serializeUser = function(user, done){
    done(null, user);
};

userSchema.statics.deserializeUser = function(obj, done){
    done(null, obj);
};

//custom validations

userSchema.path('first_name').validate(function(value) {
  var validateExpression = /^[a-zA-Z ]*$/;
  return validateExpression.test(value);
}, "Please enter a valid first name.");


userSchema.path("last_name").validate(function(value) {
  var validateExpression = /^[a-zA-Z]*$/;
  return validateExpression.test(value);
}, "Please enter a valid last name.");

userSchema.path("email").validate(function(value) {
   var validateExpression = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
   return validateExpression.test(value);
}, "Please enter a valid email address.");

userSchema.path("user_name").validate(function(value) {
  validateExpression = /^[a-zA-Z0-9]*$/;
  return validateExpression.test(value);
}, "Please enter a valid user name"); 


userSchema.plugin(uniqueValidator, {message: "Username already exists."});

var userObj = mongoose.model('users', userSchema);
module.exports = userObj;