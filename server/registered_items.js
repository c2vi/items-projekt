
const items = {
	base_item: require('./models/base_item/main'),
	plain_text: require('./models/plain_text/main'),
	number_int: require('./models/number_int/main'),
	folder: require('./models/folder/main'),
	list_of_text: require('./models/list_of_text/main'),
	simple_counter: require('./models/simple_counter/main'),
	game_server: require('./models/game_server/main'),
	computer_game: require('./models/computer_game/main')

}

Object.keys(items).map( (key) => {
	if (items[key].init) {
		items[key].init()
	}
})

module.exports = items