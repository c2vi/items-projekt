
const items = {
	base_item: require('./models/base_item/main'),
	plain_text: require('./models/plain_text/main'),
	number_int: require('./models/number_int/main'),
	folder: require('./models/folder_item/main'),
	list_of_text: require('./models/list_of_text/main'),
	simple_counter: require('./models/simple_counter/main'),
	game_server: require('./models/game_server/main'),
	computer_game: require('./models/computer_game/main'),
	moodle_test: require('./models/moodle/main'),
	moodle_site: require('./models/moodle/site'),
	moodle_course: require('./models/moodle/course'),
	icon_item: require('./models/icon_item/main'),

}

Object.keys(items).map( (key) => {
	if (items[key].init) {
		items[key].init()
	}
})

module.exports = items