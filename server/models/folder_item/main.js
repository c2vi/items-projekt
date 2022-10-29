const model_base_item = require("../base_item/main").model
const mongoose = require("mongoose")

const schema_folder = mongoose.Schema({
	folder_name: String,
	items: [{type: mongoose.Schema.Types.ObjectID, ref: "base_item"}],
	external_items: [String]
}, {
})

const model = model_base_item.discriminator("folder_item", schema_folder)

module.exports = {model}




