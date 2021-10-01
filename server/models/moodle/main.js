const model_base_item = require("../base_item/main").model
const moodle_client = require("moodle-client")
const mongoose = require("mongoose")

require("dotenv").config()

schema = new mongoose.Schema({
	password: String,

    text: String

})

const model = model_base_item.discriminator("moodle_test", schema)


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