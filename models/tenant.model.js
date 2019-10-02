var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var TenantModel = new Schema({
    name : {type : String, unique : true},
    address : { type : String},
    pan :  { type : String },
    aadhar : {type : String },
    createdDate : {type : Date, default : Date.now}
})
module.exports = mongoose.model('Tenant',TenantModel)