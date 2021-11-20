/**
 *  Copyright (c) 2020 DeltaXML Ltd. and others.
 *
 *  Contributors:
 *  DeltaXML Ltd. - xmlDocumentFormattingProvider
 */
import { LanguageConfiguration } from './xslLexer';
import { BaseToken } from './xpLexer';
import * as monaco from 'monaco-editor';
export declare class XMLDocumentFormattingProvider {
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
    provideOnTypeFormattingEdits: (document: monaco.editor.ITextModel, pos: monaco.Position, ch: string, options: monaco.languages.FormattingOptions, token: monaco.CancellationToken) => monaco.languages.TextEdit[];
    provideDocumentFormattingEdits: (document: monaco.editor.ITextModel, options: monaco.languages.FormattingOptions, token: monaco.CancellationToken) => monaco.languages.TextEdit[];
    provideDocumentRangeFormattingEdits: (document: monaco.editor.ITextModel, range: monaco.Range, options: monaco.languages.FormattingOptions, token: monaco.CancellationToken) => monaco.languages.TextEdit[];
    private shouldAddNewLine;
    private getReplaceLineIndentTextEdit;
    static getTextForToken(lineNumber: number, token: BaseToken, document: monaco.editor.IModel): string;
    static firstNonWhitespaceCharacterIndex(text: string): number;
    static getTextForModel(doc: monaco.editor.ITextModel, range?: monaco.Range): string;
}
