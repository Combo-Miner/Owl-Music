const { QueryType } = require("discord-player");
const { MessageEmbed } = require("discord.js");
const player = require("../client/player");
const { MessageButton, MessageActionRow} = require("discord.js");

module.exports = {
    name: "play",
    description: "joue une musique",
    options: [
        {
            name: "songtitle",
            description: "titre de la zique",
            type: "STRING",
            required: true,
        },
    ],
    run: async (client, interaction,args) => {
        const query = interaction.options.get("songtitle").value;

        if (!interaction.member.voice.channel)
        return interaction.followUp({
            content: "Tu n'est pas dans un salon vocal ",
        });

            const searchResult = await player
            .search(query, {
                requestedBy: interaction.user,
                searchEngine: interaction.commandName === "soundcloud" ? QueryType.SOUNDCLOUD_SEARCH : QueryType.AUTO
            })
            .catch(() => {});
        if (!searchResult || !searchResult.tracks.length) return void interaction.followUp({ content: "Aucun résultat trouvé !" });

        const queue = await player.createQueue(interaction.guild, {
            metadata: interaction.channel,
        });

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            void player.deleteQueue(interaction.guildId);
            return void interaction.followUp({ content: "Je n'ai pas pu rejoindre votre salon vocal !" });
        }
        
        const track = await player.search(query, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);
        if (!track) return await interaction.followUp({ content: `❌ | Piste **${query}** introuvable!` });
        
        const playing = new MessageEmbed()
        .setTitle(track.title)
        .setDescription(`Son créé par  **${track.author}**, **${track.duration}**`) 
        .setFooter(`Demandé par ${track.requestedBy.username}`)
        .setThumbnail(track.thumbnail)
        .setURL(track.url)
        .setColor("#FF0000")
        .setTimestamp();

        const skip = new MessageActionRow().addComponents([
         
            new MessageButton()
            .setCustomId("Pause")
            .setLabel("⏸️")
            .setStyle("PRIMARY"),
            new MessageButton()
            .setCustomId("Stop")
            .setLabel("⏹️")
            .setStyle("DANGER"),
            new MessageButton()
            .setCustomId("Skip")
            .setLabel("⏭️")
            .setStyle("SUCCESS"),
            new MessageButton()
            .setCustomId("Lyrics")
            .setLabel("👩‍🎤")
            .setStyle("PRIMARY"),
            new MessageButton()
            .setCustomId("Queu")
            .setLabel("🎶")
            .setStyle("SUCCESS")
        ])
        const skip2 = new MessageActionRow().addComponents([
            new MessageButton()
            .setCustomId("Resume")
            .setLabel("▶️")
            .setStyle("SUCCESS"),
            new MessageButton()
            .setCustomId("Loop")
            .setLabel("🔁")
            .setStyle("PRIMARY"),
            new MessageButton()
            .setCustomId("VolumeUp")
            .setLabel("⏫")
            .setStyle("SUCCESS"),
            new MessageButton()
            .setCustomId("VolumeDown")
            .setLabel("⏬")
            .setStyle("PRIMARY"),
            new MessageButton()
            .setCustomId("Volume")
            .setLabel("🔊")
            .setStyle("SUCCESS")
            
           
            
        ])


        await interaction.followUp({ embeds: [playing], components : [skip,skip2]});

        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        if (!queue.playing) await queue.play();
        let filter = i=> i.user.id == interaction.user.id
        const coll = interaction.channel.createMessageComponentCollector({componentType : "BUTTON",filter : filter })
        coll.on("collect",async i =>{
            if(i.isButton()) {
                if(i.user.id !== interaction.user.id) return i.reply({ephemeral : true,content : "Vous n'êtes pas autorisé a utilisé ces bouttons"})
 
                if(i.customId == "Stop") {
                    if (!i.member.voice.channel)
                    return i.followUp({
                        content: "Tu n'est pas dans un salon vocal ",
                    });
                    if(!i.guild.me.voice.channel) return i.reply("Je ne suis pas dans un salon vocal ");
                    await i.deferReply({ ephemeral: true});
                    const queue = player.getQueue(i.guildId);
                  
                    if(!queue) return i.followUp("Aucune musique n'est jouée actuellement")
            
                     queue.destroy()
            
                    const stop = new MessageEmbed()
                    .setTitle("__**Music Stop**__")
                    .setColor("#ff0000")
                    .setDescription("La musique actuelle à été arrêtée.")
                    .setTimestamp()
            
                    i.followUp({embeds : [stop]})
            
            
                } else if (i.customId == "Pause") {
                    if (!i.member.voice.channel)
                    return i.followUp({
                        content: "Tu n'est pas dans un salon vocal ",
                    });
                    if(!i.guild.me.voice.channel) return i.reply("Je ne suis pas dans un salon vocal ");
                    await i.deferReply({ ephemeral: true});
                    const queue = player.getQueue(i.guildId);
                    const skip = new MessageEmbed()
                    .setTitle("__**Music Pause**__")
                    .setColor("#ff0000")
                    .setDescription("La piste vient d'être mise en pause ")
                    .setTimestamp()
            
                    const noskip = new MessageEmbed()
                    .setTitle("__**Music Pause**__")
                    .setColor("#ff0000")
                    .setDescription("La piste vient d'être rétablie ")
                    .setTimestamp()
             
                        queue.setPaused(true)
                        i.followUp({embeds: [skip]})
                    
                  
                   
                } else if (i.customId === "Skip") {
                    await i.deferReply({ ephemeral: true});
                    if (!i.member.voice.channel)
                    return i.followUp({
                        content: "Tu n'est pas dans un salon vocal ",
                    });
            
                    if(!i.guild.me.voice.channel) return i.reply("Je ne suis pas dans un salon vocal ");
                    const skip = new MessageEmbed()
                    .setTitle("__**Music Suivante**__")
                    .setColor("#ff0000")
                    .setDescription("En cours de lecture de la musqiue suivante ")
                    .setTimestamp()
                    const queue = player.getQueue(i.guildId);
                    if (!queue?.playing)
                        return i.followUp({
                            content: "Aucune musique n'est en cours de lecture",
                        });
            
                    queue.skip();
                    i.followUp({embeds : [skip]})
            
                } else if (i.customId == "Lyrics") {
                    await i.deferReply({ ephemeral: true});
            const axios = require("axios");
            const sendLyrics = (songTitle) => {
                return createResponse(songTitle)
                    .then((res) => {
                        console.log({ res });
                        i.followUp(res);
                    })
                    .catch((err) => console.log({ err }));
            };
            const getLyrics = (title) =>
                new Promise(async (ful, rej) => {
                    const url = new URL("https://some-random-api.ml/lyrics");
                    url.searchParams.append("title", title);
            
                    try {
                        const { data } = await axios.get(url.href);
                        ful(data);
                    } catch (error) {
                        rej(error);
                    }
                });
            
            const substring = (length, value) => {
                const replaced = value.replace(/\n/g, "--");
                const regex = `.{1,${length}}`;
                const lines = replaced
                    .match(new RegExp(regex, "g"))
                    .map((line) => line.replace(/--/g, "\n"));
            
                return lines;
            };
            
            const createResponse = async (title) => {
                try {
                    const data = await getLyrics(title);
            
                    const embeds = substring(4096, data.lyrics).map((value, index) => {
                        const isFirst = index === 0;
            
                        return new MessageEmbed({
                            title: isFirst ? `${data.title} - ${data.author}` : null,
                            thumbnail: isFirst ? { url: data.thumbnail.genius } : null,
                            description: value
                        });
                    });
            
                    return { embeds };
                } catch (error) {
                    return "Je n'ai pas pu trouvé cette musique :(";
                }
            };
            
            const queue = player.getQueue(i.guildId);
            if (!queue?.playing)
                return i.followUp({
                    content: "Aucune musique n'est actuellement jouée"
                });
            
            return sendLyrics(queue.current.title);
            
            
                } else if (i.customId == "Queu") {
                    await i.deferReply({ephemeral : true})
                    const queue = player.getQueue(i.guildId);
                    if (!queue?.playing)
                        return i.followUp({
                            content: "Aucune piste en cours de lecture!",
                        });
            
                    const currentTrack = queue.current;
                    const tracks = queue.tracks.slice(0, 10).map((m, i) => {
                        return `${i + 1}. [**${m.title}**](${m.url}) - ${
                            m.requestedBy.tag
                        }`;
                    });
            
                    return i.followUp({
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
                }else if (i.customId == "Loop") {
                   await i.deferReply({ephemeral : true})
                    const queue = player.getQueue(i.guildId);
                    if(!queue || !queue.playing) return void i.followUp({ content: "❌ | Aucune musique n'est jouée!" });
                    const loopMode = QueueRepeatMode.AUTOPLAY
                    const success = queue.setRepeatMode(loopMode);
                    const mode = loopMode === QueueRepeatMode.TRACK ? "🔂" : loopMode === QueueRepeatMode.QUEUE ? "🔁" : "▶";
                    return void i.followUp({ content: success ? `${mode} | Mode boucle mis à jour!` : "❌ | Impossible de mettre à jour le mode boucle!" });
                } else if (i.customId == "Resume") {
                    await i.deferReply({ephemeral : true})
                    const queue = player.getQueue(i.guildId);
            
                    queue.setPaused(false);
                    const noskip = new MessageEmbed()
                    .setTitle("__**Music Pause**__")
                    .setColor("#ff0000")
                    .setDescription("La piste vient d'être rétablie ")
                    .setTimestamp()
                    return i.followUp({embeds : [noskip]});
                } else if (i.customId == "VolumeUp") {
                    await i.deferReply({ephemeral : true})
                    const queue = player.getQueue(i.guildId);
                    if (!queue?.playing)
                        return i.followUp({
                            content: "Aucune musique n'est en cours de lecture !",
                        });
                     
                         const volume =  queue.volume
                         if(volume == 100) return i.followUp({ content : `Le volume est déjà au maximum \`(100%)\``})
            
                    queue.setVolume(volume + 10);
                    i.followUp(`Le volume a été réglé sur ${volume}%`)
                } else if (i.customId == "VolumeDown") {
                    await i.deferReply({ephemeral: true})
                    const queue = player.getQueue(i.guildId);
                    if (!queue?.playing)
                        return i.followUp({
                            content: "Aucune musique n'est en cours de lecture !",
                        });
                         
                         const volume =  queue.volume
                         if(volume <=0 ) return i.followUp({ content : `Le volume est déjà au minimum \`(0%)\``})
                       let after =   queue.setVolume(volume -10);
                    i.followUp(`Le volume a été réglé sur ${volume - 10}%`)
                    
                    
                } else if (i.customId == "Volume") {
                       await i.deferReply({ephemeral: true})
                       const queue = player.getQueue(i.guildId);
                       if (!queue?.playing)
                           return i.followUp({
                               content: "Aucune musique n'est en cours de lecture !",
                           });
                    
                     i.followUp(`Le volume actuelle est sur ${queue.volume}%`)
            
                }
              }
        })
        
    

        
    },
};