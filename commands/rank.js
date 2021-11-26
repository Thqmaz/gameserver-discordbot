const { Discord, MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'school_discord_gamebot'
});
const canvacord = require("canvacord");
const img = "https://cdn.discordapp.com/embed/avatars/0.png";
const userData = getDataSomehow();

function getDataSomehow() {
    let xp = 25,
        requiredXP = 300;

    return [xp, requiredXP];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Checks your rank.'),
    async execute(interaction) {
        // let avatar = img;
        // let image = await canvacord.Canvas.trigger(avatar);
        // let attachment = new MessageAttachment(image, "triggered.gif");
        // interaction.reply(attachment.name);
        // console.log(userData)

        const rank = new canvacord.Rank()
            .setAvatar(img)
            .setCurrentXP(userData[0])
            .setRequiredXP(userData[1])
            .setStatus("dnd")
            .setProgressBar("#FFFFFF", "COLOR")
            .setUsername("Snowflake")
            .setDiscriminator("0007");

        rank.build()
            .then(data => {
                const attachment = new MessageAttachment(data, "RankCard.png");
                console.log(attachment);
                interaction.reply(attachment);
            });
        // connection.query('SELECT `guild_id` AS `guildid` FROM `guilds` WHERE `guild_id` = ?', interaction.guild.id, function (error, results, fields) {

        // });
    }
}