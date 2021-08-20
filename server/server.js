//##imports
const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');
const mongoose = require('mongoose');

const Discord = require('discord.js')
require("dotenv").config()

// const graphqlHttp = require('express-graphql');
// const graphql_schema = require('./graphql/api_schema')

// const { buildSchema } = require("graphql")


//##Item imports------------------------------
const base_item = require('./models/base_item');

const plain_text = require('./models/plain_text');
const number_int = require('./models/number_int');
const folder = require('./models/folder');
const list_of_text = require('./models/list_of_text');
const simple_counter = require('./models/simple_counter');


//##constants
const MONGO_URL = "mongodb://127.0.0.1:27017/?&gssapiServiceName=mongodb";
const server_port = 3003;
const MAIN_FOLDER_ID = "60ef0d4b007d3a96f952ae19"
const DISCORD_COMMANDS = ["!gameserver", "!gs"]

//##express-socket.io initialisation---------------------------------
const app = express();

app.use(express.json());

//seve react app
//app.use("/react")

app.use("/static", express.static(path.resolve(__dirname, "js-app-build", "static")))

app.get("/js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "js-app-build", "index.html"))
})

const rest_router = require("./routes/rest.js");
app.use("/api" , rest_router);

// app.use('graphql', graphqlHttp(graphql_schema));

// for testing a build version of the react app without having to use corse
// app.use(express.static(path.join(__dirname, "react-app-build")));

app.get('/', (req, res) => {
    res.send("hello from nodejs server")
});


const server = http.createServer(app);

const io = socketIo(server); 

server.listen(server_port, () => {
    //code to get executed, when the server is started
    console.log("Server started");

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
mongoose.connect(MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});



//##Discord-Bot-------------------------------


const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_PRESENCES"],
})

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`)
})
client.login(process.env.DISCORD_TOKEN)

client.on("message", (message) => {
  const splitMessage = message.content.split(" ")

  if (DISCORD_COMMANDS.includes(splitMessage[0])) {
    if (splitMessage[1] === "test"){
      message.reply("The bot seems to be working")
    }
  }
})

//------------------------------------------------------

