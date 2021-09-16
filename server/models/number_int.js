const model_base_item = require("./base_item")
const mongoose = require("mongoose")

const schema_number_int = mongoose.Schema({
    number: Number,
    description: String
}) 

const number_int = model_base_item.discriminator("number_int", schema_number_int)

module.exports = number_int



