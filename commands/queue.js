const Discord = require(`discord.js`);

module.exports = {
    name: "queue",
    aliases: ["q"],
    run: async (client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Oops!`)
        .setDescription(`${client.emotes.error} | There is nothing playing!`)
        .setColor(`RED`)
        .setFooter(`Developed By CASPER AG#7384`))
        const q = queue.songs.map((song, i) => `${i === 0 ? "Playing:" : `${i}.`} ${song.name} - \`${song.formattedDuration}\``).join("\n")
        message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Done!`)
        .setDescription(`Here is your queue`)
        .addField(`${client.emotes.queue} | **Server Queue**\n`, ```${q}```)
        .setColor(`GREEN`)
        .setFooter(`Developed By CASPER AG#7384`))
    }
}
