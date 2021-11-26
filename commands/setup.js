const { SlashCommandBuilder } = require('@discordjs/builders');
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'school_discord_gamebot'
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Set up this bot for the server.'),
    async execute(interaction) {
        connection.query('SELECT `guild_id` AS `guildid` FROM `guilds` WHERE `guild_id` = ?', interaction.guild.id, function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                return interaction.reply({
                    content: `Guild is already set up: ${results[0].guildid}\nPlease see \`/help configuration\` for all configuration options.`,
                    ephemeral: true
                });
            }
            connection.query(`INSERT INTO guilds (guild_id, user_id) VALUES (${interaction.guild.id}, ${interaction.member.id})`, function (error, results, fields) {
                if (error) throw error;
                connection.query(`INSERT INTO settings (guild_id) VALUES (${interaction.guild.id})`, function (error, results, fields) {
                    if (error) throw error;
                    interaction.reply({
                        content: 'Guild set up successfully!',
                        ephemeral: true
                    }); 
                });
            });
        });
    }
}