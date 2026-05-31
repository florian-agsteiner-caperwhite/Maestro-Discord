import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { channelDb } from '../channelsDb';
import { threadDb } from '../threadsDb';

export const data = new SlashCommandBuilder()
  .setName('model')
  .setDescription('Set or clear the model override for this session scope')
  .addStringOption((opt) =>
    opt
      .setName('model')
      .setDescription("Model name (use 'default' to clear)")
      .setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const value = interaction.options.getString('model', true).trim();
  const model = value.toLowerCase() === 'default' ? null : value;

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
    threadDb.setModel(interaction.channelId, model);
    await interaction.reply({
      content: `✅ Session model set to \`${model ?? '(default)'}\`.`,
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

  channelDb.setModel(interaction.channelId, model);
  await interaction.reply({
    content: `✅ Session model set to \`${model ?? '(default)'}\`.`,
    ephemeral: true,
  });
}
