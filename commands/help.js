const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Client, Intents } = require('discord.js');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('I\m here to help! *BEEP BEEP*')
        .addSubcommand(subcommand =>
            subcommand
                .setName('all')
                .setDescription('Shows all commands!'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('configuration')
                .setDescription('Shows all configuration commands!')),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'all') {
            const embed = new MessageEmbed()
                .setTitle('Help Menu')
                .setTimestamp()
                .addFields(
                    {
                        name: 'Commands', value: '**/help all** - Shows all commands\n' +
                            '**/help configuration** - Configuration commands\n' +
                            '**/help moderation** - Moderation commands'
                    }
                )
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
        if (interaction.options.getSubcommand() === 'configuration') {
            const embed = new MessageEmbed()
                .setTitle('Configuration Commands')
                .setTimestamp()
                .addFields(
                    {
                        name: 'Commands', value: '**/configure servername** - Configure the server name\n' +
                            '**/configure welcomechannel** - Configure the welcome channel\n' +
                            '**/configure welcomemessage** - Configure the welcome message'
                    }
                )
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
}