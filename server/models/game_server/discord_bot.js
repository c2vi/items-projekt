const mongoose = require("mongoose")
const {NodeSSH} = require('node-ssh')
const ssh = new NodeSSH()
const wol = require('node-wol')
const { Rcon } = require('rcon-client')

module.exports = function discord_bot(model){

	//##Functions for Discord-Bot-------------------------------

	function sleep(ms) {
	return new Promise((resolve) => {
	setTimeout(resolve, ms);
	});
	}

	async function exec_ssh_command(command, game_server) {

		await ssh.connect({
			host: game_server.ssh_credentials.host,
			username: game_server.ssh_credentials.user,
			privateKey: game_server.ssh_credentials.private_key,
		})

		const result = await ssh.execCommand(command, {cwd: typeof game_server.start_exec_dir == "undefined" || typeof game_server.start_exec_dir == "null" ? "." : game_server.start_exec_dir})
		return result.stdout
	}

	async function exec_rcon_command(command, game_server){

		const rcon = new Rcon({
			host: game_server.ssh_credentials.host,
			port: game_server.rcon_port,
			password: game_server.rcon_pwd,
		})
		await rcon.connect()
	
		const response = await rcon.send(command)
		rcon.end()
		return response
	}

	async function power_up_host(game_server) {
		wol.wake(game_server.host_powerup_wol_mac, {address: game_server.host_powerup_wol_ip}, () => {console.log("wol packet sent")})
		
	}

	async function update_status(game_server){
		await model.updateOne( {_id: game_server._id}, { $set: {status: game_server.status}}).exec()
	}

	async function check_for_other_running_servers(game_server){
		const game_servers = await model.find({_typeid: "game_server"})
		const running_servers = game_servers
		.filter( server => server.status != "offline" && server._name != game_server._name)
		return running_servers
	}



	//##Discord-Bot-------------------------------

	const Discord = require('discord.js')
	const client = new Discord.Client({
	intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_PRESENCES"],
	})

	client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}`)
	})
	client.login(process.env.DISCORD_TOKEN)

	client.on("message", async (message) => {
		const splitMessage = message.content.split(" ")

		if ( splitMessage[0] === "!gs") {

			//other commands
			if (splitMessage[1] === "test"){
				message.reply("The bot SEEMS to be working")
				return
			}

			if (splitMessage[1] === "list"){
				const game_servers = await model.find({ _typeid: "game_server" }).exec()
				const names = game_servers.map(game_server => game_server._name + "     " + game_server.status)
				

				message.reply("List of all servers:\n - " + names.join("\n - "))
				return
			}

			const game_server = await model.findOne({ _name: splitMessage[1]}).exec()

			if (!game_server){
				message.reply("Server/Command: **" + splitMessage[1] + "** not found!!")
				return
			}

			if (!splitMessage[2]){
				message.reply("No command provided for **" + splitMessage[1] + "**")
				return
			}
			
			let command = ""
			switch(splitMessage[2]){
				case "rcon":
						if (!splitMessage[3]){break}
						if (game_server.allowed_rcon_commands.includes(splitMessage[3])){
							const rcon_command = splitMessage.slice(3, splitMessage.length).join(" ")
							console.log("rcon: " + rcon_command)

							const response = await exec_rcon_command(rcon_command, game_server)

							message.reply("**Response: \n**" + response)

						} else {
							message.reply("This rcon command does not exist, or is not allowed.")
						}

					break
				case "start":
					try{
						message.reply("starting...")
						const result = await exec_ssh_command(game_server.start_command, game_server)
						message.reply("Host already up. Starting server.")
						game_server.status = "started"
						await update_status(game_server)
						
					} catch {
						message.reply("Starting host first.")
						await power_up_host(game_server)
						await sleep(80000)
						message.reply("Host is up. Starting Server now. Ark takes about 4 min to start. **Please don't stop in that time!!**")
						const result = await exec_ssh_command(game_server.start_command, game_server)
						game_server.status = "started"
						await update_status(game_server)
					}
					break
				case "stop":
					
					message.reply("stopping...")
					const running_servers = await check_for_other_running_servers(game_server)
					if (!running_servers.length){

						if (game_server.stop_method == "ssh"){
							await exec_ssh_command(game_server.stop_command, game_server)
						} else if (game_server.stop_method == "rcon"){
							await exec_rcon_command(game_server.stop_command, game_server)
							await sleep(30000)
						}

						message.reply("Server stopped. Now shuting down host")
						await exec_ssh_command(game_server.host_powerdown_command, game_server)
						game_server.status = "offline"
						await update_status(game_server)

					} else {
						message.reply("stopping...")

						if (game_server.stop_method == "ssh"){
							await exec_ssh_command(game_server.stop_command, game_server)
						} else if (game_server.stop_method == "rcon"){
							await exec_rcon_command(game_server.stop_command, game_server)
							await sleep(30000)
						}

						message.reply("Server stopped, but **Not shuting down host**, because other servers are running.\n" + result.stdout)
						game_server.status = "offline"
						await update_status(game_server)
						return
					}
					break
				case "update":
					message.reply("updating...")
					await exec_ssh_command(game_server.update_command, game_server)
					message.reply("Update done!")
					break
				case "backup":
					message.reply("creating backup...")
					await exec_ssh_command(game_server.backup_command, game_server)
					message.reply("Backup done!")
					break
				case "backup-shutdown":
					message.reply("creating backup and then shuting down...")
					await exec_ssh_command(game_server.stop_command, game_server)
					message.reply("Server stopped. Now starting backup...")
					await exec_ssh_command(game_server.backup_command, game_server)
					message.reply("Backup done! Now shutting down host...")
					await exec_ssh_command(game_server.host_powerdown_command, game_server)
					break
				default:
					message.reply("Command not available for " + game_server._name)
					return
					break

			}

		}

	})
}
