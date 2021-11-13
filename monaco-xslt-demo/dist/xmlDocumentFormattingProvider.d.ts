/**
 *  Copyright (c) 2020 DeltaXML Ltd. and others.
 *
 *  Contributors:
 *  DeltaXML Ltd. - xmlDocumentFormattingProvider
 */
import * as vscode from 'vscode';
import { LanguageConfiguration } from './xslLexer';
export declare class XMLDocumentFormattingProvider implements vscode.DocumentFormattingEditProvider, vscode.DocumentRangeFormattingEditProvider, vscode.OnTypeFormattingEditProvider {
    replaceIndendation: boolean;
    minimiseXPathIndents: boolean;
    indentMixedContent: boolean;
    private xslLexer;
    private xpLexer;
    private docType;
    private onType;
    private onTypeLineEmpty;
    private static xsltStartTokenNumber;
    private isCloseTag;
    private closeTagLine;
    private closeTagPos;
    constructor(xsltConfiguration: LanguageConfiguration);
    private trimLeft;
    provideOnTypeFormattingEdits: (document: vscode.TextDocument, pos: vscode.Position, ch: string, options: vscode.FormattingOptions, token: vscode.CancellationToken) => vscode.TextEdit[];
    provideDocumentFormattingEdits: (document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken) => vscode.TextEdit[];
    provideDocumentRangeFormattingEdits: (document: vscode.TextDocument, range: vscode.Range, options: vscode.FormattingOptions, token: vscode.CancellationToken) => vscode.TextEdit[];
    private shouldAddNewLine;
    private getReplaceLineIndentTextEdit;
}
