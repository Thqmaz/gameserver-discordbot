const { MessageEmbed } = require('discord.js');
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
        .setName('history')
        .setDescription('Check someone\'s warning count')
        // User to warn
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to check :)")
                .setRequired(true)
        ),
    async execute(interaction) {
        const queriedUser = interaction.options.getUser('user')

        connection.query(`SELECT * FROM warnings WHERE guild_id=${interaction.guild.id} AND user_id=${queriedUser.id}`, function (error, results, fields) {
            if (error) throw error;
            results.forEach(element => {
                console.log(element.reason)
            })
            const historyEmbed = new MessageEmbed()
                .setColor("4734db")
                .setTitle(`Warnings`)
                .setTimestamp()
                .setDescription(`List of warnings for ${queriedUser}`)
            results.forEach(result => {
                historyEmbed.addField(`Warning #${result.id}`, `**Reason:** ${result.reason}\n**Date:** ${result.timestamp}`)
            })

            interaction.reply({
                embeds: [historyEmbed],
                ephemeral: true
            });
        })
    }
}