const { Message, MessageEmbed} = require("discord.js");
const db = require("quick.db")
module.exports = {
  name: "prefix",
  description: "*Permet de générer une invitation avec une ID*",
  category: "owner",
  emoji : "📨",
  ownerOnly: true,
  
  run: async(client, message, args) => { 

   let prefix = args[0]
   if(!prefix) return;

   db.set(`prefix_${client.user.id}_${message.guild.id}`,prefix)
   message.channel.send(`Mon prefix est maintenant : \`${args[0]}\` `)



  }
  }