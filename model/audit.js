

const express = require('express');
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var AuditSchema=new Schema({
    name:String,
    destination:String,
    mode:String,
    _id:Schema.Types.ObjectId

});
AuditSchema.set('collection','reportsaudit');

module.exports= mongoose.model("reportsaudits",AuditSchema);