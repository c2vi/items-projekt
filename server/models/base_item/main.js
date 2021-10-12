const mongoose = require("mongoose")

const options_base_item = {
    discriminatorKey: '_typeid',
    collection: 'items'
}

const schema_base_item = new mongoose.Schema({
    _typeid: String,
    render_item: String,
    _id: mongoose.Schema.Types.ObjectId,
    _name: { type : String, unique : true },
    sub_externals: [String]

}, options_base_item); 

const model = new mongoose.model("base_item", schema_base_item)

module.exports = {model}
