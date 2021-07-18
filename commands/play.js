const Discord = require(`discord.js`);

module.exports = {
    name: "play",
    aliases: ["p"],
    inVoiceChannel: true,
    run: async (client, message, args) => {
        const string = args.join(" ")
        if (!string) return message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Oops!`)
        .setDescription(`${client.emotes.error} | Please enter a song url or query to play.`)
        .setColor(`RED`)
        .setFooter(`Developed By CASPER AG#7384`))
        try {
            client.distube.play(message, string)
        } catch (e) {
            message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Oops!, Something Went Wrong`)
            .setDescription(`${client.emotes.error} | Error: \`${e}\``)
            .setColor(`RED`)
            .setFooter(`Developed By CASPER AG#7384`))
        }
    }
}
