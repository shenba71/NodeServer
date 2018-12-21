
const express = require('express');
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userId:String,
    dayId:Number,
    organizationId:String,
    platformPartner:String,
    insertTimestamp:Date,
    updateTimestamp:Date,
    userCmdId:String,
    firstName:String,
    middleName:String,
    lastName:String,
    organizationName:String,
    organizationCmdId:String,
    districtId:String,
    districtCmdId:String,
    districtName:String,
    subDistrictId:String,
    subDistrictCmdId:String,
    subDistrictName:String,
    stateCode:String,
    countryCode:String,
    platformId:String,
    userRole:String,
    date:Date,
    // yet to conform type
    extensions:String,
    eventCreatedBy:String,
    eventCreatedDate:Date,
    eventIds:[{
        eventId:String,
        timeStamp:Date
    }],
    eventLastUpdatedBy:String,
    eventLastUpdatedDate:Date,
    classes:[{
        classId:String,
        classCmdId:String
    }],
    role:String,
    action:[{
        loginHour:Number,
        loginTimeStamp:Date,
        sessionTimeSpent:Number,
        exitedTimeStamp:Date
    }],
    result:{
        userLoginCount:Number,
        userLoginCountHour:[Number],
        userTotalTimeSpent:Number
    }
     
});

var userSessionScehma =new Schema({
    user:[userSchema]
});

module.exports= mongoose.model("pearsonusers",userSessionScehma);