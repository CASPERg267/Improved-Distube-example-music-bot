const { readdirSync } = require("fs");
  const ascii = require("ascii-table");
  let table = new ascii("Commands");
  table.setHeading("Command Name", "Load Status");
  module.exports = (client) => {
    try {
      readdirSync("./commands/").forEach((dir) => {
        const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
        for (let file of commands) {
          let pull = require(`../commands/${dir}/${file}`);
          if (pull.name) {
            client.commands.set(pull.name, pull);
            table.addRow(file, "Ready");
          } else {
            table.addRow(file, `error-> Something went wrong when loading this command`);
            continue;
          }
          if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
        }
      });
      console.log(table.toString().green);
    } catch (e) {
      console.log(e.stack)
    }
  };