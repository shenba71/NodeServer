

const express = require('express');
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var UserSchema=new Schema({
    userId:String,
    UserName:String,
    password:String,

});

module.exports= mongoose.model("users",UserSchema);