const player = require("../client/player");

module.exports = {
    name: "volume",
    description: "modifier ou vérifier le volume de la chanson en cours",
    options: [
        {
            name: "percentage",
            description: "pourcentage pour changer le volume à",
            type: "INTEGER",
            required: false,
        },
    ],
    run: async (client, interaction) => {
        const volumePercentage = interaction.options.getInteger("percentage");
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing)
            return interaction.followUp({
                content: "Aucune musique n'est en cours de lecture !",
            });

        if (!volumePercentage)
            return interaction.followUp({
                content: `Le volume actuel est \`${queue.volume}%\``,
            });

        if (volumePercentage < 0 || volumePercentage > 100)
            return interaction.followUp({
                content: "Le volume doit être compris entre 1 et 100 !",
            });

        queue.setVolume(volumePercentage);

        return interaction.followUp({
            content: `Le volume a été réglé sur \`${volumePercentage}%\``,
        });
    },
};