export async function render(data, render, site){

	let html = ""

	if (render.simple_type == "pc_full") {
		console.log("rendering folder in full")
		//go through all the items in the folder and render them with the render pc_in_folder
		const in_folder_render = { simple_type : "pc_in_folder"}

		async function render_folder_items() { 

			const test = await Promise.all(data.items.map( async item => {
				const item_render = await import(`/static/items/${item._typeid}/index.js`)
					// <button onClick='site.nav_to("${data._id}")'>
					// </button>
					// <div id="folder_item">
				return `
					<div ondblclick='site.nav_to("${item._id}")' id="folder_item" >
					${await item_render.render(item, in_folder_render, site)}
					</div>

					`
			}))
			return test.join("")
		}

		html = `
			<link rel="stylesheet" type="text/css" href="static/items/folder/pc_full.css" >
			<div id="folder_wrapper" >
			${await render_folder_items()}
			</div>
			`

	} else if (render.simple_type == "pc_in_folder") {
		html = `
			<p>${data.folder_name}</p>
			
		`

	} else { html = "unknown render"}

	return html
}