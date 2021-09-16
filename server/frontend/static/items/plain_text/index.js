export function test(){
	console.log("hello from folder item")
}

export async function render(data){
	return `
	<div id="${data._id}">
	<p>${data.text}</p>
	</div>
	`
}


	// ${data.items.map( (item) => {
	// 	return `<p>--------------------</p><h3>${item._typeid}</h3>`
	// })}	
