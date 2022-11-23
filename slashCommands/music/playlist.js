const { Client, MessageEmbed, CommandInteraction,Interaction } = require("discord.js")
const DB = require("../../models/playlist")

module.exports = {
    name: "playlist",
    description: "Créé,supprimé,ajoutés une playlist",
    category: "Music",
    options: [
        {
            name: "create",
            description: "crée un playlist",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "name",
                    description: "Nom(un seul mot)",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "privacy",
            description: "Changer la privacy du playlist",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "playlist-id",
                    description: "Donne l'id",
                    type: "STRING",
                    required: true,
                },
                {
                    name: "options",
                    description: "Selectionne la privacy",
                    type: "STRING",
                    required: true,
                    choices: [
                        {
                            name: "public",
                            value: "public"
                        },
                        {
                            name: "private",
                            value: "private"
                        }
                    ]
                }
            ]
        },
        {
            name: "add",
            description: "ajoute une nouvelle musique ",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "playlist-id",
                    description: "L'id de la playlist",
                    type: "STRING",
                    required: true
                },
                {
                    name: "song-name",
                    description: "le nom ou une URL de la musique",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "remove",
            description: "enlevé une musique de la playlist",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "playlist-id",
                    description: "L'id de la playlist",
                    type: "STRING",
                    required: true
                },
                {
                    name: "song-position",
                    description: "La position de la musique ou le nom",
                    type: "INTEGER",
                    required: true
                }
            ]
        },
        {
            name: "delete",
            description: "supprime la playlist",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "playlist-id",
                    description: "L'id ded la playlist",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "list",
            description: "Montre tous les playlist actif",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "options",
                    description: "Privé ou public ?",
                    type: "STRING",
                    required: true,
                    choices: [
                        {
                            name: "public",
                            value: "public"
                        },
                        {
                            name: "private",
                            value: "private"
                        }
                    ]
                }
            ]
        },
        {
            name: "info",
            description: "Montre de l'information",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "playlist-id",
                    description: "L'id du playlist",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "play",
            description: "Joue une playlist custom",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "playlist-id",
                    description: "L'id de la playlist",
                    type: "STRING",
                    required: true
                }
            ]
        },
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run : async  (client, interaction, args) => {
      

        const { options, guild, user, member, channel } = interaction

        switch (options.getSubcommand()) {

            case "create": {

                const name = options.getString("name").toLowerCase()

                let data = await DB.findOne({ User: user.id })

                if (!data) {

                    new DB({

                        Guild: guild.id,
                        User: user.id,
                        Name: name,
                        Privacy: true

                    }).save()

                } else {

                    if (data.Name.includes(name)) return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setColor("BLUE")
                                .setDescription(`‼ - Une playlist existe déjà avec ce nom **${name.toUpperCase()}** !`)
                        ],
                        ephemeral: true
                    })

                    new DB({

                        Guild: guild.id,
                        User: user.id,
                        Name: name,
                        Privacy: true

                    }).save()

                }

                interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setColor("BLUE")
                            .setDescription(`✅ -  Une nouvelle playlist nommée **${name.toUpperCase()}** à été crée par  ${user}`)
                    ]
                })

            }
                break;

            case "privacy": {

                const queueID = options.getString("playlist-id")
                const choice = options.getString("options")

                const queueInfo = await DB.findById(queueID).catch(() => {

                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setColor("BLUE")
                                .setDescription("‼ - Id du playlist invalide!")
                        ],
                        ephemeral: true
                    })

                })

                if (user.id !== queueInfo.User) return interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setColor("BLUE")
                            .setDescription("‼ - Tu ne peux pas changer la privacy d'un playlist qui ne t'appartient pas !")
                    ],
                    ephemeral: true
                })

                switch (choice) {

                    case "public": {

                        if (queueInfo.Privacy === false) return interaction.followUp({
                            embeds: [
                                new MessageEmbed()
                                    .setColor("BLUE")
                                    .setDescription("‼ - Le playlist est déjà `Public`!")
                            ],
                            ephemeral: true
                        })

                        queueInfo.Privacy = false
                        await queueInfo.save()

                        interaction.followUp({
                            embeds: [
                                new MessageEmbed()
                                    .setColor("BLUE")
                                    .setDescription("🔓 -Le playlist est mainteanant `Public`")
                            ]
                        })

                    }
                        break;

                    case "private": {

                        if (queueInfo.Privacy === true) return interaction.followUp({
                            embeds: [
                                new MessageEmbed()
                                    .setColor("BLUE")
                                    .setDescription("‼ - Le playlist est déjà `Private`!")
                            ],
                            ephemeral: true
                        })

                        queueInfo.Privacy = true
                        await queueInfo.save()

                        interaction.followUp({
                            embeds: [
                                new MessageEmbed()
                                    .setColor("BLUE")
                                    .setDescription("🔒 - Le playlist est mainteanant `Private`")
                            ]
                        })

                    }
                        break;

                }

            }
                break;

            case "list": {

                const choice = options.getString("options")

                switch (choice) {

                    case "public": {

                        const queueList = await DB.find({ Privacy: false })

                        if (!queueList?.length) return interaction.followUp({
                            embeds: [
                                new MessageEmbed()
                                    .setColor('BLUE')
                                    .setDescription(`‼️ - Aucune playlist public est active !`)
                            ],
                            ephemeral: true
                        })

                        let index = 1

                        const queueData = queueList.map((queue) => {

                            return [
                                `**${index++}. ${queue.Name.toUpperCase()}** - \`${queue._id}\``
                            ].join("\n")

                        }).join("\n")

                        interaction.followUp({
                            content : queueData,
                            embeds: [
                                new MessageEmbed()
                                    .setColor("BLUE")
                                    .setTitle("📰 Public Playlists")
                                    .setDescription(`${queueData}`)
                                    .setThumbnail(guild.iconURL({ dynamic: true }))
                                    .setTimestamp()
                            ]

                        })

                    }
                        break;

                    case "private": {

                        const queueList = await DB.find({ User: user.id, Privacy: true })

                        if (!queueList?.length) return interaction.followUp({
                            embeds: [
                                new MessageEmbed()
                                    .setColor('BLUE')
                                    .setDescription(`‼️ - Tu n'as aucune playlist private !`)
                            ],
                            ephemeral: true
                        })

                        let index = 1
                        const queueData = queueList.map((queue) => {

                            return [
                                `**${index++}. ${queue.Name.toUpperCase()}** - \`${queue._id}\``
                            ].join("\n")

                        }).join("\n")

                        interaction.followUp({
                            content: queueList.map((queue)=> {
                                return [
                                    `\`${queue._id}\``
                                ].join("\n")
                            }).join("\n"),
                            embeds: [
                                new MessageEmbed() 
                                    .setColor("BLUE")
                                    .setTitle("📰 Tes Playlists")
                                    .setDescription(`${queueData}`)
                                    .setThumbnail(guild.iconURL({ dynamic: true }))
                                    .setTimestamp()
                            ]
                        })

                    }
                        break;

                }

            }
                break;

            case "info": {

                const queueID = options.getString("playlist-id")

                const queueInfo = await DB.findById(queueID).catch(() => {

                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setColor("BLUE")
                                .setDescription("‼ - ID invalide!")
                        ],
                        ephemeral: true
                    })

                })

                const User = guild.members.cache.get(queueInfo.User)

                let privacy

                if (queueInfo.Privacy === true) {
                    privacy = "Private"
                } else {
                    privacy = "Public"
                }

                const rawFields = queueInfo.Songs.NAME

                let index = 1

                const fields = rawFields.map((f) => {

                    return `**${index++}.** ${f}`

                }).join("\n")

                interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setColor("BLUE")
                            .setTitle(`ℹ Playlist Information`)
                            .setDescription(
                                `**Nom:** ${queueInfo.Name.toUpperCase()}
                                **ID:** \`${queueID}\`
                                **Creator:** ${User}
                                **Privacy:** ${privacy}

                                **Songs:**
                                ${fields}`
                            )
                            .setThumbnail(guild.iconURL({ dynamic: true }))
                            .setTimestamp()
                    ]
                })

            }
                break;

            case "add": {

                const queueID = options.getString("playlist-id")
                const songs = options.getString("song-name")

                const queueInfo = await DB.findById(queueID).catch(() => {

                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setColor("BLUE")
                                .setDescription("‼ - Id invalide !")
                        ],
                        ephemeral: true
                    })

                })

                if (user.id !== queueInfo.User) return interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setColor("BLUE")
                            .setDescription("‼ - Tu ne peux pas ajoutés des musique à une playlist qui ne t'appartient pas !")
                    ],
                    ephemeral: true
                })
                const data = await client.distube.search(songs, { limit: 1 }).catch((err) => {
                    if (err) return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setColor("BLUE")
                                .setDescription(`‼️ - La musique est invalide !`)
                        ],
                        ephemeral: true
                    })

                })

                const URL = data[0].url
                const Name = data[0].name

                if (queueInfo.Songs.URL.includes(URL)) return interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setColor("BLUE")
                            .setDescription(`‼️ - La musique est déjà ajoutée !`)
                    ],
                    ephemeral: true
                })

                queueInfo.Songs.URL.push(URL)
                queueInfo.Songs.NAME.push(Name)
                await queueInfo.save()

                interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setColor("BLUE")
                            .setDescription(`✅ - J'ai add  [${Name}](${URL}) dans la playlist, utilise  \`/queue info\`  pour voir la playlist`)
                    ]
                })

            }
                break;

            case "remove": {

                const queueID = options.getString("playlist-id")
                const position = options.getInteger("song-position")

                const queueInfo = await DB.findById(queueID).catch(() => {

                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setColor("BLUE")
                                .setDescription("‼ - ID invalide !")
                        ],
                        ephemeral: true
                    })

                })

                if (user.id !== queueInfo.User) return interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setColor("BLUE")
                            .setDescription("‼ - Tu ne peux pas enlevé une musique à un playlist qui ne t'appartient pas !")
                    ],
                    ephemeral: true
                })

                const Name = queueInfo.Songs.NAME
                const Url = queueInfo.Songs.URL

                const filtered = parseInt(position - 1)

                if (filtered > Name.length) return interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setColor("BLUE")
                            .setDescription("‼ - Merci de mentionner une position valide, utilise  `/queue info` pour voir tout les positions !")
                    ],
                    ephemeral: true
                })

                const afName = Name.splice(filtered, 1)
                const afUrl = Url.splice(filtered, 1)

                const rmvName = afName.filter(x => !Name.includes(x))
                const rmvUrl = afUrl.filter(x => !Url.includes(x))

                await queueInfo.save()

                interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setColor("BLUE")
                            .setDescription(`✅ - J'ai enlevé  [${rmvName}](${rmvUrl}) de la Playlist`)
                    ]
                })

            }
                break;

            case "delete": {

                const queueID = options.getString("playlist-id")

                const queueInfo = await DB.findById(queueID).catch(() => {

                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setColor("BLUE")
                                .setDescription("‼ - Id invalide !")
                        ],
                        ephemeral: true
                    })

                })

                if (user.id !== queueInfo.User) return interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setColor("BLUE")
                            .setDescription("‼ - Tu ne peux pas supprimé une playlist qui ne t'appartient pas !")
                    ],
                    ephemeral: true
                })

                queueInfo.delete()

                interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setColor("BLUE")
                            .setDescription(`✅ - J'ai delete la playlist avec comme ID : \`${queueID}\``)
                    ]
                })

            }
                break;

            case "play": {


                const VoiceChannel = member.voice.channel

             //   await interaction.deferReply({ephemeral: true})

             
                if (!VoiceChannel) return interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setColor("BLUE")
                            .setDescription("‼ - Tu dois être connecté à un salon vocal !")
                    ]
                })

                if (guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId) return interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setColor("BLUE")
                            .setDescription(`‼ - La musique se joue déjà dans  ${guild.me.voice.channel}, tu dois être dans le même salon vocal !`)
                    ]
                })

                const queueID = options.getString("playlist-id")

                const queueInfo = await DB.findById(queueID).catch(() => {

                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setColor("BLUE")
                                .setDescription("‼ - Id invalide!")
                        ]
                    })

                })

                if (queueInfo.Privacy === true) {

                    const User = client.users.cache.get(queueInfo.User)

                    if (queueInfo.User !== user.id) return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setColor('BLUE')
                                .setDescription(`‼️ - Ceci est une playlist private par  ${User}!`)
                        ]
                    })

                    const songs = queueInfo.Songs.URL
                    const playlistName = queueInfo.Name.toUpperCase()

                    if (!songs?.length) return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setColor('BLUE')
                                .setDescription(`‼️ - Ajoute des musiques à la playlist \`/queue add\` !`)
                        ]
                    })

                    const playlist = await client.distube.createCustomPlaylist(songs, {
                        member: member,
                        properties: { name: `${playlistName}` },
                        parallel: true
                    })

                    client.distube.play(VoiceChannel, playlist, { textChannel: channel, member: member })

                    interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setColor("BLUE")
                                .setDescription(`✅ `)
                        ]
                    })

                } else {

                    const songs = queueInfo.Songs.URL
                    const playlistName = queueInfo.Name.toUpperCase()

                    if (!songs?.length) return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setColor('BLUE')
                                .setDescription(`‼️ - Ajoute des musiques à la playlist \`/queue add\` !`)
                        ]
                    })

                    const playlist = await client.distube.createCustomPlaylist(songs, {
                        member: member,
                        properties: { name: `${playlistName}` },
                        parallel: true
                    })

                    client.distube.play(VoiceChannel, playlist, { textChannel: channel, member: member })

                    interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setColor("BLUE")
                                .setDescription(`✅`)
                        ]
                    })

                }

            }
                break;

        }

    }
}