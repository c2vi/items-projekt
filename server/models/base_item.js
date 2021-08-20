const mongoose = require("mongoose")

const options_base_item = {
    discriminatorKey: '_typeid',
    collection: 'items'
}

const schema_base_item = new mongoose.Schema({
    _typeid: String,
    _id: mongoose.Schema.Types.ObjectId

}, options_base_item); 

const model_base_item = new mongoose.model("base_item", schema_base_item)

module.exports = model_base_item
