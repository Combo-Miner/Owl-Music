const player = require("../client/player");

module.exports = {
    name: "queue",
    description: "afficher la file d'attente des chansons",
    run: async (client, interaction) => {
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing)
            return interaction.followUp({
                content: "Aucune chanson n'est en cours de lecture!",
            });

        const currentTrack = queue.current;
        const tracks = queue.tracks.slice(0, 10).map((m, i) => {
            return `${i + 1}. [**${m.title}**](${m.url}) - ${
                m.requestedBy.tag
            }`;
        });

        return interaction.followUp({
            embeds: [
                {
                    title: "File d'attente de chansons",
                    description: `${tracks.join("\n")}${
                        queue.tracks.length > tracks.length
                            ? `\n...${
                                  queue.tracks.length - tracks.length === 1
                                      ? `${
                                            queue.tracks.length - tracks.length
                                        } plus de piste`
                                      : `${
                                            queue.tracks.length - tracks.length
                                        } plus de pistes`
                              }`
                            : ""
                    }`,
                    color: "#ff0000",
                    fields: [
                        {
                            name: "Lecture en cours",
                            value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}`,
                        },
                    ],
                },
            ],
        });
    },
};