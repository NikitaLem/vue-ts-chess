import { Http2Server } from "http2";
import { startingTable } from './src/components/startingTable';

const express = require('express');
const app: any = express();
const http: Http2Server = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

let data = startingTable;

app.use(express.static(__dirname + '/dist'));

io.on('connection', function(socket){
    socket.emit('getData', data);
  });

http.listen(3000);