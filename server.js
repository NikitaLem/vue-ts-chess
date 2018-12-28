"use strict";
exports.__esModule = true;
var startingTable_1 = require("./src/components/startingTable");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/dist'));
app.get('/getTable', function (req, res) {
    res.json(startingTable_1.startingTable);
});
io.on('connection', function (socket) {
    console.log('a user connected');
});
http.listen(3000);
