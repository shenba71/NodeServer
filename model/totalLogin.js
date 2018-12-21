const express = require('express');
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var sessionSchema = new Schema({
    AdminLogin:Number,
    loginDate:String,
    platformId:String,
    StudentLogin:Number,
    TeacherLogin:Number,
    totalLoginCount:Number

});


var userSessionScehma =new Schema({
    user:[sessionSchema]
});

module.exports= mongoose.model("Totallogins",userSessionScehma);