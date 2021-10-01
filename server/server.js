//##imports
const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');
const mongoose = require('mongoose');

const Discord = require('discord.js')
require("dotenv").config()

//##Item imports------------------------------
const backend_items = require('./registered_items')

//##express-socket.io initialisation---------------------------------
const app = express();

app.use(express.json());

app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")))

const rest_router = require("./routes/rest.js");
app.use("/api" , rest_router);

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "index.html"))
})


const server = http.createServer(app);

const io = socketIo(server); 

server.listen(process.env.SERVER_PORT, () => {
    //code to get executed, when the server is started
    console.log("Server started - "+ process.env.DISCORD_COMMANDS);

});

//##SocketIO stuff------------------------------
io.on("connection", (socket) => {
    console.log("New client connected");
    socket.emit("id", socket.id);

    socket.on("update", (data) => {
      data = JSON.parse(data);
      delete data._typeid
      console.log(data.value)
      backend_items.simple_counter.model.updateOne( {_id: data._id }, { $set: data } )
      .exec()
      .then( () => {
        io.emit("update", data);
      })
      .catch(err => console.log(err) )
    });

    socket.on("load_items", (item_ids) => {
      let items = []
      JSON.parse(item_ids).map( item_id => {
        backend_items.base_item.model.findById(item_id)
          .exec()
          .then( item => items.push(item))
          .catch( err => console.log(err));

      }).then(console.log(items))
    })

});


//------------------------------------------------------


//##MongoDB-------------------------------
const mongo = mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then( test => {module.exports = test});

// async function test(id){
//   const moodle_site = await backend_items.moodle_site.model.find({ _id:id }).exec()
//   console.log(moodle_site)

// }
// test("614517d6cc66fd370b7a928c")




//------------------------------------------------------

