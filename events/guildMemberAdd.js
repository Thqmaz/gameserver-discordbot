const Discord = require("discord.js");
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'school_discord_gamebot'
});

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        connection.query(`SELECT * FROM settings WHERE guild_id=${member.guild.id}`, function (error, results, fields) {
            // TODO: CHANNEL UIT DATABASE HALEN
            if (error) throw error;

            const newMemberEmbed = new Discord.MessageEmbed()
                .setColor("#d81e5b")
                .setTitle("New Member!")
                .setDescription(`${member.user} has joined the server! ${results[0].welcome_message}`)
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp();
            // str = BigInt(results[0].welcome_channel);
            // str = str.substring(0, str.length - 1);
            // console.log(str)
            member.guild.channels.cache.get("910138653219651594").send({
                embeds: [newMemberEmbed]
            });
        });
    }
}
// https://discord.gg/gU7mjR56