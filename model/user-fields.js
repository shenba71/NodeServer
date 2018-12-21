const express = require('express');
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var fieldsSchema= new Schema({
    userId:String,
    fields:[String]
});

module.exports=mongoose.model("fields",fieldsSchema);