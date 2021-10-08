import {BaseItemClass} from "../base_item/index.js"
export class PlainText extends BaseItemClass {
	constructor(){
		super()
		this.shadow_dom = this.attachShadow({ mode: "open"})
	}

	
	connectedCallback(){
		this.render_func(this.item)
	}


	async render_func(item) {
		this.id = item._id
		
		this.shadow_dom.innerHTML = `
			<p> ${item._typeid}</p>
			<p> ${item._name}</p>
		`

	}


}

customElements.define("computer-game", PlainText)