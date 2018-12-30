"use strict";
exports.__esModule = true;
var startingTable_1 = require("./src/components/startingTable");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var data = startingTable_1.startingTable;
var isWhiteTurn = true;
app.use(express.static(__dirname + '/dist'));
io.on('connection', function (socket) {
    socket.emit('getData', { data: data, activeSide: isWhiteTurn });
    socket.on('postData', function (newData) {
        data = newData;
        isWhiteTurn = !isWhiteTurn;
        socket.broadcast.emit('getData', { data: data, activeSide: isWhiteTurn });
    });
    socket.on('promotion', function (newData) {
        data = newData;
        socket.broadcast.emit('getData', { data: data, activeSide: isWhiteTurn });
    });
    socket.on('newMessage', function (msg) {
        io.sockets.emit('addNewLine', msg);
    });
    socket.on('restartGame', function () {
        data = startingTable_1.startingTable;
        isWhiteTurn = true;
        io.sockets.emit('getData', { data: data, activeSide: isWhiteTurn });
    });
});
http.listen(3030);
