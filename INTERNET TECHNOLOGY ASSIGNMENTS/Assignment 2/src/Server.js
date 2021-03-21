'use strict';
const fs = require('fs');
const jsonfile = require('jsonfile');
const express = require('express');
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");
const app = express();
const port = 8080;
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin : "http://localhost:3000",
    methods : ["GET", "POST"],
    credentials : true
  }
})

var socketname_id = {};


server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})


io.on('connection', (socket) => { 
    socket.on("hello", (arg) => {
      socketname_id[`${arg}`] = socket;
      console.log(`The client ${arg} is connected`);
      let data = {
        sender : "admin",
        receiver : `${arg}`,
        message : `The client ${arg} is connected!`
      }
      socket.emit('sentmessage', data.sender, data.receiver, data.message, "text");
      let data1 = {
        sender : "admin",
        receiver : "broadcast",
        message : `The client ${arg} has joined!`
      }
      socket.broadcast.emit("sentmessage", data1.sender, data1.receiver, data1.message, "text");
    });

    socket.on("joinroom", (arg1, arg2, arg3) => {
      let dm = `${arg3}`;
      if (dm.localeCompare("No") == 0)
      {
        console.log(`${arg1} joined room ${arg2}`);
        socket.join(`${arg2}`);
        let data = {
          sender : "admin",
          receiver : "broadcast",
          message : `The client ${arg1} has joined room ${arg2}!`
        }
        io.in(`${arg2}`).emit("sentmessage", data.sender, data.receiver, data.message, "text");    
    }
  });

    socket.on("sendmessage", (arg1, arg2, arg3, arg4) => {
      let data = {
        sender : `${arg1}`,
        receiver : `${arg2}`,
        message : `${arg3}`,
        dm : `${arg4}`
      };
    console.log("Message received at server!");
    if (data.receiver.localeCompare("broadcast") == 0)
    {
      console.log("Broadcast Message received at server!");
      socket.emit('sentmessage', data.sender, data.receiver, data.message, "text");
      socket.broadcast.emit("sentmessage", data.sender, data.receiver, data.message, "text");
    }
    else if (data.dm.localeCompare("No") == 0)
    {
      console.log(`Room message to: ${data.receiver}`);
      io.in(`${data.receiver}`).emit("sentmessage", data.sender, data.receiver, data.message, "text");
    }
    else
    {
      console.log(`Personal message to: ${data.receiver}`)
      socket.emit('sentmessage', data.sender, data.receiver, data.message, "text");
      socket.to(socketname_id[`${data.receiver}`].id).emit("sentmessage", data.sender, data.receiver, data.message, "text");
    }
      
});
    

    
socket.on("sendimage", (arg1, arg2, arg3, arg4) => {
  let data = {
    sender : `${arg1}`,
    receiver : `${arg2}`,
    message : arg3,
    dm : `${arg4}`
  };
console.log("Message received at server!");
if (data.receiver.localeCompare("broadcast") == 0)
{
  console.log("Broadcast Message received at server!")
  socket.emit('sentimage', data.sender, data.receiver, data.message, "image");
  socket.broadcast.emit("sentimage", data.sender, data.receiver, arg3, "image");
}
else if (data.dm.localeCompare("No") == 0)
{
  console.log(`Room message to: ${data.receiver}`);
  io.in(`${data.receiver}`).emit("sentimage", data.sender, data.receiver, arg3, "image");
}
else
{
  console.log(`Personal message to: ${data.receiver}`)
  socket.emit('sentimage', data.sender, data.receiver, data.message, "image");
  socket.to(socketname_id[`${data.receiver}`].id).emit("sentmessage", data.sender, data.receiver, arg3, "image");
}
  
});


    socket.on("disconnect", (reason) => {
      let data = {
        sender : "admin",
        receiver : "broadcast",
        message : `A client has left the chat!!`
      }
      console.log(data);
      if (reason === "transport close")
        socket.broadcast.emit("sentmessage", data.sender, data.receiver, data.message);
    });

});

