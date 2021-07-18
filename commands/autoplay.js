const Discord = require(`discord.js`);

module.exports = {
  name: "autoplay",
  aliases: ["ap"],
  run: async (client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Oops!`)
        .setDescription(`${client.emotes.error} | There is nothing in the queue right now!`)
        .setColor(`RED`)
        .setFooter(`Developed By CASPER AG#7384`))
        let mode = distube.toggleAutoplay(message);
        message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Done!`)
        .setDescription("Set autoplay mode to `" + (mode ? "On" : "Off") + "`")
        .setColor(`GREEN`)
        .setFooter(`Developed By CASPER AG#7384`));
  }
}