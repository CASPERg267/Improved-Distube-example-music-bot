const DisTube = require("distube");
const Discord = require("discord.js");
const client = new Discord.Client()
const fs = require("fs");
const config = require("./config.json");

client.config = require("./config.json")
client.distube = new DisTube(client, {
searchSongs: false,
emitNewSongOnly: false,
leaveOnFinish: false,
youtubeCookie : config.cookie,
highWaterMark: 1024 * 1024 * 64,
leaveOnEmpty: false,
leaveOnStop: false,
youtubeDL: true,
updateYouTubeDL: true,
customFilters: config.filters
})
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.emotes = config.emoji

fs.readdir("./commands/", (err, files) => {
    if (err) return console.log("Could not find any commands!")
    const jsFiles = files.filter(f => f.split(".").pop() === "js")
    if (jsFiles.length <= 0) return console.log("Could not find any commands!")
    jsFiles.forEach(file => {
        const cmd = require(`./commands/${file}`)
        console.log(`Loaded ${file}`)
        client.commands.set(cmd.name, cmd)
        if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
    })
})

client.on("ready", () => {
    console.log(`${client.user.tag} is ready to play music.`)
    const server = client.voice.connections.size
    client.user.setActivity({ type: "PLAYING", name: `Music on ${server} servers` })
})

client.on("message", async message => {
    const prefix = config.prefix
    if (!message.content.startsWith(prefix)) return
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
    if (!cmd) return
    if (cmd.inVoiceChannel && !message.member.voice.channel) return message.channel.send(new Discord.MessageEmbed()
    .setTitle(`You Forgot!!`)
    .setColor(`RED`)
    .setDescription(`${client.emotes.error} | You must be in a voice channel!`)
    .setFooter(`Developed By CASPER AG#7384`))
    try {
        cmd.run(client, message, args)
    } catch (e) {
        console.error(e)
        message.reply(new Discord.MessageEmbed()
        .setTitle(`Sorry something went wrong`)
        .setDescription(`Error: ${e}`)
        .setColor(`RED`)
        .setFooter(`Developed By CASPER AG#7384`))
    }
})

const status = queue => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``
client.distube
    .on("playSong", (message, queue, song) => message.channel.send(new Discord.MessageEmbed()
    .setTitle(`Now Playing ${client.emotes.play}.....`)
    .setDescription(`**SongName** : \`${song.name}\``)
    .addField(`Duration`, `\`${song.formattedDuration}\``)
    .addField(`Requested By`, `${song.user}`)
    .addField(`Status`, `${status(queue)}`)
    .setColor(`GREEN`)
    .setFooter(`Developed By CASPER AG#7384`)
    .setThumbnail(song.thumbnail)))
    .on("addSong", (message, queue, song) => message.channel.send(new Discord.MessageEmbed()
    .setTitle(`${client.emotes.success} | Added ${song.name}`)
    .setDescription(`Song Duration ${song.formattedDuration}\` to the queue by ${song.user}`)
    .setColor(`GREEN`)
    .setThumbnail(song.thumbnail)
    .setFooter(`Developed By CASPER AG#7384`)))
    .on("playList", (message, queue, playlist, song) => message.channel.send(new Discord.MessageEmbed()
    .setTitle(`Play \`${playlist.title}\``)
    .setDescription(`playlist (${playlist.total_items} songs)`)
    .addField(`Requested by:`, `${song.user}`)
    .addField(`Now Playing`, `(\`${song.name}\`)`)
    .addField(`Duration`, `${song.formattedDuration}`)
    .addField(`Status`, `${status(queue)}`)
    .setColor(`GREEN`)
    .setFooter(`Developed By CASPER AG#7384`)
    .setThumbnail(song.thumbnail)))
    .on("addList", (message, queue, playlist) => message.channel.send(new Discord.MessageEmbed()
    .setTitle(`${client.emotes.success} | Added \`${playlist.title}\``)
    .setDescription(`playlist (${playlist.total_items} songs) to queue\n`)
    .setColor(`GREEN`)
    .setFooter(`Developed By CASPER AG#7384`)
    .addField(`Status`, `${status(queue)}`)))
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
        let i = 0
        message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`)
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", message => message.channel.send(`${client.emotes.error} | Searching canceled`))
    .on("error", (message, err) => message.channel.send(`${client.emotes.error} | An error encountered: ${err}`))

    .on("noRelated", message => message.channel.send(new Discord.MessageEmbed()
    .setTitle(`Oops!`)
    .setDescription(`Can't find related video to play. i Stopped playing music try to play some music by typing **$p <songname or url>**`)
    .setColor(`GREEN`)
    .setFooter(`Developed By CASPER AG#7384`)))

    .on("finish", message => message.channel.send(new Discord.MessageEmbed()
    .setTitle(`No more music?`)
    .setDescription(`No more songs in queue`)
    .setColor(`GREEN`)
    .setFooter(`Developed By CASPER AG#7384`)))

    .on("empty", message => message.channel.send(new Discord.MessageEmbed()
    .setTitle(`No One cares!`)
    .setDescription(`Channel is empty. Leaving the channel`)
    .setColor(`GREEN`)
    .setFooter(`Developed By CASPER AG#7384`)));


client.login(process.env.token) // use a secret variable to store your token in repl, also works with glitch