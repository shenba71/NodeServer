const express = require('express');
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var fieldsSchema= new Schema({
    fields:String
})