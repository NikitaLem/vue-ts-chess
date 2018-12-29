import { Http2Server } from "http2";
import { startingTable } from './src/components/startingTable';
import SquareInterface from "./src/Interfaces/SquareInterface";

const express = require('express');
const app: any = express();
const http: Http2Server = require('http').Server(app);
const io = require('socket.io')(http);

let data: SquareInterface[] = startingTable;
let isWhiteTurn: boolean = true;
let allMessages: string[] = [];

app.use(express.static(__dirname + '/dist'));

io.on('connection', function(socket) {
  socket.emit('getData', {data: data, activeSide: isWhiteTurn});
  socket.emit('addNewLine', allMessages);

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
    allMessages.push(msg);
    io.sockets.emit('addNewLine', allMessages);
  });
});

http.listen(3000);