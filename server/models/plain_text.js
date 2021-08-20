const model_base_item = require("./base_item")
const mongoose = require("mongoose")

schema_plain_text = new mongoose.Schema({
    text: String

})

const plain_text = model_base_item.discriminator("plain_text", schema_plain_text)

module.exports = plain_text



