const model_base_item = require("./base_item")
const mongoose = require("mongoose")

const schema_simple_counter = mongoose.Schema({
	counter_name: String,
	value: Number
})

const simple_counter = model_base_item.discriminator("simple_counter", schema_simple_counter)

module.exports = simple_counter

