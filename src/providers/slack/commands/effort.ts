import type { SlackCommandMiddlewareArgs } from '@slack/bolt';
import { channelDb } from '../channelsDb';
import { logger } from '../../../core/logger';
import { slackConfig } from '../config';

export async function handle({ ack, say, command }: SlackCommandMiddlewareArgs): Promise<void> {
  await ack();

  const allowed = slackConfig.allowedUserIds;
  if (allowed.length > 0 && !allowed.includes(command.user_id)) {
    await say('You are not authorized to use this command.');
    return;
  }

  const value = (command.text || '').trim();
  if (!value) {
    await say('Usage: `/effort <effort|default>`');
    return;
  }

  const channelInfo = channelDb.get(command.channel_id);
  if (!channelInfo) {
    await say('No agent is registered in this channel. Use `/agents new <agent-id>` first.');
    return;
  }

  try {
    const effort = value.toLowerCase() === 'default' ? null : value;
    channelDb.setEffort(command.channel_id, effort);
    await say(`Session effort set to \`${effort ?? '(default)'}\`.`);
  } catch (err) {
    void logger.error('slack/effort', err instanceof Error ? err.message : String(err));
    await say('Failed to set effort override.');
  }
}
