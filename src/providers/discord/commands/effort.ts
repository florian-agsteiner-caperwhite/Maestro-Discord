import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { channelDb } from '../channelsDb';
import { threadDb } from '../threadsDb';

export const data = new SlashCommandBuilder()
  .setName('effort')
  .setDescription('Set or clear the effort override for this session scope')
  .addStringOption((opt) =>
    opt
      .setName('effort')
      .setDescription("Effort level (use 'default' to clear)")
      .setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const value = interaction.options.getString('effort', true).trim();
  const effort = value.toLowerCase() === 'default' ? null : value;

  if (interaction.channel?.isThread()) {
    const threadInfo = threadDb.get(interaction.channelId);
    if (!threadInfo) {
      await interaction.reply({
        content: '❌ This thread is not registered as a session thread.',
        ephemeral: true,
      });
      return;
    }
    const channelInfo = channelDb.get(threadInfo.channel_id);
    if (!channelInfo) {
      await interaction.reply({
        content: '❌ This thread is not connected to an agent channel.',
        ephemeral: true,
      });
      return;
    }
    threadDb.setEffort(interaction.channelId, effort);
    await interaction.reply({
      content: `✅ Session effort set to \`${effort ?? '(default)'}\`.`,
      ephemeral: true,
    });
    return;
  }

  const channelInfo = channelDb.get(interaction.channelId);
  if (!channelInfo) {
    await interaction.reply({
      content: '❌ This channel is not connected to an agent. Use `/agents new` first.',
      ephemeral: true,
    });
    return;
  }

  channelDb.setEffort(interaction.channelId, effort);
  await interaction.reply({
    content: `✅ Session effort set to \`${effort ?? '(default)'}\`.`,
    ephemeral: true,
  });
}
