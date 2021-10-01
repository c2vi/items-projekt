import {BaseItemClass} from "../base_item/index.js"

export class Element extends BaseItemClass {
	constructor(){
		super()
		this.shadow_dom = this.attachShadow({ mode: "open"})
	}

	
	connectedCallback(){
		this.render_func(this.item)
	}


	async render_func(item) {
		
		this.shadow_dom.innerHTML = `
			<p> ${item._typeid}</p>
			<p> ${item._name}</p>
		`

	}


}

customElements.define("icon-item", Element)