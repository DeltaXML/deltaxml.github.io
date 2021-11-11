/**
 *  Copyright (c) 2020 DeltaXML Ltd. and others.
 *  All rights reserved. This program and the accompanying materials
 *  are made available under the terms of the MIT license
 *  which accompanies this distribution.
 *
 *  Contributors:
 *  DeltaXML Ltd. - XPath/XSLT Lexer/Syntax Highlighter
 */
export declare enum CharLevelState {
    init = 0,
    lB = 1,
    rB = 2,
    lC = 3,
    rC = 4,
    lSq = 5,
    rSq = 6,
    lDq = 7,
    rDq = 8,
    lBr = 9,
    rBr = 10,
    lPr = 11,
    rPr = 12,
    lWs = 13,
    escSq = 14,
    escDq = 15,
    sep = 16,
    lUri = 17,
    rUri = 18,
    lNl = 19,
    rNl = 20,
    dSep = 21,
    lVar = 22,
    exp = 23,
    lName = 24,
    lAttr = 25,
    dSep2 = 26,
    lEnt = 27,
    rEnt = 28,
    lSqEnt = 29,
    rSqEnt = 30,
    lDqEnt = 31,
    rDqEnt = 32,
    lLiteralSqEnt = 33,
    rLiteralSqEnt = 34,
    lLiteralDqEnt = 35,
    rLiteralDqEnt = 36,
    dot = 37
}
export declare enum TokenLevelState {
    attributeNameTest = 0,
    comment = 1,
    number = 2,
    Unset = 3,
    operator = 4,
    variable = 5,
    Whitespace = 6,
    string = 7,
    uriLiteral = 8,
    nodeType = 9,
    simpleType = 10,
    axisName = 11,
    nodeNameTest = 12,
    functionNameTest = 13,
    complexExpression = 14,
    function = 15,
    entityRef = 16,
    anonymousFunction = 17,
    mapKey = 18
}
export declare enum ExitCondition {
    None = 0,
    SingleQuote = 1,
    DoubleQuote = 2,
    CurlyBrace = 3
}
export interface LexPosition {
    line: number;
    startCharacter: number;
    documentOffset: number;
}
export declare type TokenTypeStrings = keyof typeof TokenLevelState;
export declare enum ModifierState {
    UnusedVar = 0,
    UnresolvedRef = 1
}
export declare class Data {
    static separators: string[];
    static doubleSeps: string[];
    static anySeps: string[];
    static triggerWords: string[];
    static axes: string[];
    static cAxes: string[];
    static nodeTypes: string[];
    static nodeTypesBrackets: string[];
    static cNodeTypes: string[];
    static keywords: string[];
    static rangeVars: string[];
    static firstParts: string[];
    static secondParts: string[];
    static nonFunctionConditional: string[];
    static nonFunctionTypes: string[];
    static nonFunctionTypesBrackets: string[];
    static setAsOperatorIfKeyword(token: Token): void;
    static isPart2andMatchesPart1(part1Token: Token, part2Token: Token): [boolean, boolean];
}
export declare class XPathLexer {
    debug: boolean;
    timerOn: boolean;
    entityRefOn: boolean;
    documentText: string;
    documentTokens: BaseToken[];
    attributeNameTests: string[] | undefined;
    elementNameTests: string[] | undefined;
    private latestRealToken;
    private lineNumber;
    private wsCharNumber;
    private tokenCharNumber;
    private wsNewLine;
    private deferWsNewLine;
    reset(): void;
    static getTextmateTypeLegend(): string[];
    private static isPartOperator;
    private calcNewState;
    analyse(xpathArg: string, exitCondition: ExitCondition | null, position: LexPosition): Token[];
    static checkExitStringLiteralEnd(lastToken: BaseToken, result: BaseToken[]): void;
    static checkStringLiteralEnd(lastToken: BaseToken): void;
    private static closeMatchesOpen;
    private update;
    private unChangedStateSignificant;
    private updateResult;
    private conditionallyPopStack;
    private updateTokenBeforeBrackets;
    private setLabelForLastTokenOnly;
    private setLabelsUsingCurrentToken;
    testChar(existingState: CharLevelState, isFirstChar: boolean, char: string, nextChar: string, nesting: number): {
        rv: CharLevelState;
        nesting: number;
    };
    private static isDigit;
    static isCharTypeEqual(token: Token | null, type2: CharLevelState): boolean;
    private static isTokenTypeEqual;
    private static isTokenTypeAType;
    private static isTokenTypeUnset;
}
export declare enum ErrorType {
    None = 0,
    AxisName = 1,
    UnusedVariable = 2,
    UnresolvedVarReference = 3,
    DuplicateVarName = 4,
    DuplicateFnName = 5,
    DuplicateParameterName = 6,
    DuplicateTemplateName = 7,
    DuplicateAccumulatorName = 8,
    ElementNesting = 9,
    ElementNestingX = 10,
    ParentLessText = 11,
    ProcessingInstructionName = 12,
    MultiRoot = 13,
    XMLName = 14,
    XMLSyntax = 15,
    XSLTName = 16,
    XSLTInstrUnexpected = 17,
    XSLTAttrUnexpected = 18,
    XPathTypeName = 19,
    XSLTPrefix = 20,
    MissingTemplateParam = 21,
    IterateParamInvalid = 22,
    MissingPrefixInList = 23,
    TemplateNameUnresolved = 24,
    TemplateModeUnresolved = 25,
    AttributeSetUnresolved = 26,
    AccumulatorNameUnresolved = 27,
    XMLDeclaration = 28,
    XPathName = 29,
    EntityName = 30,
    XPathFunction = 31,
    XSLTFunctionNamePrefix = 32,
    XPathEmpty = 33,
    XPathFunctionNamespace = 34,
    XPathFunctionUnexpected = 35,
    XPathOperatorUnexpected = 36,
    XPathPrefix = 37,
    XPathKeyword = 38,
    XPathExpectedComplex = 39,
    XMLXMLNS = 40,
    XMLAttributeName = 41,
    XSLTNamesapce = 42,
    XMLAttributeXMLNS = 43,
    XMLAttNameSyntax = 44,
    XMLAttEqualExpected = 45,
    XMLDupllicateAtt = 46,
    XPathUnexpected = 47,
    XPathAwaiting = 48,
    XPathStringLiteral = 49,
    BracketNesting = 50,
    ExpectedElseAfterThen = 51,
    ExpectedDollarAfterComma = 52,
    PopNesting = 53,
    XSLTKeyUnresolved = 54,
    XMLRootMissing = 55,
    DTD = 56
}
export interface BaseToken {
    line: number;
    startCharacter: number;
    length: number;
    value: string;
    charType?: number;
    tokenType: number;
    context?: BaseToken | null;
    error?: ErrorType;
    nesting?: number;
    referenced?: boolean;
}
export interface Token extends BaseToken {
    charType?: CharLevelState;
    tokenType: TokenLevelState;
    context?: Token | null;
    children?: Token[];
    error?: ErrorType;
}
export declare class Utilities {
    static minimiseTokens(tokens: Token[]): Token[];
    static minimiseTokens2(tokens: Token[]): Token[];
}
