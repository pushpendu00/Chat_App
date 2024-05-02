const express = require('express');
require('dotenv').config;
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const port = process.env.port || 4000;

app.use(cors({
    origin : process.env.origin,
    methods : ["GET","PUT"]
}));

const server = http.createServer(app);

const io = new Server(server,{
    cors : {
        origin : process.env.origin,
    methods : ["GET","PUT"] 
    },
});









// Start Server
app.listen(port,(err)=>{
    if(err){
        console.log(`Server is not Running`);
        return;
    }
    console.log(`Server is running on port ${port}..........`);
})