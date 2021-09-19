const model_base_item = require("../base_item/main").model
const mongoose = require("mongoose")

const schema_number_int = mongoose.Schema({
    number: Number,
    description: String
}) 

const model = model_base_item.discriminator("number_int", schema_number_int)

module.exports = {model}



