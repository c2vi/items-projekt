import {BaseItemClass} from "../base_item/index.js"
// const BaseItemClass = import("../base_item/index.js").then( testing => {console.log(testing)})

export class Folder extends BaseItemClass {
	constructor(){
		super()
		this.shadow_dom = this.attachShadow({ mode: "open"})
		this.shadow_dom.innerHTML = '<style> @import "/static/items/folder_item/item_element.css" </style> '
		this.wrapper = document.createElement("div")
		this.wrapper.className = "folder-wrapper"
		this.shadow_dom.appendChild(this.wrapper)
	}

	
	connectedCallback(){
		this.render_func(this.item)
	}

	async render_func(item) {


		if (this.render.simple_type == "pc_full"){

			[ ...item.items, ...item.external_items].forEach( async (item) => {

				const item_render = await import(`/static/items/${item._typeid}/index.js`)

				const render = { simple_type : "pc_in_folder"}

				const folder_element = document.createElement("div")
				folder_element.id = item._id
				folder_element.setAttribute("ondblclick", `site.nav_to("${item._id}")`)
				folder_element.className = "folder-element"
				this.wrapper.appendChild(folder_element)

				// const item_element = document.createElement(item._typeid.split('_').join("-"));
				const tmp = Object.values(item_render)[0]
				const item_element = new tmp()
				item_element.item = item
				item_element.site = this.site
				item_element.render = render
				folder_element.appendChild(item_element)


			})
		} else if (this.render.simple_type == "pc_in_folder"){

			this.shadow_dom.innerHTML = `
				<p> ${item._typeid}</p>
				<p> ${item._name}</p>
			`
		}


	}



}




customElements.define("folder-item", Folder)