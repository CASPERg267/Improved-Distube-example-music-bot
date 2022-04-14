const DisTube = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const filters = require("./")
const Discord = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const client = new Discord.Client({
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
    failIfNotExists: false,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
    ],
    presence: {
        activities: [{
          name: `${config.status.text}`.replace("{prefix}", config.prefix), 
          type: config.status.type, url: config.status.url
        }],
        status: config.status.presence,
    }
});

client.config = config;
let spotifyoptions = {
    parallel: true,
    emitEventsAfterFetching: true,
  }
  spotifyoptions.api = {
    clientId: config.spotify.clientID,
    clientSecret: config.spotify.clientSecret,
  }
client.distube = new DisTube(client, {
    emitNewSongOnly: false,
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    savePreviousSongs: true,
    emitAddSongWhenCreatingQueue: false,
    //emitAddListWhenCreatingQueue: false,
    searchSongs: 0,
    youtubeCookie: config.cookie, 
    nsfw: true, //Set it to false if u want to disable nsfw songs
    emptyCooldown: 25,
    ytdlOptions: {
      highWaterMark: 1024 * 1024 * 64,
      quality: "highestaudio",
      format: "audioonly",
      liveBuffer: 60000,
      dlChunkSize: 1024 * 1024 * 4,
    },
    youtubeDL: false,
    updateYouTubeDL: true,
    customFilters: filters,
    plugins: [
      new SpotifyPlugin(spotifyoptions),
      new SoundCloudPlugin(),
      new YtDlpPlugin()
    ]
  })
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.emotes = require("../assests/emojis.json");

["command", "events"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});


client.on("ready", () => {
    console.log(`${client.user.tag} is ready to play music.`)
    const server = client.voice.connections.size
    client.user.setActivity({ type: "PLAYING", name: `Music on ${server} servers` })
})

client.on("messageCreate", async message => {
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