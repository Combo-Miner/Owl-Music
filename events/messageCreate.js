const client = require("../index");
const dbs = require('quick.db')
var config = require("../config.json");
const colors = require('colors');

client.on("messageCreate", async (message) => {
    if(message.channel.type == "DM") return;
 
   const prefixData = dbs.fetch(`prefix_${client.user.id}_${message.guild.id}`)
    let prefix = prefixData 
    if(!prefix) { 
        prefix = config.prefix 
    }
    if (
        message.author.bot ||
        !message.guild ||
        !message.content.toLowerCase().startsWith(prefix)
     
    )
        return;
      
                
                if (message.author.bot) return;
               

                if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == "REPLY") return;
            
                if (message.mentions.has(`${client.user.id}`) && !message.author.bot) {
                    message.channel.send(`Mon prefix sur ce serveur est ${prefix} `);
                }
            
            
                const [cmd, ...args] = message.content 
                    .slice(prefix.length)
                    .trim()
                    .split(/ +/g);
                const Discord = require('discord.js')
            
            
                const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()))
                if(!command) return;
                console.log(message.author.username.brightRed + ` à éxecuté la commande `.brightGreen + prefix + command.name.brightBlue +` dans `.brightGreen + message.guild.name.brightRed + ` (${message.guild.id}) ` )
            
            
                if (command) {  
                    //Permission d'utilisateur
                    if(!message.member.permissions.has(command.UserPerms  ||[])) return message.channel.send(`Vous devez dispoez de permission  \`${command.UserPerms || []}\` pour utilisé cette commande!`)
            
            // owner check
            if (command.ownerOnly == true) {
                let link =  dbs.get(`owners_${client.user.id}_${message.author.id}`)
             if(link == true) {
             } else return;
            }
                    //developpement command
                    if (command.OnlyDev === true) {
                       return  message.channel.send('Cette commande est actuellement en dev!')
                    }
                    if(command.ownerGuild === true) {
                        if (message.author.id !== message.guild.ownerId){ 
                            return message.channel.send("Seulement l'owner du serveur peut utilisé cette commande.")}
                    }
                    //Bot permission
                    if(!message.guild.me.permissions.has(command.BotPerms  ||[])) return message.channel.send(`J'ai besoin de \`${command.BotPerms || []}\`permissions`)
                await command.run(client, message, args, Discord);
            }
        
       })

