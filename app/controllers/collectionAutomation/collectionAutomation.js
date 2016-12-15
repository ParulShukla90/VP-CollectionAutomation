var reasonObj = require('./../../models/collectionAutomation/reasonForChange.js');
var constantObj = require('./../../../constants.js');

var reasonsForChange = function(req, res) {
    reasonObj.find({is_active : true},function(err,data){
        if(err){
            var outputJson = {};
            outputJson.msg = "Error while getting reasons for change in milestone.";
            outputJson.err = err;
            res.status(400).jsonp({})
        }else{
            res.status(200).jsonp(data);
        }
    })
}
exports.reasonsForChange = reasonsForChange;