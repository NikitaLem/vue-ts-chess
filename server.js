"use strict";
exports.__esModule = true;
var startingTable_1 = require("./src/components/startingTable");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var data = startingTable_1.startingTable;
app.use(express.static(__dirname + '/dist'));
io.on('connection', function (socket) {
    socket.emit('getData', data);
});
http.listen(3000);
