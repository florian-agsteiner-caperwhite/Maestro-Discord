import { channelDb as core, type AgentChannel } from '../../core/db';

/**
 * Slack-side wrapper around the provider-aware core channel registry.
 * Pre-binds `provider='slack'` so adapter code reads naturally.
 */
export const channelDb = {
  register(channelId: string, agentId: string, agentName: string): void {
    core.register('slack', channelId, agentId, agentName, null);
  },
  get(channelId: string): AgentChannel | undefined {
    return core.get('slack', channelId);
  },
  getByAgentId(agentId: string): AgentChannel | undefined {
    return core.getByAgentId('slack', agentId);
  },
  updateSession(channelId: string, sessionId: string | null): void {
    core.updateSession('slack', channelId, sessionId);
  },
  setReadOnly(channelId: string, readOnly: boolean): void {
    core.setReadOnly('slack', channelId, readOnly);
  },
  setModel(channelId: string, model: string | null): void {
    core.setModel('slack', channelId, model);
  },
  setEffort(channelId: string, effort: string | null): void {
    core.setEffort('slack', channelId, effort);
  },
  remove(channelId: string): void {
    core.remove('slack', channelId);
  },
  listByAgentId(agentId: string): AgentChannel[] {
    return core.listByAgentId('slack', agentId);
  },
};

export type { AgentChannel } from '../../core/db';
