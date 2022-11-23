const player = require("../client/player");

module.exports = {
    name: "skip",
    description: "skip la chanson en cours"    ,
    run: async (client, interaction, args) => {
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing)
            return interaction.followUp({
                content: "Aucune musique n'est en cours de lecture",
            });

        await queue.skip();

        interaction.followUp({ content: "Skipp la piste en cours !" });
    },
};