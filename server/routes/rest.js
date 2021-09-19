//##imports------------------------------------
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//##Item imports------------------------------
const backend_items = require('../registered_items')
const base_item = backend_items.base_item;

const MAIN_FOLDER_ID = "60ef0d4b007d3a96f952ae19"

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




//##Module exports--------------------------------
module.exports = router;

//##Getting all-----------------------------------------
router.get("/", (req, res) => {
    res.send("hello from the api");
})

//##Getting one-----------------------------------------
router.get("/:id", (req, res) => {

const id = req.params.id;

let test = {}
if (validate_ObjektId(id)) {
    test = backend_items.base_item.model.find( { _id: id } )
} else {
    // console.log(id+"    is not an objectID")
    test = backend_items.base_item.model.find( { _name : id } )
}

    test.populate({
        path: "items",
        populate: {
            path: "items",
            populate: {
                path: "items"
            },
        path: "game",
        }
    })
    .exec()
    .then( data => {res.status(200).send(data[0]) }) //the [0] because the Modle.find() returns an array of matches
    .catch( err => {console.log(err)});



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