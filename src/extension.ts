import * as vscode from 'vscode';
import { AIClient } from './aiClient';
import { ResultPanel } from './resultPanel';
import { readFileContent, getSelectedText } from './fileReader';
import { SYSTEM_PROMPT_BASE, PROMPTS } from './prompts';

const ai = new AIClient();

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('plcAI.analyzeBlock', (uri?: vscode.Uri) =>
      runWithFile(uri, 'Analyze PLC Block', async (code, lang) => {
        return ai.analyze(SYSTEM_PROMPT_BASE, PROMPTS.analyzeBlock(code, lang));
      }, context)
    ),

    vscode.commands.registerCommand('plcAI.generateDocumentation', (uri?: vscode.Uri) =>
      runWithFile(uri, 'Maintenance Documentation', async (code, lang) => {
        return ai.analyze(SYSTEM_PROMPT_BASE, PROMPTS.generateDocumentation(code, lang));
      }, context)
    ),

    vscode.commands.registerCommand('plcAI.generateAlarmList', (uri?: vscode.Uri) =>
      runWithFile(uri, 'HMI Alarm List', async (code, lang) => {
        return ai.analyze(SYSTEM_PROMPT_BASE, PROMPTS.generateAlarmList(code, lang));
      }, context)
    ),

    vscode.commands.registerCommand('plcAI.findMissingDiagnostics', (uri?: vscode.Uri) =>
      runWithFile(uri, 'Missing Diagnostics Audit', async (code, lang) => {
        return ai.analyze(SYSTEM_PROMPT_BASE, PROMPTS.findMissingDiagnostics(code, lang));
      }, context)
    ),

    vscode.commands.registerCommand('plcAI.createFatChecklist', (uri?: vscode.Uri) =>
      runWithFile(uri, 'FAT/SAT Checklist', async (code, lang) => {
        return ai.analyze(SYSTEM_PROMPT_BASE, PROMPTS.createFatChecklist(code, lang));
      }, context)
    ),

    vscode.commands.registerCommand('plcAI.explainCode', () =>
      runWithEditor('Explain PLC Code', async (code, lang) => {
        return ai.analyze(SYSTEM_PROMPT_BASE, PROMPTS.explainCode(code, lang));
      }, context)
    ),

    vscode.commands.registerCommand('plcAI.generateSclBlock', () =>
      runGenerateSclBlock(context)
    )
  );
}

async function runWithFile(
  uri: vscode.Uri | undefined,
  title: string,
  fn: (code: string, lang: string) => Promise<string>,
  context: vscode.ExtensionContext
) {
  const fileUri = uri ?? vscode.window.activeTextEditor?.document.uri;

  if (!fileUri) {
    vscode.window.showWarningMessage('PLC AI: No file selected. Open or select a PLC file first.');
    return;
  }

  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: `PLC AI: ${title}...`, cancellable: false },
    async () => {
      try {
        const code = await readFileContent(fileUri);
        const lang = ai.getOutputLanguage();
        const result = await fn(code, lang);
        ResultPanel.show(`PLC AI: ${title}`, result, context);
      } catch (err: unknown) {
        vscode.window.showErrorMessage(`PLC AI Error: ${(err as Error).message}`);
      }
    }
  );
}

async function runWithEditor(
  title: string,
  fn: (code: string, lang: string) => Promise<string>,
  context: vscode.ExtensionContext
) {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showWarningMessage('PLC AI: No active editor.');
    return;
  }

  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: `PLC AI: ${title}...`, cancellable: false },
    async () => {
      try {
        const code = getSelectedText(editor);
        const lang = ai.getOutputLanguage();
        const result = await fn(code, lang);
        ResultPanel.show(`PLC AI: ${title}`, result, context);
      } catch (err: unknown) {
        vscode.window.showErrorMessage(`PLC AI Error: ${(err as Error).message}`);
      }
    }
  );
}

async function runGenerateSclBlock(context: vscode.ExtensionContext) {
  const description = await vscode.window.showInputBox({
    prompt: 'Describe the SCL block you need',
    placeHolder: 'e.g. FB for pneumatic cylinder with 2 sensors, timeout, manual mode, alarm and reset',
    ignoreFocusOut: true,
  });

  if (!description) { return; }

  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: 'PLC AI: Generating SCL Block...', cancellable: false },
    async () => {
      try {
        const lang = ai.getOutputLanguage();
        const result = await ai.analyze(SYSTEM_PROMPT_BASE, PROMPTS.generateSclBlock(description, lang));
        ResultPanel.show('PLC AI: Generated SCL Block', result, context);
      } catch (err: unknown) {
        vscode.window.showErrorMessage(`PLC AI Error: ${(err as Error).message}`);
      }
    }
  );
}

export function deactivate() {}
