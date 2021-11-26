module.exports = {
    name: "guildMemberRemove",
    async execute(member) {
        member.guild.channels.cache.get("910138653219651594").send(`${member.user} has left the server!`)
    }
}