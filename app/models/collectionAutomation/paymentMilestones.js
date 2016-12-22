'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var paymentMilestoneSchema = new Schema({
    projId : {type:String,required:'Please provide project ID.'},
    index : {type:Number,required:'Please provide index for the milestone.'},
    title: {type:String,required:'Please enter the title of payment milestone.'},
    days : {type:Number},
    date : {type:Date,required:'Please enter the due date.'},
    amount : {type : Number,required : 'Please provide amount to be collected for payent milestones.'},
    holidays : {type:Number},
    hourlyRate : {type:Number},
    resources : {type:Number},
    dailyLimit : {type:Number},
    hrsThisWeek : {type:Number},
    reason : {type:Schema.Types.ObjectId,ref:'reasonForChange'},
    is_active: {type:Boolean,default : true}, 
    created_at: {type: Date,default: Date.now},
    modified_at: {type: Date,default: Date.now},
},{ collection: 'paymentMilestones' })


var paymentMilestones = mongoose.model('paymentMilestones' , paymentMilestoneSchema);
module.exports = paymentMilestones;