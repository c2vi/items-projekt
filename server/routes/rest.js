//##imports------------------------------------
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const funcs_from_main = require("../server")

//##Item imports------------------------------
const backend_items = require('../registered_items')

const MAIN_FOLDER_ID = "60ef0d4b007d3a96f952ae19"


//##Module exports--------------------------------
module.exports = router;

//##Hello from api-----------------------------------------
router.get("/", (req, res) => {
    console.log(req.body)
    res.send("hello from the api");
})

//##Getting one-----------------------------------------
router.get("/:id", async (req, res) => {

const id = req.params.id;

if (id.search("_") != -1) {
    const typeid = id.split("_")[0].split("-").join("_")
    const item = await backend_items[typeid].get_external(id)
    res.status(200).send(item)
    return
}

let item_mongoose = {}

if (validate_ObjektId(id)) {
    item_mongoose = backend_items.base_item.model.findOne( { _id: id } )
} else {
    item_mongoose = backend_items.base_item.model.findOne( { _name : id } )
}

    item_mongoose.populate({
        path: "items",
        populate: {
            path: "items",
            populate: {
                path: "items",
            },
        path: "game",
        path: "icon",
        },
    })

    let item = await item_mongoose.lean().exec()

    if (item && item.external_items && item.external_items.length != 0) {
        
        item.external_items = await Promise.all(item.external_items.map( async (external_item_id) => {
            const typeid = external_item_id.split("_")[0].split("-").join("_")
            const test = await backend_items[typeid].get_external(external_item_id)
            return test
        }))

    }


    res.status(200).send(item)
})

//##Creating one-----------------------------------------
router.post("/game_server", (req, res) => {

    item = new backend_items.game_server.model({
        _id: new mongoose.Types.ObjectId(),
        _name: req.body._name,
        game: req.body.game,
    });
    addToMainFolder(item.id)    
    item.save()


    res.status(200).send("created item");
})

router.post("/computer_game", (req, res) => {

    item = new backend_items.computer_game.model({
        _id: new mongoose.Types.ObjectId(),
        _name: req.body._name,
        name: req.body.name,
        on_steam: req.body.on_steam,
        steam_store_link: req.body.steam_store_link,
        steam_open_link: req.body.steam_open_link,
        steam_id: req.body.steam_id,
    });
    addToMainFolder(item.id)    
    item.save()


    res.status(200).send("created item");
})

// router.post("/simple_counter", (req, res) => {

//     item = new simple_counter({
//         _id: new mongoose.Types.ObjectId(),
//         counter_name: req.body.counter_name,
//         value: req.body.value
//     });
//     addToMainFolder(item.id)    
//     item.save()


//     res.status(200).send("created item:");
// })


// router.post("/list_of_text", (req, res) => {

//     item = new list_of_text({
//         _id: new mongoose.Types.ObjectId(),
//         items: req.body.ids
//     });
//     addToMainFolder(item.id)    
//     item.save()


//     res.status(200).send("created list_of_text:");
// })


// router.post("/folder", (req, res) => {

//     item = new folder({
//         _id: new mongoose.Types.ObjectId(),
//         items: req.body.ids,
//         folder_name: req.body.folder_name
//     });
//     addToMainFolder(item.id)    
//     item.save()


//     res.status(200).send("created item:");
// })


//##Updating one-----------------------------------------
// router.patch("/:id", (req, res) => {

//     // plain_text.update( {_id: req.params.id }, { $set: {text: "testing"}} , function(err,docs){console.log("mongolog: " + docs)}  ) //.exec().then(console.log("updated")).catch(err => console.log(err))


//     res.send("does nothing");
// })

//##Deleting one-----------------------------------------
// router.get("/", (req, res) => {


//     res.send();
// })

//##end---------------------------------------------
module.exports = router;