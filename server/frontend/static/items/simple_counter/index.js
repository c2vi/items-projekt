import { BaseItemClass } from "../base_item/index.js"
export class simple_counter extends BaseItemClass {
	constructor(){
		super()
		this.shadow_dom = this.attachShadow({ mode: "open"})
	}

	
	connectedCallback(){
		this.render_func(this.item)
	}

	// in_folder_dblclick(e){
	// 	console.log("in_folder_dblclick")
	// 	site.nav_to(item._id)
	// }

	increment(id) {
		const item_element = item_elements.filter( element => element._id == id)
		console.log(item_element)

		const update = {
			_typeid: "simple_counter",
			_id: item._id,
			value: item.value + 1
		}

		update_item(update)
		console.log("increment")

	}

	decrement(id) {
		console.log("decrement")
	}


	async render_func(item) {


			// this.shadow_dom.addEventListener("dblclick", e => {
			// 	if (e.target.tagName != "BUTTON"){
			// 		console.log("dblclick")
			// 		site.nav_to(item._id)

			// 	}
			// })

			// <p> <button onclick='site.update_item({ _typeid: "${item._typeid}",_id: "${item._id}", value: ${item.value}+1})' > + </button>  ${item.value}  <button onclick='site.update_item({ _typeid: "${item._typeid}", _id: "${item._id}", value: ${item.value}-1})' > - </button></p>
		
			// <p id="vlaue"> <button onclick='render_cache.simple_counter.simple_counter.prototype.increment("${item._id}")' > + </button>  ${item.value}  <button onclick='render_cache.simple_counter.simple_counter.prototype.decrement(${id})' > - </button></p>

		this.shadow_dom.innerHTML = `
			<p> ${item._name}</p>
			<p id="vlaue"> <button onclick='update_item({ _typeid: "${item._typeid}", _id: "${item._id}", value: ${item.value}+1})' > + </button>  ${item.value}  <button onclick='update_item({ _typeid: "${item._typeid}", _id: "${item._id}", value: ${item.value}-1})' > - </button></p>
			<style>
			button {
				margin-left:10px;
				margin-right:10px;
				padding-left:10px;
				padding-right:10px;
				z-index:5;
			}
			
			</style>
		`

	}


}

customElements.define("simple-counter", simple_counter)
