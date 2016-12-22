var reasonObj = require('./../../models/collectionAutomation/reasonForChange.js');
var constantObj = require('./../../../constants.js');
var paymentMilestonesObj = require('./../../models/collectionAutomation/paymentMilestones.js');

var reasonsForChange = function(req, res) {
    reasonObj.find({is_active : true},function(err,data){
        if(err){
            var outputJson = {};
            outputJson.msg = "Error while getting reasons for change in milestone.";
            outputJson.err = err;
            res.status(400).jsonp(outputJson)
        }else{
            res.status(200).jsonp(data);
        }
    })
}
exports.reasonsForChange = reasonsForChange;


var paymentMilestones = function(req,res){
    var outputJson = {};
    if(!req.body.id){
        outputJson.msg = "Missing required information";
        res.status(400).jsonp(outputJson);
        return;
    }
    paymentMilestonesObj.find({projId : req.body.id,is_active:true},function(err,data){
        if(err){
            outputJson.msg = "Error while getting reasons for change in milestone.";
            outputJson.err = err;
            res.status(400).jsonp(outputJson)
        }else{
            res.status(200).jsonp(data);
        }
    });
}
exports.paymentMilestones = paymentMilestones;

var saveMilestones = function(req,res){
    //console.log(req.body);
    if(!(req.body.projId>=0) || !(req.body.projType) || !(req.body.data.length>0)){
        var outputJson = {};
        outputJson.msg = "Missing required information.";
        return res.status(400).jsonp(outputJson);
    }
    var data = [];
    switch(req.body.projType){
        case 1 : {
            setFcmData(req.body,function(err,response){
                if(err){
                    return res.status(400).jsonp(err);
                }else{
                    data = response;
                    saveMilestonesToDb(req,res,data,0);
                }
            })
            break;
        }
        case 2 : {
            setHrlyData(req.body,function(err,response){
                if(err){
                    return res.status(400).jsonp(err);
                }else{
                    data = response;
                    saveMilestonesToDb(req,res,data,0);
                }
            })
            break;
        }
        case 3:{
            setFcmData(req.body,function(err,response){
                if(err){
                    return res.status(400).jsonp(err);
                }else{
                    data = response;
                    saveMilestonesToDb(req,res,data,0);
                }
            })
            break;
        }
        default :{
            var outputJson = {};
            outputJson.msg = "Invalid or unrecognized project type.";
            return res.status(400).jsonp(outputJson);    
            //break;
        }
    }
}
exports.saveMilestones = saveMilestones;



var setHrlyData = function(body,cb){
    var i = 0;
    var length = body.data.length;
    if(length > 0){
        var flag = false;
        var err = {};
        for(i = 0; i< length ; i++){
            if(!body.data[i].title || !(body.data[i].days>=0) || !(body.data[i].date) ||!(body.data[i].holidays>=0) || !(body.data[i].hourlyRate>=0) || !(body.data[i].resources>=0) || !(body.data[i].dailyLimit>=0) || !(body.data[i].hrsThisWeek>=0) || !(body.data[i].amount>=0)){
                flag = true;
                err.msg = "Missing required information.";
                break;
            }
            body.data[i].projId = parseInt(body.projId);
            body.data[i].index = i;
        }
        if(flag){
            cb(err,null)        
        }else{
            cb(null,body.data);
        }
    }else{
        var err = {};
        err.msg = 'No milestone to save';
        cb(err,null)
    }
    
}
exports.setHrlyData = setHrlyData;


var setFcmData = function(body,cb){
    var i = 0;
    var length = body.data.length;
    if(length > 0){
        var flag = false;
        var err = {};
        for(i = 0; i< length ; i++){
            if(!body.data[i].title || !(body.data[i].date) || !(body.data[i].amount > 0)){
                flag = true;
                err.msg = "Missing required information.";
                break;
            }
            body.data[i].projId = parseInt(body.projId);
            body.data[i].index = i;
        }
        if(flag){
            cb(err,null)        
        }else{
            cb(null,body.data);
        }
    }else{
        var err = {};
        err.msg = 'No milestone to save';
        cb(err,null)
    }
}
exports.setFcmData = setFcmData;

var saveMilestonesToDb = function(req,res,data,i){
    var jsonData = {};
    if(data[i]._id){
        paymentMilestonesObj.update({_id : data[i]._id},{$set:data[i]},{},function(err,svData){
            if(err){
                jsonData.msg= " Error while saving data";
                jsonData.err = err;
                res.status(400).jsonp(jsonData);
            }else{
                if(i == (data.length-1)){
                    finalStepSaveMilestone(req,res);
                    
                }else{
                    saveMilestonesToDb(req,res,data,i+1);
                }
            }
        })
    }else{
        
        var newObj = new paymentMilestonesObj(data[i]);
        newObj.save(function(err,svData){
            if(err){
                jsonData.msg= " Error while saving data";
                jsonData.err = err;
                res.status(400).jsonp(jsonData);
            }else{
                if(i == (data.length-1)){
                    finalStepSaveMilestone(req,res);
                }else{
                    saveMilestonesToDb(req,res,data,i+1);
                }
            }
        })
    }
}
exports.saveMilestonesToDb = saveMilestonesToDb;



var finalStepSaveMilestone = function(req,res){
    req.body.id = req.body.projId;
    if(req.body.removeIds){
        if(req.body.removeIds.length >0){
            paymentMilestonesObj.update({_id:{$in: req.body.removeIds}},{$set:{is_active : false}},{multi:true},function(err,updtData){
                if(err){
                    jsonData.msg= " Error while saving data";
                    jsonData.err = err;
                    res.status(400).jsonp(jsonData);
                }else{
                    paymentMilestones(req,res);
                }
            })
        }
    }else{
        paymentMilestones(req,res);
    }
}
exports.finalStepSaveMilestone = finalStepSaveMilestone;

setTimeout(function(){
    var currDate = new Date(new Date('12/12/2014').setHours(0,0,0,0));
    paymentMilestonesObj.aggregate([
        {$match:{date : {$gt : currDate},is_active:true}},
        {$project : {
            title : '$title',
            amount : '$amount',
            projId : '$projId',
            
            date: '$date',
            week: { $week: "$date" },
            year: { $year: "$date" }, 
        }},
        {$group : {_id:{week : '$week',year:'$year'} ,ids : {$push : '$_id'}}},
        {
          $lookup:
            {
              from: "paymentMilestones",
              localField: "ids",
              foreignField: "_id",
              as: "inventory_docs"
            }
        }
    ],function(err,data){
        console.log('err',err);
        console.log('data',data);
    })    
},5000)
var forecastingData = function(req,res){
    var currDate = new Date().setHours(0,0,0,0);
    paymentMilestonesObj.aggregate([
        {$match:{date : {$gt : currDate}}}
    ])
}
exports.forecastingData = forecastingData;