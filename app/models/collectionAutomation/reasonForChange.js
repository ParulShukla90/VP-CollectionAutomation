'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var reasonForChangeSchema = new Schema({
    title: {type:String}, 
    is_active: {type:Boolean,default : true}, 
    created_at: {type: Date,default: Date.now}
},{ collection: 'reasonForChange' })


var reasonForChange = mongoose.model('reasonForChange' , reasonForChangeSchema);
module.exports = reasonForChange;