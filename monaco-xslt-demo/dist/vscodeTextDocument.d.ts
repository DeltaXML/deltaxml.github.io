import * as vscode from 'vscode';
export declare class VSCodePosition implements vscode.Position {
    constructor(line: number, character: number);
    line: number;
    character: number;
    isBefore(other: vscode.Position): boolean;
    isBeforeOrEqual(other: vscode.Position): boolean;
    isAfter(other: vscode.Position): boolean;
    isAfterOrEqual(other: vscode.Position): boolean;
    isEqual(other: vscode.Position): boolean;
    compareTo(other: vscode.Position): number;
    translate(lineDelta?: number, characterDelta?: number): vscode.Position;
    translate(change: {
        lineDelta?: number;
        characterDelta?: number;
    }): vscode.Position;
    with(line?: number, character?: number): vscode.Position;
    with(change: {
        line?: number;
        character?: number;
    }): vscode.Position;
}
export declare class VSCodeTextDocument implements vscode.TextDocument {
    constructor();
    uri: vscode.Uri;
    fileName: string;
    isUntitled: boolean;
    languageId: string;
    version: number;
    isDirty: boolean;
    isClosed: boolean;
    save(): Thenable<boolean>;
    eol: vscode.EndOfLine;
    lineCount: number;
    lineAt(line: number): vscode.TextLine;
    lineAt(position: vscode.Position): vscode.TextLine;
    offsetAt(position: vscode.Position): number;
    positionAt(offset: number): vscode.Position;
    getText(range?: vscode.Range): string;
    getWordRangeAtPosition(position: vscode.Position, regex?: RegExp): vscode.Range;
    validateRange(range: vscode.Range): vscode.Range;
    validatePosition(position: vscode.Position): vscode.Position;
}
