/**
 *  Copyright (c) 2020 DeltaXML Ltd. and others.
 *  All rights reserved. This program and the accompanying materials
 *  are made available under the terms of the MIT license
 *  which accompanies this distribution.
 *
 *  Contributors:
 *  DeltaXML Ltd. - XPath/XSLT Lexer/Syntax Highlighter
 */
import { BaseToken, TokenLevelState } from "./xpLexer";
import { SchemaData } from "./xsltSchema";
export declare enum DocumentTypes {
    XSLT = 0,
    XPath = 1,
    DCP = 2,
    SCH = 3,
    Other = 4
}
export declare enum XMLCharState {
    init = 0,
    lSt = 1,
    rSt = 2,
    rStNoAtt = 3,
    lComment = 4,
    rComment = 5,
    lPi = 6,
    lPi2 = 7,
    lPiName = 8,
    rPiName = 9,
    lPiValue = 10,
    rPi = 11,
    rPiNameOnly = 12,
    lCd = 13,
    lCdataEnd = 14,
    rCd = 15,
    rCdataEnd = 16,
    awaitingRcdata = 17,
    lSq = 18,
    lDq = 19,
    wsBeforeAttname = 20,
    rSq = 21,
    rDq = 22,
    lExclam = 23,
    rDtd = 24,
    lWs = 25,
    lCt = 26,
    lCt2 = 27,
    lCtName = 28,
    rCt = 29,
    rSelfCtNoAtt = 30,
    rSelfCt = 31,
    lEn = 32,
    rEn = 33,
    lAn = 34,
    rAn = 35,
    eqA = 36,
    lAb = 37,
    sqAvt = 38,
    dqAvt = 39,
    escDqAvt = 40,
    escSqAvt = 41,
    tvt = 42,
    tvtCdata = 43,
    escTvt = 44,
    escTvtCdata = 45,
    lsElementNameWs = 46,
    wsAfterAttName = 47,
    syntaxError = 48,
    lsEqWs = 49,
    lStEq = 50,
    lEntity = 51,
    rEntity = 52,
    lText = 53
}
export declare enum EntityPosition {
    text = 0,
    attrDq = 1,
    attrSq = 2
}
export declare enum XSLTokenLevelState {
    attributeName = 0,
    attributeEquals = 1,
    attributeValue = 2,
    xmlnsName = 3,
    dtd = 4,
    dtdEnd = 5,
    elementName = 6,
    elementValue = 7,
    processingInstrName = 8,
    processingInstrValue = 9,
    entityRef = 10,
    xmlComment = 11,
    xmlPunctuation = 12,
    xslElementName = 13,
    xmlText = 14
}
export interface XslToken extends BaseToken {
    line: number;
    startCharacter: number;
    length: number;
    value: string;
    charType?: XMLCharState;
    tokenType: TokenLevelState;
    context?: XslToken | null;
    error?: any;
}
export interface Snippet {
    name: string;
    body: string;
    description: string;
}
export interface LanguageConfiguration {
    expressionAtts: string[];
    variableElementNames: string[];
    linkElementAttrNames?: [string, string];
    avtAtts?: string[];
    nativePrefix: string;
    tvtAttributes: string[];
    nonNativeAvts: boolean;
    schemaData?: SchemaData;
    docType: DocumentTypes;
    resourceNames?: string[];
    featureNames?: string[];
    propertyNames?: string[];
    rootElementSnippets?: Snippet[];
    elementSnippets?: Snippet[];
}
export interface GlobalInstructionData {
    name: string;
    type: GlobalInstructionType;
    token: BaseToken;
    idNumber: number;
    memberNames?: string[];
    href?: string;
    version?: string;
}
export declare class XslLexer {
    debug: boolean;
    flatten: boolean;
    timerOn: boolean;
    provideCharLevelState: boolean;
    globalInstructionData: GlobalInstructionData[];
    attributeNameTests: string[] | undefined;
    elementNameTests: string[] | undefined;
    protected globalModeData: GlobalInstructionData[];
    private lineNumber;
    private charCount;
    private lineCharCount;
    private static xpathLegend;
    protected static xpathLegendLength: number;
    private commentCharCount;
    private cdataCharCount;
    protected entityContext: EntityPosition;
    private languageConfiguration;
    private skipTokenChar;
    private nativeTvtAttributes;
    private genericTvtAttributes;
    private nativePrefixLength;
    private dtdNesting;
    private nonNativeAvts;
    private docType;
    constructor(languageConfiguration: LanguageConfiguration);
    static getTextmateTypeLegend(): string[];
    static getXsltStartTokenNumber(): number;
    private isWhitespace;
    isAvtAtt(name: string): boolean;
    isExpressionAtt(name: string): boolean;
    protected calcNewState(isCurrentCharNewLine: boolean, char: string, nextChar: string, existing: XMLCharState): XMLCharState;
    private testAttNameChar;
    private testAttValueChar;
    private testChar;
    analyse(xsl: string, keepNameTests?: boolean): BaseToken[];
    private updateNames;
    private addNewTokenToResult;
    private addCharTokenToResult;
    private addToElementStack;
    protected getElementProperties(tokenChars: string[], isRootChild: boolean): ElementProperties;
}
export interface ElementProperties {
    isNative: boolean;
    instructionType: GlobalInstructionType;
    nativeName: string;
}
export declare enum GlobalInstructionType {
    Variable = 0,
    Parameter = 1,
    Function = 2,
    Mode = 3,
    Accumulator = 4,
    AttributeSet = 5,
    Key = 6,
    Template = 7,
    TemplateMatch = 8,
    Include = 9,
    Import = 10,
    UsePackage = 11,
    RootXMLNS = 12,
    Unknown = 13
}
export interface InnerLexerResult {
    charCount: number;
    lineNumber: number;
    tokens: BaseToken[];
}
