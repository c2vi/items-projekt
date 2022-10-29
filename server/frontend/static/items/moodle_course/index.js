// import {Main as BaseItemClass} from "../base_item/index.js"
export class Main extends HTMLElement {
	constructor(){
		super()
		this.shadow_dom = this.attachShadow({ mode: "open"})
	}

	
	connectedCallback(){
		this.render_func(this.item)
	}

	set_inner_html(elm, html) {
		elm.innerHTML = html;
		Array.from(elm.querySelectorAll("script")).forEach( oldScript => {
			const newScript = document.createElement("script");
			Array.from(oldScript.attributes)
				.forEach( attr => newScript.setAttribute(attr.name, attr.value) );
			newScript.appendChild(document.createTextNode(oldScript.innerHTML));
			oldScript.parentNode.replaceChild(newScript, oldScript);
		});
	}


	async render_func(item) {

		if (this.render_desc.type == "full") {
			if (!item.alias){item.alias = item.shortname}
			
			this.shadow_dom.innerHTML += `
				<link rel="stylesheet" href="/static/items/moodle_course/pc_full.css" >
			`

			const mustache = await import("/static/mustache.js")

			//getting the html
			const request = new XMLHttpRequest();
			request.open( 'GET', '/static/items/moodle_course/pc_full.html', true );
			request.addEventListener( 'load', (event) => {
			const template = event.target.response;
			const result = mustache.default.render( template, item)
			this.shadow_dom.innerHTML += result;
			});
			request.send();


			console.log("course", item)


		} else if (this.render_desc.type = "in_folder") {
			this.shadow_dom.innerHTML = `
				<p> ${item.id}</p>
				<p> ${item.alias ? item.alias : item.shortname}</p>
			`

		}


	}


}