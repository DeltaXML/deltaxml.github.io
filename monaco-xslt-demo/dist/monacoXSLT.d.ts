import * as monaco from 'monaco-editor';
export declare class MonacoXSLT {
    private xslLexer;
    constructor();
    static getSemanticTokenLegend(): string[];
    static getLegend(): {
        tokenTypes: string[];
        tokenModifiers: any[];
    };
    private getAdaptedXslType;
    provideDocumentSemanticTokens(model: any, lastResultId: any, token: any): {
        data: Uint32Array;
        resultId: any;
    };
}
export declare class Themes {
    static vsDarkTokenColors: monaco.editor.ITokenThemeRule[];
}
export declare class XMLFormatter {
    private lc;
    private fc;
    constructor(langId: string);
    provideOnTypeFormattingEdits(model: monaco.editor.ITextModel, position: monaco.Position, ch: string, options: monaco.languages.FormattingOptions, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.TextEdit[]>;
}
