export function test(){
	console.log("hello from folder item")
}

export async function render(data){
	return `
	<div id="${data._id}">
	<p> id: ${data._id}</p>
	<p> type: ${data._typeid}</p>
	</div>
	`
}


	// ${data.items.map( (item) => {
	// 	return `<p>--------------------</p><h3>${item._typeid}</h3>`
	// })}	
