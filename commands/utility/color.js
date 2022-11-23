const {Client,Message} = require('discord.js')
const db = require('quick.db')


module.exports = {
    name: 'theme',
    aliases: ["color"],
    ownerOnly : true,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[0]} args 
     */
    run: async (client, message, args) => {
            if (!args[0]) return
            if (args[1]) return
            if(!args[0].startsWith("#")) return
                db.set(`color_${message.guild.id}`, args[0])
                message.channel.send(`J'ai set : \`${args[0]}\` pour ma couleur d'embed`)
            
        


    }
}