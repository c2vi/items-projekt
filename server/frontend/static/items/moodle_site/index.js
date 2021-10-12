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

		this.shadow_dom.innerHTML += `
			<div class="in_folder"> 

				<img class="icon" hight="50" width="50" src="${icon_item.url}"></img>
				<div class="info">
					<div class="line">${item._typeid}</div>
					<div class="line">${item._name}</div> 
					<div class="line">${item.username}</div> 
				</div>
				
			</div>
		`

		} else if (this.render.render_id == "pc_full"){

			//make sure the moodle course render is available
			await site.get_renders([{item_typeid: "moodle_course", render_id: "pc_in_folder"}, {item_typeid: "folder_item", render_id: "pc_in_folder"}])

			const courses_item = {
				_id: "!moodle_courses",
				_typeid: "folder_item",
				external_items: item.enrolled_courses,
				items: []
			}

			const courses_wrapper = document.createElement("div")
			courses_wrapper.className = "course-wrapper"
			this.shadow_dom.appendChild(courses_wrapper)

			render_item(courses_item, {item_typeid: item._typeid, render_id: "pc_full"}, courses_wrapper)

		}
		

	}


}

customElements.define("moodle-site", Component)