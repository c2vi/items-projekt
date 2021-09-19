const model_base_item = require("../base_item/main").model
const mongoose = require("mongoose")

schema_plain_text = new mongoose.Schema({
    text: String

})

const model = model_base_item.discriminator("plain_text", schema_plain_text)

module.exports = {model}



