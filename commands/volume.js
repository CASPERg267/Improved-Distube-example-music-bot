const Discord = require(`discord.js`);

module.exports = {
    name: "volume",
    aliases: ["v", "set", "set-volume"],
    inVoiceChannel: true,
    run: async (client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Oops!`)
        .setDescription(`${client.emotes.error} | There is nothing in the queue right now!`)
        .setColor(`RED`)
        .setFooter(`Developed By CASPER AG#7384`))
        const volume = parseInt(args[0])
        if (isNaN(volume)) return message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Oops!`)
        .setDescription(`${client.emotes.error} | Please enter a valid number!`)
        .setColor(`RED`)
        .setFooter(`Developed By CASPER AG#7384`))
        client.distube.setVolume(message, volume)
        message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Done!`)
        .setDescription(`${client.emotes.success} | Volume set to \`${volume}\``)
        .setColor(`GREEN`)
        .setFooter(`Developed By CASPER AG#7384`))
    }
}
