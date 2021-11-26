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
        .setName('warn')
        .setDescription('Warn someone :0')
        // User to warn
        .addUserOption((option) =>
            option
                .setName("warneduser")
                .setDescription("Warn a user, very bad")
                .setRequired(true)
        )
        // Reason for the warning
        .addStringOption((option) =>
            option
                .setName("warnreason")
                .setDescription("Yup, must be a reason for it!")
                .setRequired(true)
        ),
    async execute(interaction) {
        const warnedUser = interaction.options.getUser('warneduser')
        const warnReason = interaction.options.getString('warnreason')

        connection.query(`INSERT INTO warnings (guild_id, user_id, moderator_id, reason) VALUES (${interaction.guild.id}, ${warnedUser.id}, ${interaction.member.id}, '${warnReason}')`);

        connection.query(`SELECT * FROM settings WHERE guild_id=${interaction.guild.id}`, function (error, results, fields) {
            if (error) throw error;
            const warnEmbed = new MessageEmbed()
                .setColor("4734db")
                .setTitle(`Warning`)
                .setTimestamp()
                .setDescription(`**Warned user:** ${warnedUser} (${warnedUser.id})
                                 **Warned by:** ${interaction.member} (${interaction.member.id}`)
                .addField(`**Reason(s):**`, warnReason)

            interaction.reply({
                embeds: [warnEmbed],
                ephemeral: true
            });
        })
    }
}