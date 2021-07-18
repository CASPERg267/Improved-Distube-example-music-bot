const Discord = require(`discord.js`);

module.exports = {
    name: "repeat",
    aliases: ["loop", "rp"],
    inVoiceChannel: true,
    run: async (client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Oops!`)
        .setDescription(`${client.emotes.error} | There is nothing playing!`)
        .setColor(`RED`)
        .setFooter(`Developed By CASPER AG#7384`))
        let mode = null
        switch (args[0]) {
            case "off":
                mode = 0
                break
            case "song":
                mode = 1
                break
            case "queue":
                mode = 2
                break
        }
        mode = client.distube.setRepeatMode(message, mode)
        mode = mode ? mode === 2 ? "Repeat queue" : "Repeat song" : "Off"
        message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Done!`)
        .setDescription(`${client.emotes.repeat} | Set repeat mode to \`${mode}\``)
        .setColor(`GREEN`)
        .setFooter(`Developed By CASPER AG#7384`))
    }
}
