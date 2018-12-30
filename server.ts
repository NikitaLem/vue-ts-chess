import { Http2Server } from "http2";
import { startingTable } from './src/components/startingTable';
import SquareInterface from "./src/Interfaces/SquareInterface";

const express = require('express');
const app: any = express();
const http: Http2Server = require('http').Server(app);
const io = require('socket.io')(http);

let data: SquareInterface[] = startingTable;
let isWhiteTurn: boolean = true;

app.use(express.static(__dirname + '/dist'));

io.on('connection', function(socket) {
  socket.emit('getData', {data: data, activeSide: isWhiteTurn});

  socket.on('postData', (newData: SquareInterface[]) => {
    data = newData;
    isWhiteTurn = !isWhiteTurn;
    socket.broadcast.emit('getData', {data: data, activeSide: isWhiteTurn});
  });

  socket.on('promotion', (newData: SquareInterface[]) => {
    data = newData;
    socket.broadcast.emit('getData', {data: data, activeSide: isWhiteTurn});
  });

  socket.on('newMessage', function(msg: string) {
    io.sockets.emit('addNewLine', msg);
  });

  socket.on('restartGame', function() {
    data = startingTable;
    isWhiteTurn = true;
    io.sockets.emit('getData', {data: data, activeSide: isWhiteTurn});
  });
});

http.listen(3030);