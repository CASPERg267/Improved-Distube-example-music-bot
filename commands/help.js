const Discord = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h", "cmd", "command"],
    run: async (client, message, args) => {
        const embed = new Discord.MessageEmbed()
            .setTitle("SHAZAM Commands")
            .setDescription(client.commands.map(cmd => `\`${cmd.name}\``).join(", "))
            .setTimestamp()
            .setColor(`GREEN`)
            .setFooter(`Developed By CASPER AG#7384`)
        message.channel.send(embed)
    }
}
