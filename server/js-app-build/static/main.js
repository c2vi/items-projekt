
const API_URL = "api"
const id = "main"






const fetchShownItem = async (id) => {
	const res = await fetch(API_URL + "/" + id)
	const data = await res.json()
	return data
};


fetchShownItem(id).then(response => {
	console.log(response)
	// set_shown_item(response)
})

