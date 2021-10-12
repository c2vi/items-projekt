
const API_URL = "api"
let item_cache = [] //simpli a list of items

let render_cache = {}


//##functions
async function get_items(ids, options){

	//check if items already in chache
	const cached_items = [ ...item_cache.filter(item => ids.includes(item._id)), ...item_cache.filter(item => ids.includes(item._name))]

	const list_of_ids_and_names = [...cached_items.map( item => item._id), ...cached_items.map( item => item._name)]

	const items_to_request = ids.filter( id => ![...cached_items.map( item => item._id), ...cached_items.map( item => item._name)].includes(id))
	// console.log("--------------------------------------------")
	// console.log("list", list_of_ids_and_names)
	// console.log("item_cache ", item_cache)
	// console.log("items to request ",items_to_request)

	//if there are no items to request... return the cahced_items before sending the request
	if (items_to_request.length === 0){return cached_items}

	//request the items, that are not in cache
	const res = await fetch("=items", {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ids: items_to_request, options}),
	})
	const data = await res.json()

	//adding the requested items to the cache
	item_cache = [...item_cache, ...data.items]
	// console.log("item_cache afterwards ",item_cache)

	//returning all items that were asked for
	return [...data.items, ...cached_items]
};

async function get_renders(render_infos, call_after_every_render){

	//later maybe get all renders in one call
	//but now a for loop

	//check for items that are in render
	const already_in_cache = render_infos.filter(render_info => Object.keys(render_cache).includes(render_info.item_typeid))


	for (const render_info of render_infos){
		const render = import(`/static/items/${render_info.item_typeid}/index.js`)
		if (call_after_every_render){call_after_every_render(render)}
		render_cache[render_info.item_typeid] = render
	}
}


function nav_to(path){
    history.pushState(null, null, path);
    main();
}

function update_item(item, callback){

}

async function render_item(item, render_info, parent_element){

	//render the item
	parent_element.innerHTML=""
	const element_tag = item._typeid.split("_").join("-")
	const item_element = document.createElement(element_tag);
	item_element.item = item
	item_element.site = site
	item_element.render = render_info
	parent_element.appendChild(item_element)


}


//##site-object
//for passing params down to item_renderers
const site = {
	nav_to,
	update_item,
	get_items,
	get_renders,
	render_item,
	socket: io.connect(),
}

//##main function
async function main() {

	// check what route we are on
	let id = location.pathname.slice(1)
	if ( id === "" ) { id = "main"}

	const [item] = await get_items([id], {

	})

	await get_renders([{item_typeid: item._typeid}])



	const item_frame = document.getElementById("item-frame")
	render_item(item, {item_typeid: item._typeid, render_id: "pc_full"}, item_frame)

	//update url
	history.replaceState(null, null, item._name ? item._name : item._id);


}


//##Eventlisteners

window.addEventListener("popstate", e => {
	main();
})

document.addEventListener("DOMContentLoaded", () => {

	//socketio stuff
	// const socket = io.connect("/")

	site.socket.on("connect", (id) => {
	})



	

	document.body.addEventListener("click", e => {
		if (e.target.matches("[no-reload]")) {
			e.preventDefault();
			nav_to(e.target.href);
		}
	});

	main()
});
