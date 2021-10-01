const model_base_item = require("../base_item/main").model
const moodle_client = require("moodle-client")
const mongoose = require("mongoose")


schema = new mongoose.Schema({
	username: String,
	password: String,
	wstoken: String,
	wwwroot: String,
	icon: {type: mongoose.Schema.Types.ObjectID, ref: "icon_item"}
})


schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })


schema.virtual("token").get( function(){
	return "d5a44f352d8f8b6b79f980bd3da171b9"
})
// .set(function(token){
// 	token = this.token
// 	return "d5a44f352d8f8b6b79f980bd3da171b9"
// })


const model = model_base_item.discriminator("moodle_site", schema)


async function init(){

	// const client = await moodle_client.init({
	// 	wwwroot:"https://moodle2.htlinn.ac.at/",
	// 	username: process.env.MOODLE_USERNAME,
	// 	password: process.env.MOODLE_PASSWORD,
	// }).then(function(client) {
	// return do_something(client);

	// }).catch(function(err) {
	// console.log("Unable to initialize the client: " + err);
	// });

	// function do_something(client) {
	// return client.call({
	// 	wsfunction: "core_course_get_courses",

	// }).then(function(info) {
	// 	console.log(info);
	// 	return;
	// });
	// }





}

module.exports = {model, init}