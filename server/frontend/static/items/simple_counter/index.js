export async function render(data, render, site){

	let html = 'hallo';

	if ( render.simple_type == "pc_full") {

		document.body.addEventListener("click", (e) => {
			console.log(e.target.id)
		})

		html = `
		<button id="${data._id}:test-button">TEST</button>	
		`


	} else if ( render.simple_type == "pc_in_folder") {
		html = `
		<div id="${data._id}">
		<p>${data.counter_name}</p>
		<p>${data.value}</p>
		</div>
		`
	}
	return html

}