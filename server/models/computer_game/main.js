const model_base_item = require("../base_item/main").model
const mongoose = require("mongoose")

schema = new mongoose.Schema({
    _name: String,
    name: String,
    on_steam: Boolean,
    steam_store_link: String,
    steam_open_link: String,
    steam_id: String,



})

const model = model_base_item.discriminator("computer_game", schema)


module.exports = {model}



