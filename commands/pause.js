const Discord = require(`discord.js`);

module.exports = {
    name: "pause",
    aliases: ["pause", "hold"],
    inVoiceChannel: true,
    run: async (client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Oops!`)
        .setDescription(`${client.emotes.error} | There is nothing in the queue right now!`)
        .setColor(`RED`)
        .setFooter(`Developed By CASPER AG#7384`))
        if (queue.pause) {
            client.distube.resume(message)
            return message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Done!`)
            .setDescription(`Resumed the song for you :) ,Enjoy`)
            .setColor(`GREEN`)
            .setFooter(`Developed By CASPER AG#7384`))
        }
        client.distube.pause(message)
        message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Done!`)
        .setDescription(`Paused the song for you :)`)
        .setColor(`GREEN`)
        .setFooter(`Developed By CASPER AG#7384`))
    }
}
