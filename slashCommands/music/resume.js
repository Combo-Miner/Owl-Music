const player = require("../client/player");

module.exports = {
    name: "resume",
    description: "resume la chanson",
    run: async (client, interaction) => {
        const queue = player.getQueue(interaction.guildId);

        queue.setPaused(false);

        return interaction.followUp({ content: "Reprise de la piste en cours !" });
    },
};