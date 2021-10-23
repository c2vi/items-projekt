const model_base_item = require("../base_item/main").model
const mongoose = require("mongoose")

const schema_list_of_text = mongoose.Schema({
	list_name: String,
	// todos: {{name: String, status: Boolean}},
	todos: {},
})

const model = model_base_item.discriminator("simple_todo_list", schema_list_of_text)

module.exports = {model}




