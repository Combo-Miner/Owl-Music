
const player = require("../client/player");
const discord = require('discord.js');
const { joinVoiceChannel } = require("@discordjs/voice");
const { getVoiceConnection} = require("mongoose");

module.exports = {
    name: "leave",
    description: "leave le bot de la voc", 

    run: async (client, interaction) => {
        if(!interaction.guild.members.cache.get(client.user.id).voice.channel) return interaction.followUp("Je ne suis pas dans un salon vocal ");
        await interaction.guild.members.cache.get(client.user.id).voice.disconnect()
        interaction.followUp("J'ai leave mon vocal")
        


}
}