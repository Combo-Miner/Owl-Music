const player = require("../client/player");

module.exports = {
    name: "now-playing",
    description: "montre des informations de la musique actuellement jouée",
    run: async (client, interaction) => {
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing)
            return interaction.followUp({
                content: "Aucune musique est actuellemnt jouée",
            });

        const progress = queue.createProgressBar();
        const perc = queue.getPlayerTimestamp();

        return interaction.followUp({
            embeds: [
                {
                    title: "En cours",
                    description: `🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`,
                    fields: [
                        {
                            name: "\u200b",
                            value: progress,
                        },
                    ],
                    color: '#ff000',
                    footer: {
                        text: `Mis en file d'attente par  ${queue.current.requestedBy.tag}`,
                    },
                },
            ],
        });
    },
};