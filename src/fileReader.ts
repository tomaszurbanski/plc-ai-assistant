import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const SUPPORTED_EXTENSIONS = ['.scl', '.xml', '.db', '.udt', '.txt', '.csv'];
const MAX_FILE_SIZE_BYTES = 200_000;
const MAX_FOLDER_FILES = 20;

export async function readFileContent(uri: vscode.Uri): Promise<string> {
  const stat = fs.statSync(uri.fsPath);

  if (stat.isDirectory()) {
    return readFolderContents(uri.fsPath);
  }

  if (stat.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File too large (${Math.round(stat.size / 1024)} KB). Maximum is 200 KB.`);
  }

  return fs.readFileSync(uri.fsPath, 'utf-8');
}

function readFolderContents(folderPath: string): string {
  const files = fs.readdirSync(folderPath)
    .filter(f => SUPPORTED_EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .slice(0, MAX_FOLDER_FILES);

  if (files.length === 0) {
    throw new Error('No supported PLC files found in this folder.\nSupported: ' + SUPPORTED_EXTENSIONS.join(', '));
  }

  const parts: string[] = [`// Folder: ${path.basename(folderPath)} (${files.length} files)\n`];

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stat = fs.statSync(filePath);
    if (stat.size > MAX_FILE_SIZE_BYTES) { continue; }

    parts.push(`\n// === FILE: ${file} ===\n`);
    parts.push(fs.readFileSync(filePath, 'utf-8'));
  }

  return parts.join('\n');
}

export function getSelectedText(editor: vscode.TextEditor): string {
  const selection = editor.selection;
  if (selection.isEmpty) {
    return editor.document.getText();
  }
  return editor.document.getText(selection);
}
