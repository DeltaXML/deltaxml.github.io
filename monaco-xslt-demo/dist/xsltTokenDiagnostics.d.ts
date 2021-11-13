/**
 *  Copyright (c) 2020 DeltaXML Ltd. and others.
 *
 *  Contributors:
 *  DeltaXML Ltd. - xsltTokenDiagnostics
 */
import * as vscode from 'vscode';
import { GlobalInstructionData, DocumentTypes, LanguageConfiguration } from './xslLexer';
import { BaseToken, ErrorType } from './xpLexer';
import { XSLTnamespaces } from './functionData';
declare enum TagType {
    XSLTstart = 0,
    XMLstart = 1,
    XSLTvar = 2,
    Start = 3,
    NonStart = 4
}
declare enum CurlyBraceType {
    None = 0,
    Map = 1,
    Array = 2
}
interface XSLTToken extends BaseToken {
    tagType?: TagType;
}
interface ElementData {
    variables: VariableData[];
    currentVariable?: VariableData;
    xpathVariableCurrentlyBeingDefined?: boolean;
    identifierToken: XSLTToken;
    symbolName: string;
    symbolID: string;
    childSymbols: vscode.DocumentSymbol[];
    namespacePrefixes: string[];
    expectedChildElements: string[];
}
interface XPathData {
    token: BaseToken;
    variables: VariableData[];
    preXPathVariable: boolean;
    xpathVariableCurrentlyBeingDefined: boolean;
    function?: BaseToken;
    functionArity?: number;
    isRangeVar?: boolean;
    awaitingMapKey?: boolean;
    curlyBraceType?: CurlyBraceType;
}
interface VariableData {
    token: BaseToken;
    name: string;
}
export declare class XsltTokenDiagnostics {
    private static readonly xsltStartTokenNumber;
    static readonly xsltCatchVariables: string[];
    private static readonly xslInclude;
    private static readonly xslImport;
    private static readonly xmlChars;
    private static readonly xslFunction;
    private static readonly xslNameAtt;
    private static readonly xslModeAtt;
    private static readonly useAttSet;
    private static readonly xslUseAttSet;
    private static readonly excludePrefixes;
    private static readonly xslExcludePrefixes;
    private static readonly brackets;
    private static isBracket;
    private static nameStartCharRgx;
    private static nameCharRgx;
    private static validateName;
    static calculateDiagnostics: (languageConfig: LanguageConfiguration, docType: DocumentTypes, document: vscode.TextDocument, allTokens: BaseToken[], globalInstructionData: GlobalInstructionData[], importedInstructionData: GlobalInstructionData[], symbols: vscode.DocumentSymbol[]) => vscode.Diagnostic[];
    private static checkFinalXPathToken;
    private static getExpectedElementNames;
    private static validateEntityRef;
    private static checkTokenIsExpected;
    private static validateXMLDeclaration;
    private static xorInputs;
    static isValidFunctionName(xmlnsPrefixes: string[], xmlnsData: Map<string, XSLTnamespaces>, token: BaseToken, checkedGlobalFnNames: string[], arity?: number): {
        isValid: boolean;
        qFunctionName: string;
        fErrorType: ErrorType.None | ErrorType.XPathFunction | ErrorType.XPathFunctionNamespace;
    };
    static getTextForToken(lineNumber: number, token: BaseToken, document: vscode.TextDocument): string;
    private static resolveXPathVariableReference;
    private static createSymbolFromElementTokens;
    static createSymbolForAttribute(innerToken: BaseToken, attrName: string): vscode.DocumentSymbol;
    static initChildrenSymbols(attrSymbols: vscode.DocumentSymbol[]): vscode.DocumentSymbol[];
    static resolveVariableName(variableList: VariableData[], varName: string, xpathVariableCurrentlyBeingDefined: boolean, globalXsltVariable: VariableData | null): boolean;
    static resolveStackVariableName(elementStack: ElementData[] | XPathData[], varName: string): boolean;
    private static getDiagnosticsFromUnusedVariableTokens;
    private static appendDiagnosticsFromProblemTokens;
    private static getMatchingSymbol;
    private static getMatchingToken;
    private static createUnusedVarDiagnostic;
    static createImportDiagnostic(data: GlobalInstructionData): vscode.Diagnostic;
    private static createUnresolvedVarDiagnostic;
}
export {};
