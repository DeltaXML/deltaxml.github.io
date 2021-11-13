import * as vscode from 'vscode';
import * as monaco from 'monaco-editor'
import { MonacoToVSCode } from './monacoXSLT';

export class VSCodePosition implements vscode.Position {
	constructor(line: number, character: number) {
		this.line = line;
		this.character = character;
	}
	line: number;
	character: number;
	isBefore(other: vscode.Position): boolean {
		throw new Error('Method not implemented.');
	}
	isBeforeOrEqual(other: vscode.Position): boolean {
		throw new Error('Method not implemented.');
	}
	isAfter(other: vscode.Position): boolean {
		throw new Error('Method not implemented.');
	}
	isAfterOrEqual(other: vscode.Position): boolean {
		throw new Error('Method not implemented.');
	}
	isEqual(other: vscode.Position): boolean {
		throw new Error('Method not implemented.');
	}
	compareTo(other: vscode.Position): number {
		throw new Error('Method not implemented.');
	}
	translate(lineDelta?: number, characterDelta?: number): vscode.Position;
	translate(change: { lineDelta?: number; characterDelta?: number; }): vscode.Position;
	translate(lineDelta?: any, characterDelta?: any): vscode.Position {
		throw new Error('Method not implemented.');
	}
	with(line?: number, character?: number): vscode.Position;
	with(change: { line?: number; character?: number; }): vscode.Position;
	with(line?: any, character?: any): vscode.Position {
		throw new Error('Method not implemented.');
	}
}

export class VSCodeTextDocument implements vscode.TextDocument {
	private model: monaco.editor.ITextModel;

	constructor(model: monaco.editor.ITextModel) {
		this.eol = model.getEOL() === '\n' ? vscode.EndOfLine.LF : vscode.EndOfLine.CRLF;
		this.model = model;
		this.lineCount = model.getLineCount();
	}

	uri: vscode.Uri;
	fileName: string;
	isUntitled: boolean;
	languageId: string;
	version: number;
	isDirty: boolean;
	isClosed: boolean;
	save(): Thenable<boolean> {
		throw new Error('Method not implemented.');
	}
	eol: vscode.EndOfLine;
	lineCount: number;
	lineAt(line: any): vscode.TextLine {
		if (typeof line === 'number') {
			return new VSCodeTextLine(this.model, line);
		} else {
			throw new Error('Method not implemented.');
		}
	}

	offsetAt(position: vscode.Position): number {
		throw new Error('Method not implemented.');
	}
	positionAt(offset: number): vscode.Position {
		throw new Error('Method not implemented.');
	}
	getText(range?: vscode.Range): string {
		let result = '';
		const lines = this.model.getLinesContent();
		const startLine = range.start.line;
		const endLine = range.end.line
		if (range) {
			if (startLine === endLine) {
				result = this.model.getLineContent(startLine)
				.substring(range.start.character, range.end.character);
			} else {
				const rangeLines: string[] = []
				for (let index = startLine; index <= endLine; index++) {
					const lineText = this.model.getLineContent(index);
					if (index === startLine) {
						rangeLines.push(lineText.substring(range.start.character));
					} else if (index === endLine) {
						rangeLines.push(lineText.substring(0, range.end.character));
					} else {
						rangeLines.push(lineText);
					}
				}
				result = rangeLines.join(this.model.getEOL());
			}
		} else {
			result = lines.join(this.model.getEOL());
		}
		return result;
	}
	getWordRangeAtPosition(position: vscode.Position, regex?: RegExp): vscode.Range {
		throw new Error('Method not implemented.');
	}
	validateRange(range: vscode.Range): vscode.Range {
		throw new Error('Method not implemented.');
	}
	validatePosition(position: vscode.Position): vscode.Position {
		throw new Error('Method not implemented.');
	}
}

export class VSCodeFormattingOptions implements vscode.FormattingOptions {
	[key: string]: string | number | boolean;
	tabSize: number;
	insertSpaces: boolean;
	constructor(options: monaco.languages.FormattingOptions) {
		this.tabSize = options.tabSize;
		this.insertSpaces = options.insertSpaces;
	}
}

class VSCodeTextLine implements vscode.TextLine {
	lineNumber: number;
	text: string;
	range: vscode.Range;
	rangeIncludingLineBreak: vscode.Range;
	firstNonWhitespaceCharacterIndex: number;
	isEmptyOrWhitespace: boolean;

	constructor(model: monaco.editor.ITextModel, line: number) {
		this.lineNumber = line;
		this.text = model.getLineContent(line);
		this.firstNonWhitespaceCharacterIndex = this.text.search(/\S/);
	}
}