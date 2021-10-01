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

		if (this.render.simple_type == "pc_in_folder"){

		this.shadow_dom.innerHTML = `
			<div class="in_folder"> 
				<img hight="50" width="50" src="${item.icon.url}"></img>
				<div> ${item._typeid}</div>
				<div> ${item._name}</div>
			</div>
		`

		} else if (this.render.simple_type == "pc_full"){
			this.shadow_dom.innerHTML = "hallo"

		}
		

	}


}

customElements.define("moodle-site", Component)