const player = require("../client/player");

module.exports = {
    name: "pause",
    description: "met en pause la musique jouée",
    run: async (client, interaction) => {
        const queue = player.getQueue(interaction.guildId);

        queue.setPaused(true);

        return interaction.followUp({ content: "la piste en cours et en pause!" });
    },
};