import * as vscode from 'vscode';

export class VSCodePosition implements vscode.Position {
	constructor (line: number, character: number) {
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
	constructor() {

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
	lineAt(line: number): vscode.TextLine;
	lineAt(position: vscode.Position): vscode.TextLine;
	lineAt(position: any): vscode.TextLine {
		throw new Error('Method not implemented.');
	}
	offsetAt(position: vscode.Position): number {
		throw new Error('Method not implemented.');
	}
	positionAt(offset: number): vscode.Position {
		throw new Error('Method not implemented.');
	}
	getText(range?: vscode.Range): string {
		throw new Error('Method not implemented.');
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