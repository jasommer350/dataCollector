var ObjectID = require('mongodb').ObjectID;
//var ip_var = process.env.IP
formObject = function(dbName) {
    this.dbName = dbName;
    
    this.getMyData = function(cName, callback) {
        var cDB = this.dbName.collection(cName),
            r = {},
            c = callback;
        cDB.find({}).toArray(function(err, results){
            r.resultArray = results; // output all records
            c(r);
        });
    };
    
    this.updateMyData = function(sJSON, callback) {
        this.formJSON = JSON.parse(sJSON);
        var cDB = this.dbName.collection(this.formJSON.cName),
            cDetails = this.formJSON.iDetails,
            c = callback;
        if (cDetails.length < 1) {
                return c("No records found ");
        };
        for(i=0; i<cDetails.length; i++) {
            //adding from table check if _id is new or already exists
            strObjID = cDetails[i]._id
            if(strObjID.indexOf('NEW') === -1) {
                //if document exist then we will save with the object ID it was given
                cDetails[i]._id = new ObjectID(cDetails[i]._id)
            } else {
                //if it has a NEW tag on the ID then we are inserting it into the database
                delete cDetails[i]._id;
            };
            cDB.save(cDetails[i], function(err, results) {
                console.log("Processed Update for " + strObjID);
            });
        };
        c("Number of Records that attempted to Update " + cDetails.length + " see log for errors");
    };

    //Single record save, called when processing a form
    this.saveMyData = function(sJSON, callback) {
        this.formJSON = JSON.parse(sJSON);
        var cDB = this.dbName.collection(this.formJSON.cName),
            iDetailsInsert = this.formJSON.iDetails,
            c = calback;
        cDB.insert(iDetailsInsert, {safe: true}, function(err, records){
            c("Record added with ID = "+records[0]._id);
        });
    };
    
    this.removeMyData = function(sJSON, callback) {
        this.formJSON = JSON.parse(sJSON);
        var cDB = this.dbName.collection(this.formJSON.cName),
            cDetails = this.formJSON.iDetails,
            c = callback;
            
            if (!cDetails) {
                return c("No Record Removed");;
            }
        objID = new ObjectID(cDetails._id)
        cDB.remove({_id:objID}, {w:1}, function(err,results) {
            console.log(results);
        });
        c("Record Removed " + cDetails._id);
    };
}
module.exports.formObject = formObject;