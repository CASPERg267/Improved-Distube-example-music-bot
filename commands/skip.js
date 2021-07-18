const Discord = require(`discord.js`);

module.exports = {
    name: "skip",
    inVoiceChannel: true,
    run: async (client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Oops!`)
        .setDescription(`${client.emotes.error} | There is nothing in the queue right now!`)
        .setColor(`RED`)
        .setFooter(`Developed By CASPER AG#7384`))
        try {
            client.distube.skip(message)
            message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Done!`)
            .setDescription(`${client.emotes.success} | Skipped! Now playing:\n${queue.songs[0].name}`)
            .setColor(`GREEN`)
            .setFooter(`Developed By CASPER AG#7384`))
        } catch (e) {
            message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Oops, something went wrong`)
            .setDescription(`${client.emotes.error} | ${e}`)
            .setColor(`RED`)
            .setFooter(`Developed By CASPER AG#7384`))
        }
    }
}
