const player = require("../client/player");
const { QueueRepeatMode } = require("discord-player");
const { Client, CommandInteraction } = require('discord.js')

module.exports = {
    name: "loop",
    description: "Définir le mode boucle",
    options: [
        {
            name: "mode",
            type: "INTEGER",
            description: "Type de boucle",
            required: true,
            choices: [
                {
                    name: "Off",
                    value: QueueRepeatMode.OFF
                },
                {
                    name: "Track",
                    value: QueueRepeatMode.TRACK
                },
                {
                    name: "Queue",
                    value: QueueRepeatMode.QUEUE
                },
                {
                    name: "Autoplay",
                    value: QueueRepeatMode.AUTOPLAY
                }
            ]
        }
    ],
    /** 
    * @param {Client} client 
    * @param {CommandInteraction} interaction 
    * @param {String[]} args 
    */
   run: async (client, interaction, args) => {
       const queue = player.getQueue(interaction.guildId);
       if(!queue || !queue.playing) return void interaction.followUp({ content: "❌ | Aucune musique n'est jouée!" });
       const loopMode = QueueRepeatMode.AUTOPLAY
       const success = queue.setRepeatMode(loopMode);
       const mode = loopMode === QueueRepeatMode.TRACK ? "🔂" : loopMode === QueueRepeatMode.QUEUE ? "🔁" : "▶";
       return void interaction.followUp({ content: success ? `${mode} | Mode boucle mis à jour!` : "❌ | Impossible de mettre à jour le mode boucle!" });
    }
}