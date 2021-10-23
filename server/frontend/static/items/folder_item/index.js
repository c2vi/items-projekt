import {BaseItemClass} from "../base_item/index.js"

export class Folder extends BaseItemClass {
	constructor(){
		super()
		this.shadow_dom = this.attachShadow({ mode: "open"})
		this.shadow_dom.innerHTML = '<style> @import "/static/items/folder_item/main.css" </style> '
		this.wrapper = document.createElement("div")
		this.wrapper.className = "folder-wrapper"
		this.shadow_dom.appendChild(this.wrapper)
	}

	
	connectedCallback(){
		this.render_func(this.item)
	}

	// async update_item(item){
	// 	const folder_element = this.shadow_dom.getElementById(item._id)
	// 	const url = `/static/items/${item._typeid}/index.js`
	// 	const item_render = await import(url)

	// 	const render = { simple_type : "pc_in_folder"}
	// 	const item_element = document.createElement(item._typeid.split('_').join("-"));

	// 	item_element.item = item
	// 	item_element.site = this.site
	// 	item_element.render = render
	// 	folder_element.innerHTML = ""
	// 	folder_element.appendChild(item_element)
	// }

	handle_dblclick(event, id){
		console.log(event)
		if (event.originalTarget.tagName.toLowerCase() == "button"){return}

		nav_to(id)

	}

	async render_func(item) {

		if (this.render.render_id == "pc_full"){

			//like this the folder_item object is accessible from anywhere
			this.site.folder_item = this

			let item_ids = []
			if (item.external_items){
				item_ids = [ ...item.items, ...item.external_items]
			} else {
				item_ids = item.items
			}

			//first load out a placeholder for all the items
			const item_one_elements = item_ids.map( (id) => {
				const folder_element = document.createElement("div")
				folder_element.id = id
				folder_element.setAttribute("ondblclick", `site.folder_item.handle_dblclick(event,"${id}")`)
				folder_element.className = "folder-element"
				this.wrapper.appendChild(folder_element)
				return folder_element
			})

			//then request the whole items
			const items = await this.site.get_items(item_ids, {})

			//make sure, that all renders are present
			const render_infos = items.map( item => {return {item_typeid: item._typeid, render_id:"pc_in_folder"} })
			await get_renders(render_infos)

			for (const item of items) {

				const [folder_element] = item_one_elements.filter( element => element.id === item._id)
				render_item(item, {item_typeid: item._typeid, render_id:"pc_in_folder"}, folder_element)

				// folder_element.draggable = true
				// const item_element = document.createElement(item._typeid.split("_").join("-"))
				// item_element.item = item
				// item_element.site = this.site
				// item_element.render = {item_typeid: item._typeid, render_id: "pc_in_folder"}
				// folder_element.appendChild(item_element)
			}

			// document.addEventListener("dblclick", e => {
			// 	console.log("dblclick", e.target)
			// 	if (e.target.in_folder_dblclick){e.target.in_folder_dblclick(e)}
			// 	else (site.nav_to(e.target.item._id))
			// })


		} else if (this.render.render_id == "pc_in_folder"){

			this.shadow_dom.innerHTML = `
				<style> @import "/static/items/folder_item/in_folder.css" </style>
				<div class="in_folder"> 

					<img class="icon" hight="50" width="50" src="/static/folder_icon.png"></img>
					<div class="info">
						<div class="line">${item._typeid}</div>
						<div class="line">${item._name}</div> 
					</div>
					
				</div>
			`
		}


	}



}




customElements.define("folder-item", Folder)