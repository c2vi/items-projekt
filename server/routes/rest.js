//##imports------------------------------------
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//##Item imports------------------------------
const base_item = require('../models/base_item');

const plain_text = require('../models/plain_text');
const number_int = require('../models/number_int');
const folder = require('../models/folder');
const list_of_text = require('../models/list_of_text');
const simple_counter = require('../models/simple_counter');

const MAIN_FOLDER_ID = "60ef0d4b007d3a96f952ae19"

function addToMainFolder(id){
    folder.findById(MAIN_FOLDER_ID)
        .exec()
        .then( main_folder => {
            let new_items = main_folder.items;
            new_items.push(id);
            folder.updateOne( {_id: MAIN_FOLDER_ID}, { $set: {items: new_items}}).exec()
            // MainFolder.items = items;
            // MainFolder.save();
        })
        .catch(err => console.log(err));


}



//##Module exports--------------------------------
module.exports = router;

//##Getting all-----------------------------------------
router.get("/", (req, res) => {
    res.send("hello from the api");
})

//##Getting one-----------------------------------------
router.get("/:id", (req, res) => {
    if ( req.params.id == "main"){
        req.params.id = "60ef0d4b007d3a96f952ae19"
    }
    if ( req.params.id == "loading..."){
        return
    }
base_item.findById(req.params.id)
    .populate({
        path: "items",
        populate: {
            path: "items",
            populate: {
                path: "items"
            }
        }
    })
    .exec()
    .then( doc => {res.status(200).send(doc) })
    .catch( err => {console.log(err)});



})

//##Creating one-----------------------------------------
router.post("/plain_text", (req, res) => {

    item = new plain_text({
        _id: new mongoose.Types.ObjectId(),
        text: req.body.text
    });
    addToMainFolder(item.id)    
    item.save()


    res.status(200).send("created item");
})

router.post("/simple_counter", (req, res) => {

    item = new simple_counter({
        _id: new mongoose.Types.ObjectId(),
        counter_name: req.body.counter_name,
        value: req.body.value
    });
    addToMainFolder(item.id)    
    item.save()


    res.status(200).send("created item:");
})


router.post("/list_of_text", (req, res) => {

    item = new list_of_text({
        _id: new mongoose.Types.ObjectId(),
        items: req.body.ids
    });
    addToMainFolder(item.id)    
    item.save()


    res.status(200).send("created list_of_text:");
})


router.post("/folder", (req, res) => {

    item = new folder({
        _id: new mongoose.Types.ObjectId(),
        items: req.body.ids,
        folder_name: req.body.folder_name
    });
    addToMainFolder(item.id)    
    item.save()


    res.status(200).send("created item:");
})


//##Updating one-----------------------------------------
router.patch("/:id", (req, res) => {

    // plain_text.update( {_id: req.params.id }, { $set: {text: "testing"}} , function(err,docs){console.log("mongolog: " + docs)}  ) //.exec().then(console.log("updated")).catch(err => console.log(err))


    res.send("does nothing");
})

//##Deleting one-----------------------------------------
router.get("/", (req, res) => {



    res.send();
})

//##end---------------------------------------------
module.exports = router;