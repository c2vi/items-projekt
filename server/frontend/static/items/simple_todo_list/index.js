// import {Main as BaseItemClass} from "../base_item/index.js"
export class Main extends HTMLElement {
	constructor(){
		super()
		this.shadow_dom = this.attachShadow({ mode: "open"})

	}

	
	connectedCallback(){
		this.render_func(this.item)
	}

	array_equal(a, b) {
		if (a === b) return true;
		if (a == null || b == null) return false;
		if (a.length !== b.length) return false;

		for (var i = 0; i < a.length; ++i) {
			if (a[i] !== b[i]) return false;
		}
		return true;
	}

	update(data){
		if (this.render_desc.type == "in_folder"){
			this.render_func(data.item)
			return
		}
		const new_item = data.item


		//sometimes there are todos with an index of zero that you can't remove
		new_item.todos = new_item.todos.filter( todo => todo.index != null)

		async function rerender_todos(item_element, todos){
			//sorting Items and getting biggest_index
			let biggest_index = 0
			if (todos.length > 0) {
				todos.sort( (a, b) => a.index - b.index)
				biggest_index = todos[todos.length -1].index +1
			} else {biggest_index = 1}

			if (!item_element.mustache) {item_element.mustache = await import("/static/mustache.js")}

			const result = item_element.mustache.default.render(site.simple_todo_list.template, {...new_item, todos, biggest_index})
			const temp_element = document.createElement('div')
			temp_element.innerHTML = result
			item_element.shadow_dom.replaceChild(temp_element.firstChild, item_element.shadow_dom.lastElementChild)

		}


		const names_after = new_item.todos.map(todo=>todo.name)
		const names_before = this.item.todos.map(todo => todo.name)

		const status_after = new_item.todos.map(todo => todo.done)
		const status_before = this.item.todos.map(todo => todo.done)

		// console.log("new: ",names_after)
		// console.log("old: ",names_before)

		//if todo added or deletet
		if (new_item.todos.length != this.item.todos.length) {
			console.log("todo added or deleted")
			rerender_todos(this, new_item.todos)
			this.item.todos = new_item.todos
		}

		//if todo done status changed
		else if (!this.array_equal(status_after, status_before) && this.array_equal(names_before, names_after)) {
			rerender_todos(this, new_item.todos)
			this.item.todos = new_item.todos
		}

		//if order of todos changed
		else if (!this.array_equal(names_before, names_after)) {
			console.log("order changed")


			let dragged_todo = this.item.todos.filter(todo => todo.index == data.index_of_dragged)
			if (dragged_todo.length == 0) {
				dragged_todo = new_item.todos.filter(todo => todo.index == data.index_of_dragged)
			}
			dragged_todo = dragged_todo[0]
			dragged_todo.index += 0.5

			const [todo_to_insert] = new_item.todos.filter(todo => todo.name == dragged_todo.name)

			//##insert todo where it was dropped
			rerender_todos(this, [...new_item.todos, dragged_todo])
			


			//##do the animations
			const dropped_todo_element = this.shadow_dom.getElementById(todo_to_insert.index.toString()) //`${index_of_inserted}`)
			// dropped_todo_element.style.background = "red"
			dropped_todo_element.style.height = "0px"
			dropped_todo_element.style.transition = "0.15s linear"
			dropped_todo_element.style.height = parseFloat(getComputedStyle(dropped_todo_element).height) + 52 + 'px';

			const dragged_todo_element = this.shadow_dom.getElementById(dragged_todo.index.toString())
			// dragged_todo_element.style.background = "green"
			dragged_todo_element.style.overflow = "hidden"

			dragged_todo_element.style.height = "52px"
			dragged_todo_element.style.transition = "0.15s linear"
			dragged_todo_element.style.height = parseFloat(getComputedStyle(dragged_todo_element).height) - 52 + 'px';


			dropped_todo_element.addEventListener("transitionend", (e) => {
				rerender_todos(this, new_item.todos)
				dropped_todo_element.style.transition = ""
				dragged_todo_element.style.transition = ""
			})


			//##update the items in the component
			this.item.todos = new_item.todos

		}


	}

	reindex_todos(index_of_dragged, index_before){
		// console.log("index_of_dragged: ", index_of_dragged)
		// console.log("index_before: ", index_before)


		index_before = parseInt(index_before)

		const where_to_put_dragged = index_before -1
		const [dragged_todo] = this.item.todos.filter( todo => todo.index == index_of_dragged)

		//both without the todo that is dragged
		let todos_after_insertion_index = this.item.todos.filter( todo => todo.index > where_to_put_dragged && todo.index != index_of_dragged)
		// console.log("todos_after_insertion_index", todos_after_insertion_index)
		let todos_before_insertion_index = this.item.todos.filter(todo => todo.index <= where_to_put_dragged && todo.index != index_of_dragged)
		// console.log("todos_before_insertion_index", todos_before_insertion_index)

		//check if there is already sth at index_to_put_dragged
		const [todo_before_where_to_put_dragged] = this.item.todos.filter( todo => todo.index == index_before -1)
		if (todo_before_where_to_put_dragged) {

			index_before += 1
			todos_after_insertion_index = todos_after_insertion_index.map(todo => {
				return {name: todo.name, index: todo.index + 1, done: todo.done}

			})


		}
		const new_todos = [...todos_before_insertion_index, {done: dragged_todo.done, name: dragged_todo.name, index: index_before -1}, ...todos_after_insertion_index] 
		return new_todos

	}


	async render_func(item) {

		if (this.render_desc.type == "full"){


			
			if (!site.simple_todo_list) {site.simple_todo_list = {}}
			// site.simple_todo_list.handle_click = this.handle_click

			this.shadow_dom.innerHTML = `
				<link rel="stylesheet" href="/static/items/simple_todo_list/pc_full.css" >
			`


			//importing moustache -- should be moved to a system to import "render-helpers" or sth like also react
			this.mustache = await import("/static/mustache.js")

			//sorting Items
			let biggest_index = 0
			if (item.todos.length > 0) {
				item.todos.sort( (a, b) => a.index - b.index)
				biggest_index = item.todos[item.todos.length -1].index +1
			} else {biggest_index = 1}


			if (!site.simple_todo_list.template) {

			//getting the html
			const request = new XMLHttpRequest();
			request.open( 'GET', '/static/items/simple_todo_list/pc_full.html', true );
			request.addEventListener( 'load', (event) => {
			site.simple_todo_list.template = event.target.response;
			const result = this.mustache.default.render(site.simple_todo_list.template, {...item, biggest_index})
			this.shadow_dom.innerHTML += result;
			});
			request.send();

			} else {
			const result = this.mustache.default.render(site.simple_todo_list.template, {...item, biggest_index})
			this.shadow_dom.innerHTML += result;

			}

			document.addEventListener("keydown", (event) => {
				const input = this.shadow_dom.getElementById("test")
				input.focus()
				if (event.key === "Enter"){
					const test = this.shadow_dom.lastChild.getElementsByClassName("add")
					Array.from(test)[0].click()

				}
			})


			// this.shadow_dom.removeEventListener("dragstart" , (event) => {})
			this.shadow_dom.addEventListener("dragstart", (event) => {
				this.index_of_dragged = event.target.lastElementChild.id

			})

			// this.shadow_dom.removeEventListener("drop", (event) => {})
			this.shadow_dom.addEventListener("drop" , (event) => {
				if (event.target.className == "drag-ref"){
					event.target.style.background = ""
					
					//the index that the todo should be insertet BEFORE
					const index_before = event.target.id
					const new_todos = this.reindex_todos(this.index_of_dragged, index_before)

					update_item({index_of_dragged: this.index_of_dragged, item: {_id: this.item._id, _typeid: "simple_todo_list", todos: new_todos}})

				}
				//resetting index_of_dragged -- not using transferData, because i think it is too complicated and i could not figure it out
				this.index_of_dragged = 0

			})

			// this.shadow_dom.removeEventListener("dragover", (event) => {})
			this.shadow_dom.addEventListener("dragover" , (event) => {
				event.preventDefault()
			})

			// this.shadow_dom.removeEventListener("dragenter", (event) => {})
			this.shadow_dom.addEventListener("dragenter", (event) => {
				if (event.target.className == "drag-ref") {
					event.target.style.background = "gray"
				}
			})

			// this.shadow_dom.removeEventListener("dragleave", (event) => {})
			this.shadow_dom.addEventListener("dragleave", (event) => {
				if (["drag-ref-one", "drag-ref"].includes(event.target.className )) {
					event.target.style.background = ""
				}
			})

			// this.shadow_dom.removeEventListener("click", (event) => {})
			this.shadow_dom.addEventListener("click", (event) => {
				if (event.target.className == "checkbox" || event.target.className == "checked"){
					const index = event.target.id

					//create clone of todos, to not modify this.item
					const todos = this.item.todos
					const new_todos = todos.map( todo => {
						let bol = todo.done
						if (todo.index == index){
							bol = !todo.done
						}

						return Object.assign({}, todo, {
							done: bol,
						});
					})

					update_item({index_of_dragged: this.index_of_dragged, item: {_id: this.item._id, _typeid: "simple_todo_list", todos: new_todos}})


				} else if (event.target.className == "delete"){
					const index = event.target.id
					const new_todos = this.item.todos.filter( todo => index != todo.index)

					update_item({index_of_dragged: this.index_of_dragged, item:{_id: this.item._id, _typeid: "simple_todo_list", todos: new_todos}})

				} else if (event.target.className == "add") {
					const new_todo = {}
					let highest_index = 1
					if (this.item.todos.length != 0) {
						const {index} = this.item.todos.reduce((todo_with_highest_index, todo) => {
							if (todo.index > todo_with_highest_index.index) {return todo} else {return todo_with_highest_index}
						})
						highest_index = index
					} else {highest_index = 1}
					new_todo.index = highest_index + 1
					new_todo.name = this.shadow_dom.getElementById("test").value
					new_todo.done = false

					const new_todos = [...this.item.todos, new_todo]
					update_item({index_of_dragged: this.index_of_dragged, item: {_id: this.item._id, _typeid: "simple_todo_list", todos: new_todos}})


					
				}
			})





		} else if (this.render_desc.type == "in_folder"){

			const completed_todos = item.todos.filter(todo => todo.done)
			// const uncompleted_todos = item.todos.filter(todo => !todo.done)
			const percent = Math.round(completed_todos.length / item.todos.length * 100)

			this.shadow_dom.innerHTML = `
				<p> ${item._name}</p>
				<p> ${percent}% Completet!!</p>
			`

		}
	}
}