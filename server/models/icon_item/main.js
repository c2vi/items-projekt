const model_base_item = require("../base_item/main").model
const mongoose = require("mongoose")


schema = new mongoose.Schema({
    type: String,
    url: String,



})

const model = model_base_item.discriminator("icon_item", schema)


function init(){
	// discord_bot()
}

module.exports = {model, init}



