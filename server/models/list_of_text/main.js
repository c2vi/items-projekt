const model_base_item = require("../base_item/main").model
const mongoose = require("mongoose")

const schema_list_of_text = mongoose.Schema({
	list_name: String,
    items: [{type: mongoose.Schema.Types.ObjectID , ref: "plain_text"}]
})

const model = model_base_item.discriminator("list_of_text", schema_list_of_text)

module.exports = {model}




