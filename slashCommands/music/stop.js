const player = require("../client/player");
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "stop",
    description: "arrête la musique actuelle",
    run: async (client, interaction, args) => {
        const queue = player.getQueue(interaction.guildId);

        await queue.stop();

        const stop = new MessageEmbed()
        .setTitle("__**Music Stop**__")
        .setColor("#ff0000")
        .setDescription("La musique actuelle à été arrêtée.")
        .setTimestamp()

        interaction.followUp({ embeds: [stop] });
    },
};