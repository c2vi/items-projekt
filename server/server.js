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

    let item = {}


    //if the id is external call the get_external() func from the item
    if (id.startsWith("!")) {
        const typeid = id.split("!")[1]
        item = await backend_items[typeid].get_external(id)
        let prop_item = await backend_items.base_item.model.findOne({_ext_id: id}).lean()
        if (prop_item != null){
            const other_keys = Object.keys(prop_item).filter(key => key.startsWith("_"))
            other_keys.forEach(key => delete prop_item[key])
            item = {...item, ...prop_item}

        }
    }


    //if the id is an ObjektID, then get the item from MongoDB
    let item_mongoose = {}

    if (validate_ObjektId(id)) {
        item_mongoose = backend_items.base_item.model.findOne( { _id: id } )
        item = await item_mongoose.lean().exec()
    } else if (!id.startsWith("!")) {
        item_mongoose = backend_items.base_item.model.findOne( { _name : id } )
        item = await item_mongoose.lean().exec()
    }

    //-------------------------------
    //Puplating of sub_items curently not needed. You could specify what to pupulate in the options put into the request....
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
    //-------------------------------




    //-------------------------------
    //Beta version of populating external_sub_items
    //   if (item && item.external_items && item.external_items.length != 0) {
          
    //       item.external_items = await Promise.all(item.external_items.map( async (external_item_id) => {
    //           const typeid = external_item_id.split("_")[0].split("-").join("_")
    //           const test = await backend_items[typeid].get_external(external_item_id)
    //           return test
    //       }))
    //   }
    //-------------------------------

    
    //setting external_props
    if (item.external_props){
        const external_props = await backend_items[item._typeid].get_external_props(item.external_props, item)
        item = {...item, ...external_props}

    }


    //and finally returning the item
    return item
}


async function update_item(item, callback_on_success){

	await backend_items[item._typeid].model.update({_id: item._id}, { $set: item }).exec()
}


//##SocketIO stuff------------------------------
io.on("connection", (socket) => {
    console.log("New client connected");
    socket.emit("id", socket.id);

    socket.on("update_item", async (data) => {
        data = JSON.parse(data);
        console.log(data)
        io.emit("update_item", data )
        await update_item(data.item)
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
