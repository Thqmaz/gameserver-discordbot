require("dotenv").config();
const fs = require("fs");
const mysql = require('mysql');
const { Client, Intents, Collection } = require("discord.js");

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'school_discord_gamebot'
});

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const commands = [];
client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, commands));
    } else {
        client.on(event.name, (...args) => event.execute(...args, commands));
    }
}

const express = require('express')
const app = express()

const PORT = process.env.PORT || 5000;

app.get('/api/settings/:guildId', (req, res) => {
    connection.query('SELECT * FROM `settings` WHERE `guild_id`=?', req.params.guildId, function (error, results, fields) {
        res.send(results)
    });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
client.login(process.env.TOKEN);



const DBD = require('discord-dashboard');
const DarkDashboard = require('dbd-dark-dashboard');

let currencyNames = {};

const Dashboard = new DBD.Dashboard({
    port: 80,
    client: {
        id: '910452440992714792',
        secret: 'Cl2BcCihl_lZkHDPv_O2uXZVv3RqzXo2'
    },
    acceptPrivacyPolicy: true,
    redirectUri: 'http://localhost/discord/callback',
    domain: 'http://localhost',
    bot: client,
    theme: DarkDashboard({
        information: {
            createdBy: "Thqmaz_",
            websiteTitle: "Meow's Dashboard",
            websiteName: "Meow's Dashboard",
            websiteUrl: "https:/www.imidnight.nl/",
            dashboardUrl: "http://localhost",
            supporteMail: "info@thomasgroenendijk.nl",
            supportServer: "https://discord.gg/yYq4UgRRzz",
            imageFavicon: "https://bingus.io/images/bingus-logo.png",
            iconURL: "https://bingus.io/images/bingus-logo.png",
            pagestylebg: "linear-gradient(to #2CA8FF, pink 0%, #155b8d 100%)",
            main_color: "#2CA8FF",
            sub_color: "#ebdbdb",
        },
        invite: {
            client_id: "910452440992714792",
            redirectUri: "http://localhost/close",
            permissions: "8",
        },
        index: {
            card: {
                title: `Meow's Dashboard`,
                image: "https://i.imgur.com/axnP93g.png",
                footer: "Footer",
            },
            information: {
                title: "Information",
                description: `Panel is working :)`,
                footer: "voet",
            },
            feeds: {
                title: "INFORMATIOONNN",
                description: `YUPYUPYUP TOTALLY SERIOUS TEXT YUPYUP`,
                footer: "voet",
            },
        },
        guilds: {
            cardTitle: "Guilds",
            cardDescription: "Here are all the guilds you currenly have permissions for:",
        },
        guildInfo: {
            cardTitle: "SERVER INFORMATION"
        },
        guildSettings: {
            cardTitle: "Guild Settings",
            cardDescription: "Here you can manage all the settings for your guild:",
        },
        commands: {
            categoryOne: {
                category: `Commands`,
                subTitle: `All helpful commands`,
                list:
                    [
                        {
                            commandName: "Help command",
                            commandUsage: "/help <arg>",
                            commandDescription: "Just a list of commands, like this one :)",
                            commandAlias: "none"
                        },
                        {
                            commandName: "Configure servername",
                            commandUsage: "/configure servername <String>",
                            commandDescription: "Sets the server name for the bot",
                            commandAlias: "none"
                        },
                        {
                            commandName: "Configure welcome channel",
                            commandUsage: "/configure welcomechannel <#123>",
                            commandDescription: "Configure the channel where the welcome messages will be sent in",
                            commandAlias: "none"
                        },
                        {
                            commandName: "Configure welcome message",
                            commandUsage: "/configure welcomemessage <String>",
                            commandDescription: "Welcome your new members with a personalized message :)",
                            commandAlias: "none"
                        },
                        {
                            commandName: "Rank",
                            commandUsage: "/rank [@member]",
                            commandDescription: "Check someone's rank",
                            commandAlias: "none"
                        },
                        {
                            commandName: "Leaderboard",
                            commandUsage: "/leaderboard",
                            commandDescription: "Yupyup, not working yet :P",
                            commandAlias: "none"
                        },
                    ],
            },
        },
    }),
    settings: [
        {
            categoryId: 'setup',
            categoryName: "Setup",
            categoryDescription: "Setup your bot with default settings!",
            categoryOptionsList: [
                {
                    // TODO: gotta fix the selected value to the currently selected :)
                    optionId: 'lang',
                    optionName: "Language",
                    optionDescription: "Change bot's language easily",
                    optionType: DBD.formTypes.select({ "Dutch": 'nl', "English": 'en' }),
                    getActualSet: async ({ guild }) => {
                        connection.query(`SELECT language FROM settings WHERE guild_id=${guild.id}`, function (error, results, fields) {
                            if (error) throw error;
                            console.log(results[0].language)
                            return results[0].language || null;
                        });
                    },
                    setNew: async ({ guild, newData }) => {
                        // console.log(`UPDATE settings SET language='${newData}' WHERE guild_id=${guild.id}`)
                        connection.query(`UPDATE settings SET language='${newData}' WHERE guild_id=${guild.id}`, function (error, results, fields) {
                            if (error) throw error;
                        });
                        return;
                    }
                },
                {
                    optionId: 'nickname',
                    optionName: "Nickname",
                    optionDescription: "Bot's nickname on the guild",
                    optionType: DBD.formTypes.input("Nickname", 1, 16, false, false),
                    getActualSet: async ({ guild }) => {
                        return client.guilds.cache.get(guild.id).members.cache.get(process.env.BOT_ID).nickname || false;
                    },
                    setNew: async ({ guild, newData }) => {
                        client.guilds.cache.get(guild.id).members.cache.get(process.env.BOT_ID).setNickname(newData)
                        return;
                    }
                },
            ]
        },
        {
            categoryId: 'configuration',
            categoryName: "Configuration",
            categoryDescription: "Configure it all to your needs :)",
            categoryOptionsList: [
                {
                    // TODO: gotta fix the selected value to the currently selected :)
                    optionId: 'welcomechannel',
                    optionName: "Welcome channel",
                    optionDescription: "Channel for welcome messages",
                    optionType: DBD.formTypes.channelsSelect(),
                    getActualSet: async ({ guild }) => {
                        connection.query(`SELECT welcome_channel FROM settings WHERE guild_id=${guild.id}`, function (error, results, fields) {
                            if (error) throw error;
                            return results[0].welcome_channel || null;
                        });
                    },
                    setNew: async ({ guild, newData }) => {
                        connection.query(`UPDATE settings SET welcome_channel=${newData} WHERE guild_id=${guild.id}`, function (error, results, fields) {
                            if (error) throw error;
                        });
                        return;
                    }
                },
                {
                    // TODO: gotta fix the selected value to the currently selected :)
                    optionId: 'welcomerole',
                    optionName: "Welcome role",
                    optionDescription: "Role that will be given when a new user joins the guild",
                    optionType: DBD.formTypes.rolesSelect(),
                    getActualSet: async ({ guild }) => {
                        connection.query(`SELECT welcome_role FROM settings WHERE guild_id=${guild.id}`, function (error, results, fields) {
                            if (error) throw error;
                            return results[0].welcome_role || null;
                        });
                    },
                    setNew: async ({ guild, newData }) => {
                        console.log(newData)
                        connection.query(`UPDATE settings SET welcome_role=${newData} WHERE guild_id=${guild.id}`, function (error, results, fields) {
                            if (error) throw error;
                        });
                        return;
                    }
                },
                {
                    // TODO: gotta fix the selected value to the currently selected :)
                    optionId: 'loggingenabled',
                    optionName: "Enable Logging",
                    optionDescription: "Should logging be enabled?",
                    optionType: DBD.formTypes.switch(false),
                    getActualSet: async ({ guild }) => {
                        connection.query(`SELECT logging_enabled FROM settings WHERE guild_id=${guild.id}`, function (error, results, fields) {
                            if (error) throw error;
                            return results[0].logging_enabled || null;
                        });
                    },
                    setNew: async ({ guild, newData }) => {
                        // console.log(newData)
                        connection.query(`UPDATE settings SET logging_enabled=${newData} WHERE guild_id=${guild.id}`, function (error, results, fields) {
                            if (error) throw error;
                        });
                        return;
                    }
                },
                {
                    // TODO: gotta fix the selected value to the currently selected :)
                    optionId: 'logchannel',
                    optionName: "Log Channel",
                    optionDescription: "Channel for the log messages (if enabled)",
                    optionType: DBD.formTypes.channelsSelect(),
                    getActualSet: async ({ guild }) => {
                        connection.query(`SELECT log_channel FROM settings WHERE guild_id=${guild.id}`, function (error, results, fields) {
                            if (error) throw error;
                            return results[0].log_channel || null;
                        });
                    },
                    setNew: async ({ guild, newData }) => {
                        connection.query(`UPDATE settings SET log_channel=${newData} WHERE guild_id=${guild.id}`, function (error, results, fields) {
                            if (error) throw error;
                        });
                        return;
                    }
                },
            ]
        },
    ]
});


Dashboard.init();


