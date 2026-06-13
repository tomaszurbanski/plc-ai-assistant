import Anthropic from '@anthropic-ai/sdk';
import * as vscode from 'vscode';

export class AIClient {
  private client: Anthropic | null = null;

  private getClient(): Anthropic {
    const config = vscode.workspace.getConfiguration('plcAI');
    const apiKey = config.get<string>('anthropicApiKey') || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error(
        'Anthropic API key not configured.\n\nGo to Settings → Extensions → PLC AI Assistant → Anthropic API Key\nor set the ANTHROPIC_API_KEY environment variable.'
      );
    }

    if (!this.client || this.client.apiKey !== apiKey) {
      this.client = new Anthropic({ apiKey });
    }
    return this.client;
  }

  getModel(): string {
    const config = vscode.workspace.getConfiguration('plcAI');
    return config.get<string>('model') || 'claude-sonnet-4-6';
  }

  getOutputLanguage(): string {
    const config = vscode.workspace.getConfiguration('plcAI');
    return config.get<string>('outputLanguage') || 'PL+EN';
  }

  async analyze(systemPrompt: string, userMessage: string): Promise<string> {
    const client = this.getClient();
    const model = this.getModel();

    const response = await client.messages.create({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const textBlock = response.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from AI.');
    }
    return textBlock.text;
  }
}
