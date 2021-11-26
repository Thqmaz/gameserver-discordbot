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
        .setName('configure')
        .setDescription('Yup, setup!')
        // Guild name
        .addSubcommand(subcommand =>
            subcommand
                .setName('displayname')
                .setDescription('Sets the display name for this guild.')
                .addStringOption((option) =>
                    option
                        .setName("displayname")
                        .setDescription("Guild name that will be in messages (to make it more personal <3).")
                        .setRequired(true)
                ))
        // Welcome role
        .addSubcommand(subcommand =>
            subcommand
                .setName('welcomerole')
                .setDescription('Sets the welcome role for this guild.')
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("Role that will be given to new members.")
                        .setRequired(true)
                ))
        // Welcome channel
        .addSubcommand(subcommand =>
            subcommand
                .setName('welcomechannel')
                .setDescription('Sets the welcome channel for this guild.')
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("Channel for welcome messages.")
                        .setRequired(true)
                )),
    async execute(interaction) {
        connection.query('SELECT `guild_id` AS `guildid` FROM `settings` WHERE `guild_id` = ?', interaction.guild.id, function (error, results, fields) {
            if (error) throw error;
            if (!results.length > 0) {
                return interaction.reply({
                    content: `Guild is not set up. Please use \`/setup\` to continue.`,
                    ephemeral: true
                });
            }
            if (interaction.options.getSubcommand() === 'displayname') {
                connection.query(`UPDATE settings SET display_name='${interaction.options.getString('displayname')}' WHERE guild_id=${interaction.guild.id}`, function (error, results, fields) {
                    if (error) throw error;
                    interaction.reply({
                        content: `Display name updated to \`${interaction.options.getString('displayname')}\`!`,
                        ephemeral: true
                    });
                });
            }
            if (interaction.options.getSubcommand() === 'welcomerole') {
                connection.query(`UPDATE settings SET welcome_role=${interaction.options.getRole('role').id} WHERE guild_id=${interaction.guild.id}`, function (error, results, fields) {
                    if (error) throw error;
                    interaction.reply({
                        content: `Welcome role updated to \`${interaction.options.getRole('role')}\`!`,
                        ephemeral: true
                    });
                });
            }
            if (interaction.options.getSubcommand() === 'welcomechannel') {
                connection.query(`UPDATE settings SET welcome_channel=${interaction.options.getChannel('channel').id} WHERE guild_id=${interaction.guild.id}`, function (error, results, fields) {
                    if (error) throw error;
                    interaction.reply({
                        content: `Welcome role updated to \`${interaction.options.getChannel('channel')}\`!`,
                        ephemeral: true
                    });
                });
            }
        });
    }
}