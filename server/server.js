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

//##express initialisation---------------------------------
const app = express();

app.use(express.json());

app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")))


//##Getting items with options(cunstom api)-----------------------------------------
app.post("/=items", async (req, res) => {

    const ids = req.body.ids
    const opeions = req.body.options

    const items = await Promise.all(ids.map(async id => {
        return await get_item(id)
    }))

    res.send({items});
})



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


//##Functions-----------------------------------
function addToMainFolder(id){
    backend_items.folder.model.findById(MAIN_FOLDER_ID)
        .exec()
        .then( main_folder => {
            let new_items = main_folder.items;
            new_items.push(id);
            backend_items.folder.model.updateOne( {_id: MAIN_FOLDER_ID}, { $set: {items: new_items}}).exec()
            // MainFolder.items = items;
            // MainFolder.save();
        })
        .catch(err => console.log(err));


}

function validate_ObjektId(id){
if (mongoose.Types.ObjectId.isValid(id)){
    if (mongoose.Types.ObjectId(id) == id) {
        return true;

    }
} else {return false;}

}


async function get_item(id){

  if (id.startsWith("!")) {
      const typeid = id.split("_")[0].split("-").join("_").slice(1)
      const item = await backend_items[typeid].get_external(id)
      return item
  }

  let item_mongoose = {}

  if (validate_ObjektId(id)) {
      item_mongoose = backend_items.base_item.model.findOne( { _id: id } )
  } else {
      item_mongoose = backend_items.base_item.model.findOne( { _name : id } )
  }

      // item_mongoose.populate({
      //   path:"items",
      //   populate:"typeid"
      // })


      // item_mongoose.populate({
      //     path: "items",
      //     populate: {
      //         path: "items",
      //         populate: {
      //             path: "items",
      //         },
      //     path: "game",
      //     path: "icon",
      //     },
      // })

      let item = await item_mongoose.lean().exec()

    //   if (item && item.external_items && item.external_items.length != 0) {
          
    //       item.external_items = await Promise.all(item.external_items.map( async (external_item_id) => {
    //           const typeid = external_item_id.split("_")[0].split("-").join("_")
    //           const test = await backend_items[typeid].get_external(external_item_id)
    //           return test
    //       }))
// 
    //   }

      return item
}



//##SocketIO stuff------------------------------
io.on("connection", (socket) => {
    console.log("New client connected");
    socket.emit("id", socket.id);

    socket.on("get_item", async (data) => {
      console.log(data)
      data = JSON.parse(data);
      const item = await get_item(data._id)
      socket.emit("got_item", JSON.stringify(item))
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
})

//------------------------------------------------------

module.exports = {addToMainFolder, get_item, validate_ObjektId}
