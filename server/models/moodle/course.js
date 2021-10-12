const model_base_item = require("../base_item/main").model
const mongoose = require("mongoose")
const fetch = require("node-fetch-commonjs").default
// console.log(fetch)

const schema = mongoose.Schema({
    site: {type: mongoose.Schema.Types.ObjectID , ref: "moodle_site"},
    course_id: Number,
    saved_name: String,
})

const model = model_base_item.discriminator("moodle_course", schema)

async function get_external(pre_item_id){

	const moodle_site = await model_base_item.findById(pre_item_id.split("!")[2])
	const course_id = pre_item_id.split("!")[3]

	const res = await fetch(moodle_site.wwwroot + "/webservice/rest/server.php?" + new URLSearchParams({
		wsfunction: "core_course_get_enrolled_courses_by_timeline_classification",
		moodlewsrestformat: "json",
		classification: "all",
		wstoken: moodle_site.wstoken,
	})).catch( () => {
		console.log("fetch of moodle failed")
		// return {_id: pre_item_id, _typeid: "moodle_course", external: true, error: "could not fetch external item"}
	})

	if (!res){
		console.log("no response - moodle course")
		return {_id: pre_item_id, _typeid: "moodle_course", external: true, error: "could not fetch external item"}
	}
	const courses = await res.json()
	// console.log("res"+courses)
	const course = courses.courses.filter( course => course.id == course_id)
	return { ...course["0"], _id: pre_item_id, _typeid: "moodle_course", external: true}

}

async function init(){

}

module.exports = {model, get_external, init}




