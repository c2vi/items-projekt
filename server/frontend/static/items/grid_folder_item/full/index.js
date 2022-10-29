export class Main extends HTMLElement {
	constructor(){
		super()

		this.grid_px_size = 75

		this.shadow_dom = this.attachShadow({ mode: "open"})

		this.shadow_dom.innerHTML = `
			<link rel="stylesheet" href="/static/items/grid_folder_item/full/main.css" >
		`
		
		this.rect = this.getBoundingClientRect()

		this.wrapper = document.createElement("div")
		this.wrapper.className = "folder-wrapper"
		this.shadow_dom.appendChild(this.wrapper)
	}

	add_external_items(item) {
		let item_ids = []
		if (this.item.external_items){
			item_ids = [ ...this.item.items, ...item.external_items]
		} else {
			item_ids = this.item.items
		}
		return item_ids

	}

	
	handle_dblclick(event, id){
		if (event.target.tagName.toLowerCase() == "button"){return}
		nav_to(id)
	}

	cal_grid_location(grid_location, event){
		grid_location.x = Math.floor(event.x / this.grid_px_size)
		grid_location.y = Math.floor(event.y / this.grid_px_size)
	}

	update(data) {
		if (!data.socket_event){return}

		const element = this.shadow_dom.getElementById("grid-view")

		element.childNodes.forEach(node => {
			const [grid_item] = data.item.render_info.grid_folder_item.grid.filter(grid_item => grid_item.id == node.id)
			node.set_grid_location(grid_item.location)
		})
	}


	async connectedCallback(){

		class GridItem extends HTMLElement{
			constructor(id, grid_item){
				super()
			}

			set_grid_location(grid_location){
				this.style["grid-area"] = `${grid_location.y} / ${grid_location.x} / span ${grid_location.height} / span ${grid_location.width}`
			}

			//move with animation
			move_to(grid_location){

			}
		}
		try {
			customElements.define(this.render_obj._cache_name+"-griditem", GridItem)
		} catch {}

		this.grid = this.item.render_info.grid_folder_item.grid

		// this.grid = this.item.render_info.grid_folder_item.grid

		//make sure all items are added to the grid (have grid coordinates)
		//i can't do this here, bcs i don't know the size of the item yet
		// for (id of item_ids){
		// 	if (grid.filter( sth => sth.id == id).length > 0){continue}

		// 	add_item_to_grid(id)
		// }



		if (!site.grid_folder_item) {site.grid_folder_item = {}}

		this.grid_view = document.createElement("div")
		this.grid_view.className = "grid-view"
		this.grid_view.id = "grid-view"
		this.wrapper.appendChild(this.grid_view)


		function onDrop(event, tis){
			const x = Math.floor((event.x + tis.grid_px_size * 1.5 - tis.drag_offset_x - tis.rect.left) / tis.grid_px_size)
			const y = Math.floor((event.y + tis.grid_px_size * 1.5 - tis.drag_offset_y - tis.rect.top) / tis.grid_px_size)

			const element = tis.shadow_dom.getElementById(tis.dragged_grid_item.id)
			const new_grid_item = {...tis.dragged_grid_item, location: {...tis.dragged_grid_item.location, x, y}}
			element.set_grid_location(new_grid_item.location)

			//destroy other tmp class elements
			try {
				tis.shadow_dom.getElementById("tmp").remove()
			} catch {}

			const other_grid_items = tis.item.render_info.grid_folder_item.grid.filter( sth => sth.id != new_grid_item.id)
			update_item({item: {_typeid: tis.item._typeid, _id: tis.item._id, render_info:{grid_folder_item:{grid: [...other_grid_items, new_grid_item]}}}})
			
		}

		this.shadow_dom.addEventListener("dragstart", event => {
			this.dragged_grid_item = event.target.grid_item

			const rect = event.target.getBoundingClientRect()
			this.drag_offset_x = event.x - rect.left
			this.drag_offset_y = event.y - rect.top

			//to make it work in chrome
			event.dataTransfer.setData('text/html', "test");
			event.dataTransfer.effectAllowed = 'move';
		})

		this.shadow_dom.addEventListener("dragenter", event => {event.preventDefault()})

		this.shadow_dom.addEventListener("dragover", event => {
			event.preventDefault()

			//destroy other tmp class elements
			try {
				this.shadow_dom.getElementById("tmp").remove()
			} catch {}

			const tmp = document.createElement("div")
			// location = this.cal_grid_location(this.dragged_grid_item.location, event)
			const x = Math.floor((event.x + this.grid_px_size * 1.5 - this.drag_offset_x - this.rect.left) / this.grid_px_size)
			const y = Math.floor((event.y + this.grid_px_size * 1.5 - this.drag_offset_y - this.rect.top) / this.grid_px_size)
			tmp.style["grid-area"] = `${y} / ${x} / span ${this.dragged_grid_item.location.height} / span ${this.dragged_grid_item.location.width}`
			tmp.className = "tmp"
			tmp.id = "tmp"
			this.grid_view.appendChild(tmp)
			tmp.addEventListener("drop", event => onDrop(event, this))
		})

		this.shadow_dom.addEventListener("drop", event => onDrop(event, this))


		//first load out a placeholder for all the items
		for (const id of this.add_external_items(this.item)) {
			const [grid_item] = this.grid.filter(sth => sth.id == id)
			const grid_element = document.createElement(this.render_obj._cache_name+"-griditem")
			grid_element.className = "grid-item"
			grid_element.draggable = true
			grid_element.id = id
			grid_element.set_grid_location(grid_item.location)
			grid_element.grid_item = grid_item
			this.grid_view.appendChild(grid_element)
		}


		//then request the whole items
		const items = await get_items(this.item.items, {})

		for (const item of items) {

			const render_desc = {
				render_id: item.render_id ? item.render_id : item._typeid,
				type: "in_folder",
				for_item_type: item._typeid,
				from_render:"grid_folder_item",
				plattform:"browser",
			}

			const folder_element = this.shadow_dom.getElementById(item._id)
			await render_item(item, render_desc, folder_element)
		}


		this.shadow_dom.addEventListener("dblclick", e => {
			if (e.target.in_folder_dblclick){e.target.in_folder_dblclick(e)}
			else if (!e.target.id) {
				nav_to(e.target.parentElement.id)
			} else {
				nav_to(e.target.id)
			}
		})


	}


}