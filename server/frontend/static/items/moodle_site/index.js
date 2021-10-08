import {BaseItemClass} from "../base_item/index.js"
export class Component extends BaseItemClass {
	constructor(){
		super()
		this.shadow_dom = this.attachShadow({ mode: "open"})
		this.shadow_dom.innerHTML = '<style> @import "/static/items/moodle_site/main.css" </style> '
	}

	
	connectedCallback(){
		this.render_func(this.item)
	}


	async render_func(item) {
		//make sure icon item is laoded - which is not necessary now
		// await get_renders([{item_typeid: "icon_item", render_id: "something"}])

		//get icon item
		const [icon_item] = await this.site.get_items([item.icon], {})

		if (this.render.render_id == "pc_in_folder"){

		this.shadow_dom.innerHTML = `
			<div class="in_folder"> 
				<img hight="50" width="50" src="${icon_item.url}"></img>
				<div> ${item._typeid}</div>
				<div> ${item._name}</div>
			</div>
		`

		} else if (this.render.render_id == "pc_full"){
			this.shadow_dom.innerHTML = "hallo"

		}
		

	}


}

customElements.define("moodle-site", Component)