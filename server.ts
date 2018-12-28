import { Http2Server } from "http2";
import { startingTable } from './src/components/startingTable';

const express = require('express');
const app: any = express();
const http: Http2Server = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

app.use(express.static(__dirname + '/dist'));

app.get('/getTable', (req, res) => {
    res.json(startingTable);
});

io.on('connection', function(socket){
    console.log('a user connected');
  });

http.listen(3000);