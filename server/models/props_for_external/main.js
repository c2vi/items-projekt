const model_base_item = require("../base_item/main").model
const mongoose = require("mongoose")

schema = new mongoose.Schema({
	id: String,
	ext_item_in: [{type: mongoose.Schema.Types.ObjectID, ref: "base_item"}],
	at_prop: String,

})

const model = model_base_item.discriminator("props_for_external", schema)

module.exports = {model}