//imports
const https = require('https')
const mongoose = require("mongoose")
const {fetch, Request, Response} = require('undici')
// const {mongo} = require("../../server")

log = console.log

// require("dotenv").config()


const mongo = mongoose.connect("mongodb://192.168.1.2:27017/pitem",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {console.log("Successfully connected to MongoDB")}).catch((err) => {console.log("Error while connecting to MongoDB" + err)})

//exports
// module.exports = {model}

const options = {
    discriminatorKey: 'e',
    collection: 'thingsdb',
}

const schema_things_db = new mongoose.Schema({
	e: String,
	_id: String,

}, options); 



const schema_Task6 = new mongoose.Schema({
	p:{
		acrd: Number,
		ar: [String],
		cd: Number, 
		dd: Number, 
		dl: [Number],
		do: Number,
		icc: Number,
		icp: Number,
		icsd: Number,
		ix: Number,
		md	: Number,
		nt	: String,
		pr: [String],
		rr: String,
		rt: [String],
		sp: Number,
		sr: Number,
		tir: Number,
		ss: Number,
		st: Number,
		sb: Number,
		tg	: [String],
		ti: Number,
		tp: Number,
		tr	: Number,
		tt: String,
	}
})

const schema_Tag4 = new mongoose.Schema({
	p: {
		//array of parrent tags
		pn: String,

		//index
		ix: String,

		//always null
		// sh: null,

		//Titele
		tt: String,
	}
})

const schema_ChecklistItem3 = new mongoose.Schema({

	p: {
		// lt: String,

		//Createion Date
		cd: Number,

		//Tasks
		ts: [String],

		//Submission Date
		sp: Number,

		//Statud
		ss: String,

		//Modification Date
		md: Number,

		//Title
		tt: String,

		//index
		ix: Number,
	}

})


const model_things_db = new mongoose.model("thingsdb", schema_things_db)
const model_Task6 = model_things_db.discriminator("Task6", schema_Task6)
const model_Tag4 = model_things_db.discriminator("Tag4", schema_Tag4)
const model_ChecklistItem3 = model_things_db.discriminator("ChecklistItem3", schema_ChecklistItem3)

function auth(){

	const options = {
		hostname: 'cloud.culturedcode.com',
  		port: 443,
		path: '/version/1/account/gen.ohm.3@gmail.com/own-history-key',
  		method: 'GET',
		headers: {
			Authorization: 'Password g.e.n.o.h.m.6',
			Connection: 'Keep-Alive',
			"User-Agent": 'nobody cares',
		},
	}

	const req = https.request(options, res => {

		let test = ""

		res.on('data', (data) => {
			test += data.toString()
  		})
		
		res.on('end', () => {
		  console.log(JSON.parse(test))
		})

	})

	req.on('error', (e) => {
		console.error(e);
	})

	req.end()

}

async function sync_down(start_index){
	const res = await fetch('https://cloud.culturedcode.com/version/1/history/20b3f333-d7e1-4827-a00e-ab4439f22b8c/items?start-index=0', {})
	return await res.json()
}


function validate_ObjektId(id){
	if (mongoose.Types.ObjectId.isValid(id)){
		if (mongoose.Types.ObjectId(id) == id) {
			return true;

		}
	} else {return false;}
}

let counter = 0
async function write_to_db(data){
	// log(data.items[0]["KvE3F4pK8A7ngCeWuEckNA"].p)

	for (commit of data.items){

		log("Commit number: " + counter)
		log("====================================")

		for ( id in commit){
			//a task we have to do to the database to keep it up to date
			const task = commit[id];

			//only deal with todos so far
			if (task.e == "Task6"){

				log("-----------------")
				log(task)
				log(id)

				//create a new item
				if (task.t == 0){
					const {nt, rr, ...things} = task.p
					const item = new model_Task6({p:things, _id: id})
					item.save((err) => {
						if (err) {console.log("Error with inserting a things task: " + err)}
					})

				//update a item
				} else if (task.t == 1){

				//delete a item
				} else if (task.t == 2){
					console.log("deleting a todo")
					const item = model_Task6.deleteOne({_id: id}).then(() => console.log("actually deleted")).catch((err) => console.log("not deleted: " +err))


				}
			}
		}
		counter++
		if (counter == 1){break}
	}
}

//testing

async function main() {
	const data = await sync_down(0)
	// log(data)
	await write_to_db(data)
	return;
}

main()