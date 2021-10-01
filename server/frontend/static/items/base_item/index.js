export class BaseItemClass extends HTMLElement {
	constructor(){
		super()
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