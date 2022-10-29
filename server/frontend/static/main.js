let item_cache = [] //simpli a list of items

let render_cache = {}

let cache_names = []

let render_info_cache = []

const site = {}


//##functions
async function get_items(ids, options){

	//check if items already in chache
	const cached_items = [ ...item_cache.filter(item => ids.includes(item._id)), ...item_cache.filter(item => ids.includes(item._name))]

	const list_of_ids_and_names = [...cached_items.map( item => item._id), ...cached_items.map( item => item._name)]

	const items_to_request = ids.filter( id => ![...cached_items.map( item => item._id), ...cached_items.map( item => item._name)].includes(id))

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

	//returning all items that were asked for
	return [...data.items, ...cached_items]
};

async function get_render_info(render_id){

	//check if render_info is cached
	const render_info_in_cache = render_info_cache.filter( info => info.render_id == render_id)
	
	let render_info;
	if (render_info_in_cache.length == 0) {
		//if not cached get render_info
		const info_res = await fetch(`/static/items/${render_id}/index.json`)
		render_info = await info_res.json()
		render_info_cache = [render_info, ...render_info_cache]
	} else {
		render_info = render_info_in_cache[0]
	}

	return render_info
}


async function render_item(item, render_desc, parent_element){

	let render_info = {}
	try {
		render_info = await get_render_info(render_desc.render_id)
	} catch (err) {
		render_info = await get_render_info("base_item")
	}

	let render_obj = {}
	if (render_info.alltypes){
		render_obj = render_info.objects[0]
	} else {
		render_obj = render_info.objects.filter( object => object.type == render_desc.type)[0]
	}

	//if render not already cached
	if (!render_obj._cache_name){

		render_obj._cache_name = new_cache_name()

		const render = await import(`/static/items/${render_info.render_id}/${render_obj.file_path}`)
		render_cache[render_obj._cache_name] = render.Main

		customElements.define(render_obj._cache_name, render_cache[render_obj._cache_name])
	}

	//actualy render the item
	parent_element.innerHTML=""
	const element_tag = render_obj._cache_name
	const item_element = document.createElement(element_tag);
	item_element.item = item
	item_element.render_desc = render_desc
	item_element.render_obj = render_obj
	item_element.id = item._id
	parent_element.appendChild(item_element)
}

function new_cache_name(){
	const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")

	while (true){
		let id = Math.random().toString(36).substr(2, 14)
		const array = [...id].filter(char => alphabet.includes(char))
		id = array.join("-")
		if (!cache_names.includes(id)){
			cache_names.push(id)
			return id
			break
		}
	}

}

function nav_to(path){
	history.pushState(null, null, path);
	main();
}

async function update_item(data, nota_socket_event ,callback_on_success){

	//get the whole item (not just the things that changed)
	// const [item_element] = item_elements.filter(element => element.item._id == data.item._id)
	const item_element = document.getElementById(data.item._id);
	const new_item = {...item_element.item, ...data.item}

	data.item = new_item;

	//send an update to the server
	if (!data.socket_event){
		const test = JSON.stringify(data)
		socket.emit('update_item', test)
	}

	//update the item in the cache
	item_cache = item_cache.map( (old_item) => {
		if (old_item._id == new_item._id){
			return new_item
		} else {
			return old_item
		}
	})

	//rerender the item
	if (item_element.update) {
		item_element.update(data)
	} else {
		render_item(new_item, item_element.render_desc, item_element.parentElement)
	}

	//set the item of item_element to the new one
	item_element.item = data.item

}

//##main function
async function main() {

	// check what route we are on
	let id = location.pathname.slice(1)

	//load "main" item by default
	if ( id === "" ) { id = "main"}

	const [item] = await get_items([id], {})

	const render_desc = {
		render_id: item.render_id ? item.render_id : item._typeid,
		for_item_type: item._typeid,
		type: "full",
		plattform: "browser",
		user_agent: navigator.userAgent,
		from_render: "browser_main",
	}

	const item_frame = document.getElementById("item-frame")
	await render_item(item, render_desc, item_frame)

	//update url
	history.replaceState(null, null, item._name ? item._name : item._id);


}


//##Eventlisteners

window.addEventListener("popstate", e => {
main();
})

//socketio stuff
const socket = io.connect("/")

socket.on("connect", (id) => {
})

socket.on("update_item", data => {
	data.socket_event = true
	update_item(data)
})

document.body.addEventListener("click", e => {
	if (e.target.matches("[no-reload]")) {
		e.preventDefault();
		nav_to(e.target.href);
	}
});

main()
