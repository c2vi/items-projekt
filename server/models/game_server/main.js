const model_base_item = require("../base_item/main").model
const mongoose = require("mongoose")
const {NodeSSH} = require('node-ssh')
const ssh = new NodeSSH()
const wol = require('node-wol')
const discord_bot = require('./discord_bot')

require("dotenv").config()


schema = new mongoose.Schema({
    game: {type: mongoose.Schema.Types.ObjectID, ref: "computer_game"},
    ssh_credentials: {
	    host: String,
	    user: String,
	    private_key: String,
    },
    start_exec_dir: String,
    start_command: String,
    stop_command: String,
    check_idle: {
	    type: String,

    },
    update_command: String,
    check_update_command: String,
    backup_command: String,
    status: String,
    host_powerup_wol_mac: String,
    host_powerdown_command: String,


})

const model = model_base_item.discriminator("game_server", schema)

function handle_socket_event(){
	console.log("socket")
}

function init(){
	discord_bot(model)
}

module.exports = {model, handle_socket_event, init}



