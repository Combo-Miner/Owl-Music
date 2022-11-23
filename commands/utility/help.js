    
const { Client, Message, MessageEmbed, MessageActionRow, MessageButton, CommandInteraction } = require("discord.js")
const Dispage = require("dispage")
const db = require("quick.db")
const config = require("../../config.json")

module.exports = {
    name: "help",
    description: "Permet d'afficher le menu de help",
    category: "info",
    emoji: "🕰️",

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async(client, message) => {

        let interaction = message
       let prefix = "/"
       let prefixcmd = (db.get(`prefix_${client.user.id}_${interaction.guild.id}`) == null ? config.prefix : db.get(`prefix_${client.user.id}_${interaction.guild.id}`) )
         let color =   db.get(`color_${message.guild.id}`)
        const antiraid = new MessageEmbed()
        .setTitle("AntiRaid")
        .setColor((db.get(`color_${message.guild.id}`) == null ? config.color : db.get(`color_${message.guild.id}`) ))
        .addFields({
        name : `\`${prefix}leave\``, value : "Permet de faire leave le bot de la voc"},
        {name : `\`${prefix}loop\``, value : "Boucle"},
        {name : `\`${prefix}lyrics\``, value : "Permet d'afficher les paroles de la musique actuelle"},
        {name : `\`${prefix}now-playing\``, value : "Montre la musique actuelle"},
        {name : `\`${prefix}pause\``, value : "Permet pause la musique actuelle"},
        {name : `\`${prefix}play\``, value : "Permet de jouer/ajouter une musique"},
        {name : `\`${prefix}playlist \``, value : "Gérer les playlist"},
        {name : `\`${prefix}queue \``, value : "Permet d'afficher la file d'attente"},
        {name : `\`${prefix}resume \``, value : "Permet de continuer la musique"},
        {name : `\`${prefix}skip\``, value : "Permet de passer a la musique suivante"},
        {name : `\`${prefix}stop\``, value : "Permet de arrêter la musique actuelle"},
        {name : `\`${prefix}volume\``, value : "Permet de régler le volume"})

        .setFooter(`Prefix : ${prefix}  •  ${client.user.username}`)
        const antiraid2 = new MessageEmbed()
        .setTitle("Owner")
        .setColor((db.get(`color_${message.guild.id}`) == null ? config.color : db.get(`color_${message.guild.id}`) ))
        .addFields(
        {name : `\`${prefixcmd}owner [clear/list/add/remove] <membre>\``, value : "Permet de setup les owners"},
        {name : `\`${prefixcmd}servers\``, value : "Affiche la liste des serveurs où se trouve le bot"},
        {name : `\`${prefixcmd}restart\``, value : "Permet de redémarer le bot"},
        {name : `\`${prefixcmd}set-name\``, value : "Permet de changer le nom du bot"},
        {name : `\`${prefixcmd}setavatar\``, value : "Permet de changer l'avatar du bot"},
        {name : `\`${prefixcmd}stream\``, value : "Permet de faire stream le bot"},
        {name : `\`${prefixcmd}watch\``, value : "Permet de faire watch le bot"},
        {name : `\`${prefixcmd}invite\``, value : "Permet de générer un lien d'invitation selon le serveur"},
         {name : `\`${prefixcmd}mybot\``, value : "Permet de voir le temps restant de son abonnement"},
        {name : `\`${prefixcmd}color <#hexcolor>\``, value : "Permet de changer la couleur des embeds"},)
        .setFooter(`Prefix : ${prefixcmd}  •  ${client.user.username}`)
        const embeds = [
            antiraid,antiraid2
        ]
        return new Dispage()
        .setEmbeds(embeds)
        .setMainStyle((db.get("helpstyle") == null ? "PRIMARY" : db.get('helpstyle')))
        .editButton("next", {label : (db.get("helpedit_right"))  === null ? "👉" : db.get('helpedit_right'),emoji : ""})
        .editButton("previous", { label : (db.get("helpedit_left"))  === null ? "👈" : db.get('helpedit_left'),emoji: ""})
        .removeButton("stop")
        .start(message)
       
    }
}
    
  
