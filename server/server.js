//##imports
const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');
const mongoose = require('mongoose');

const Discord = require('discord.js')
require("dotenv").config()

//##Item imports------------------------------
const base_item = require('./models/base_item');

const plain_text = require('./models/plain_text');
const number_int = require('./models/number_int');
const folder = require('./models/folder');
const list_of_text = require('./models/list_of_text');
const simple_counter = require('./models/simple_counter');


//##express-socket.io initialisation---------------------------------
const app = express();

app.use(express.json());

app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")))

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "index.html"))
})

const rest_router = require("./routes/rest.js");
app.use("/api" , rest_router);


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
      simple_counter.updateOne( {_id: data._id }, { $set: data } )
      .exec()
      .then( () => {
        io.emit("update", data);
      })
      .catch(err => console.log(err) )
    });

    socket.on("load_items", (item_ids) => {
      let items = []
      JSON.parse(item_ids).map( item_id => {
        base_item.findById(item_id)
          .exec()
          .then( item => items.push(item))
          .catch( err => console.log(err));

      }).then(console.log(items))
    })

});


//------------------------------------------------------


//##MongoDB-------------------------------
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});



//##Discord-Bot-------------------------------


// const client = new Discord.Client({
//     intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_PRESENCES"],
// })

// client.on("ready", async () => {
//   console.log(`Logged in as ${client.user.tag}`)
// })
// client.login(process.env.DISCORD_TOKEN)

// client.on("message", (message) => {
//   const splitMessage = message.content.split(" ")

//   //DISCORD_COMMANDS are not parsed yet
//   if (process.env.DISCORD_COMMANDS.includes(splitMessage[0])) {
//     if (splitMessage[1] === "test"){
//       message.reply("The bot seems to be working")
//     }
//   }
// })

//------------------------------------------------------

