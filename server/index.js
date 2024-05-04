const express = require('express');
require('dotenv').config();
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');

const app = express();
const port = process.env.port || 4000;
app.use(cors());


const server = http.createServer(app);



const io = new Server(server,{
    cors : {
        origin : process.env.origin,
        methods : ["GET","POST"] 
    },
});


io.on('connection', (socket)=>{
    // console.log("User Connected : ",socket.id);


    socket.on("join_room",(data)=>{
        socket.join(data.room);
        // socket.to(data.room).emit('new_user',socket.id);
    });

    socket.on('send_message',(data)=>{
        // console.log(data);
        socket.to(data.room).emit('receive_message',data);
    });

    socket.on('like_message',(data)=>{
        // console.log(data);
        socket.to(data.room).emit('like_message',data);
    });


    socket.on('disconnect',()=>{
        // console.log('disconnect : ',socket.id);
    });
});









// Start Server
server.listen(port,(err)=>{
    if(err){
        console.log(`Server is not Running`);
        return;
    }
    console.log(`Server is running on port ${port}..........`);
})