
const API_URL = "api"


const fetch_item = async (id) => {
	const res = await fetch(API_URL + "/" + id)
	const data = await res.json()
	return data
};

function navigateTo(path){
    history.pushState(null, null, path);
    main();
}

function update_item(){

}

//for passing params down to item_renderers
const site = {
	nav_to: navigateTo,
	test: function test(e){console.log("testfunc"+e)},
	update_item: update_item,
}

async function main() {
	console.log("main called")

	// check what route we are on
	let id = location.pathname.slice(1)
	if ( id === "" ) { id = "main"}


	//fetch the correct item
	const item = await fetch_item(id)


	//get the correct render object
	const item_render = await import(`/static/items/${item._typeid}/index.js`)

	const render = { simple_type : "pc_full"}


	//render the item
	const item_frame = document.getElementById("item-frame")
	item_frame.innerHTML=""
	const element_tag = item._typeid.split("_").join("-")
	const item_element = document.createElement(element_tag);
	// const test = Object.values(item_render_class)[0]
	// const item_element = new test()
	item_element.item = item
	item_element.site = site
	item_element.render = render
	console.log(item)
	item_frame.appendChild(item_element)

	//update url
	history.replaceState(null, null, item._name ? item._name : item._id);



}


window.addEventListener("popstate", e => {
	main();
})

document.addEventListener("DOMContentLoaded", () => {

	//socketio stuff for now
	const socket = io.connect("/")

	document.body.addEventListener("click", e => {
		if (e.target.matches("[no-reload]")) {
			e.preventDefault();
			navigateTo(e.target.href);
		}
	});

	main()
});



//##########################################


// const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

// const getParams = match => {
//     const values = match.result.slice(1);
//     const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

//     return Object.fromEntries(keys.map((key, i) => {
//         return [key, values[i]];
//     }));
// };


// const router = async () => {
//     const routes = [
//         { path: "/", view: Dashboard },
//         { path: "/posts", view: Posts },
//         { path: "/posts/:id", view: PostView },
//         { path: "/settings", view: Settings }
//     ];

//     // Test each route for potential match
//     const potentialMatches = routes.map(route => {
//         return {
//             route: route,
//             result: location.pathname.match(pathToRegex(route.path))
//         };
//     });

//     let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

//     if (!match) {
//         match = {
//             route: routes[0],
//             result: [location.pathname]
//         };
//     }

//     const view = new match.route.view(getParams(match));

//     document.querySelector("#app").innerHTML = await view.getHtml();
// };

// window.addEventListener("popstate", router);
