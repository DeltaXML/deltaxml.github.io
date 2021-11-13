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
