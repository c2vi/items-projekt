const model_base_item = require("../base_item/main").model
const moodle_client = require("moodle-client")
const mongoose = require("mongoose")
const fetch = require("node-fetch-commonjs").default


schema = new mongoose.Schema({
	username: String,
	password: String,
	wstoken: String,
	wwwroot: String,
	icon: {type: mongoose.Schema.Types.ObjectID, ref: "icon_item"},
	courses: [String],
})


schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })


// schema.virtual("token").get( async function(){

// 	const res = await fetch(this.wwwroot + "/login/token.php?" + new URLSearchParams({
// 		username: this.username,
// 		password: this.password,
// 		service: "moodle-mobile-app",
// 	}))
// 	const tokens = await res.json()
	
// 	// console.log("------------------"+tokens.token)
// 	return tokens.token
// })

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


async function get_external_props(external_prop_keys, item){
	const moodle_site = await model_base_item.findById(item._id)
	let external_props = {}
	await Promise.all(external_prop_keys.map( async prop_key => {
		switch(prop_key){
			case "enrolled_courses":

				const res = await fetch(moodle_site.wwwroot + "/webservice/rest/server.php?" + new URLSearchParams({
					wsfunction: "core_course_get_enrolled_courses_by_timeline_classification",
					moodlewsrestformat: "json",
					classification: "all",
					wstoken: moodle_site.wstoken,
				})).catch( () => {
					console.log("fetch of moodle failed")
					// return {_id: pre_item_id, _typeid: "moodle_course", external: true, error: "could not fetch external item"}
				})

				// if (!res){
				// 	return {_id: pre_item_id, _typeid: "moodle_course", external: true, error: "could not fetch external item"}
				// }

				const courses = await res.json()
				const course_ids = courses.courses.map(course => course.id)
				const ids = course_ids.map(course_id => `!moodle_course!${item._id}!${course_id}`)

				//return ["!moodle_course!moodle_site_id!courseid"]
				external_props.enrolled_courses = ids
				return

				break
		}
	}))
	return external_props
}

module.exports = {model, init, get_external_props}