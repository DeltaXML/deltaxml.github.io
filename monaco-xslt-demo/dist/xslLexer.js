/**
 *  Copyright (c) 2020 DeltaXML Ltd. and others.
 *  All rights reserved. This program and the accompanying materials
 *  are made available under the terms of the MIT license
 *  which accompanies this distribution.
 *
 *  Contributors:
 *  DeltaXML Ltd. - XPath/XSLT Lexer/Syntax Highlighter
 */
define(["require", "exports", "./xpLexer"], function (require, exports, xpLexer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GlobalInstructionType = exports.XslLexer = exports.XSLTokenLevelState = exports.EntityPosition = exports.XMLCharState = exports.DocumentTypes = void 0;
    var DocumentTypes;
    (function (DocumentTypes) {
        DocumentTypes[DocumentTypes["XSLT"] = 0] = "XSLT";
        DocumentTypes[DocumentTypes["XPath"] = 1] = "XPath";
        DocumentTypes[DocumentTypes["DCP"] = 2] = "DCP";
        DocumentTypes[DocumentTypes["SCH"] = 3] = "SCH";
        DocumentTypes[DocumentTypes["Other"] = 4] = "Other";
    })(DocumentTypes = exports.DocumentTypes || (exports.DocumentTypes = {}));
    var XMLCharState;
    (function (XMLCharState) {
        XMLCharState[XMLCharState["init"] = 0] = "init";
        XMLCharState[XMLCharState["lSt"] = 1] = "lSt";
        XMLCharState[XMLCharState["rSt"] = 2] = "rSt";
        XMLCharState[XMLCharState["rStNoAtt"] = 3] = "rStNoAtt";
        XMLCharState[XMLCharState["lComment"] = 4] = "lComment";
        XMLCharState[XMLCharState["rComment"] = 5] = "rComment";
        XMLCharState[XMLCharState["lPi"] = 6] = "lPi";
        XMLCharState[XMLCharState["lPi2"] = 7] = "lPi2";
        XMLCharState[XMLCharState["lPiName"] = 8] = "lPiName";
        XMLCharState[XMLCharState["rPiName"] = 9] = "rPiName";
        XMLCharState[XMLCharState["lPiValue"] = 10] = "lPiValue";
        XMLCharState[XMLCharState["rPi"] = 11] = "rPi";
        XMLCharState[XMLCharState["rPiNameOnly"] = 12] = "rPiNameOnly";
        XMLCharState[XMLCharState["lCd"] = 13] = "lCd";
        XMLCharState[XMLCharState["lCdataEnd"] = 14] = "lCdataEnd";
        XMLCharState[XMLCharState["rCd"] = 15] = "rCd";
        XMLCharState[XMLCharState["rCdataEnd"] = 16] = "rCdataEnd";
        XMLCharState[XMLCharState["awaitingRcdata"] = 17] = "awaitingRcdata";
        XMLCharState[XMLCharState["lSq"] = 18] = "lSq";
        XMLCharState[XMLCharState["lDq"] = 19] = "lDq";
        XMLCharState[XMLCharState["wsBeforeAttname"] = 20] = "wsBeforeAttname";
        XMLCharState[XMLCharState["rSq"] = 21] = "rSq";
        XMLCharState[XMLCharState["rDq"] = 22] = "rDq";
        XMLCharState[XMLCharState["lExclam"] = 23] = "lExclam";
        XMLCharState[XMLCharState["rDtd"] = 24] = "rDtd";
        XMLCharState[XMLCharState["lWs"] = 25] = "lWs";
        XMLCharState[XMLCharState["lCt"] = 26] = "lCt";
        XMLCharState[XMLCharState["lCt2"] = 27] = "lCt2";
        XMLCharState[XMLCharState["lCtName"] = 28] = "lCtName";
        XMLCharState[XMLCharState["rCt"] = 29] = "rCt";
        XMLCharState[XMLCharState["rSelfCtNoAtt"] = 30] = "rSelfCtNoAtt";
        XMLCharState[XMLCharState["rSelfCt"] = 31] = "rSelfCt";
        XMLCharState[XMLCharState["lEn"] = 32] = "lEn";
        XMLCharState[XMLCharState["rEn"] = 33] = "rEn";
        XMLCharState[XMLCharState["lAn"] = 34] = "lAn";
        XMLCharState[XMLCharState["rAn"] = 35] = "rAn";
        XMLCharState[XMLCharState["eqA"] = 36] = "eqA";
        XMLCharState[XMLCharState["lAb"] = 37] = "lAb";
        XMLCharState[XMLCharState["sqAvt"] = 38] = "sqAvt";
        XMLCharState[XMLCharState["dqAvt"] = 39] = "dqAvt";
        XMLCharState[XMLCharState["escDqAvt"] = 40] = "escDqAvt";
        XMLCharState[XMLCharState["escSqAvt"] = 41] = "escSqAvt";
        XMLCharState[XMLCharState["tvt"] = 42] = "tvt";
        XMLCharState[XMLCharState["tvtCdata"] = 43] = "tvtCdata";
        XMLCharState[XMLCharState["escTvt"] = 44] = "escTvt";
        XMLCharState[XMLCharState["escTvtCdata"] = 45] = "escTvtCdata";
        XMLCharState[XMLCharState["lsElementNameWs"] = 46] = "lsElementNameWs";
        XMLCharState[XMLCharState["wsAfterAttName"] = 47] = "wsAfterAttName";
        XMLCharState[XMLCharState["syntaxError"] = 48] = "syntaxError";
        XMLCharState[XMLCharState["lsEqWs"] = 49] = "lsEqWs";
        XMLCharState[XMLCharState["lStEq"] = 50] = "lStEq";
        XMLCharState[XMLCharState["lEntity"] = 51] = "lEntity";
        XMLCharState[XMLCharState["rEntity"] = 52] = "rEntity";
        XMLCharState[XMLCharState["lText"] = 53] = "lText";
    })(XMLCharState = exports.XMLCharState || (exports.XMLCharState = {}));
    var EntityPosition;
    (function (EntityPosition) {
        EntityPosition[EntityPosition["text"] = 0] = "text";
        EntityPosition[EntityPosition["attrDq"] = 1] = "attrDq";
        EntityPosition[EntityPosition["attrSq"] = 2] = "attrSq";
    })(EntityPosition = exports.EntityPosition || (exports.EntityPosition = {}));
    // for compatibility with legend - add count of XPath enums to this
    var XSLTokenLevelState;
    (function (XSLTokenLevelState) {
        XSLTokenLevelState[XSLTokenLevelState["attributeName"] = 0] = "attributeName";
        XSLTokenLevelState[XSLTokenLevelState["attributeEquals"] = 1] = "attributeEquals";
        XSLTokenLevelState[XSLTokenLevelState["attributeValue"] = 2] = "attributeValue";
        XSLTokenLevelState[XSLTokenLevelState["xmlnsName"] = 3] = "xmlnsName";
        XSLTokenLevelState[XSLTokenLevelState["dtd"] = 4] = "dtd";
        XSLTokenLevelState[XSLTokenLevelState["dtdEnd"] = 5] = "dtdEnd";
        XSLTokenLevelState[XSLTokenLevelState["elementName"] = 6] = "elementName";
        XSLTokenLevelState[XSLTokenLevelState["elementValue"] = 7] = "elementValue";
        XSLTokenLevelState[XSLTokenLevelState["processingInstrName"] = 8] = "processingInstrName";
        XSLTokenLevelState[XSLTokenLevelState["processingInstrValue"] = 9] = "processingInstrValue";
        XSLTokenLevelState[XSLTokenLevelState["entityRef"] = 10] = "entityRef";
        XSLTokenLevelState[XSLTokenLevelState["xmlComment"] = 11] = "xmlComment";
        XSLTokenLevelState[XSLTokenLevelState["xmlPunctuation"] = 12] = "xmlPunctuation";
        XSLTokenLevelState[XSLTokenLevelState["xslElementName"] = 13] = "xslElementName";
        XSLTokenLevelState[XSLTokenLevelState["xmlText"] = 14] = "xmlText";
    })(XSLTokenLevelState = exports.XSLTokenLevelState || (exports.XSLTokenLevelState = {}));
    var XslLexer = /** @class */ (function () {
        function XslLexer(languageConfiguration) {
            var _this = this;
            this.debug = false;
            this.flatten = false;
            this.timerOn = false;
            this.provideCharLevelState = false;
            this.globalInstructionData = [];
            this.globalModeData = [];
            this.lineNumber = 0;
            this.charCount = 0;
            this.lineCharCount = 0;
            this.commentCharCount = 0;
            this.cdataCharCount = 0;
            this.entityContext = EntityPosition.text;
            this.skipTokenChar = false;
            this.nativeTvtAttributes = [];
            this.genericTvtAttributes = [];
            this.nativePrefixLength = 0;
            this.dtdNesting = 0;
            this.nonNativeAvts = false;
            this.nonNativeAvts = languageConfiguration.nonNativeAvts;
            this.nativePrefixLength = languageConfiguration.nativePrefix.length === 0 ? 0 : languageConfiguration.nativePrefix.length + 1;
            this.languageConfiguration = languageConfiguration;
            this.languageConfiguration.tvtAttributes.forEach(function (tvtAttribute) {
                _this.nativeTvtAttributes.push(_this.languageConfiguration.nativePrefix + ':' + tvtAttribute);
            });
            this.genericTvtAttributes = this.languageConfiguration.tvtAttributes;
            this.docType = languageConfiguration.docType;
        }
        XslLexer.getTextmateTypeLegend = function () {
            // concat xsl legend to xpath legend
            var textmateTypes = this.xpathLegend.slice(0);
            var keyCount = Object.keys(XSLTokenLevelState).length / 2;
            for (var i = 0; i < keyCount; i++) {
                textmateTypes.push(XSLTokenLevelState[i]);
            }
            return textmateTypes;
        };
        XslLexer.getXsltStartTokenNumber = function () {
            return this.xpathLegend.length;
        };
        XslLexer.prototype.isWhitespace = function (isCurrentCharNewLine, char) {
            return isCurrentCharNewLine || char === ' ' || char == '\t' || char === '\r';
        };
        XslLexer.prototype.isAvtAtt = function (name) {
            return this.languageConfiguration.avtAtts ? this.languageConfiguration.avtAtts.indexOf(name) > -1 : false;
        };
        XslLexer.prototype.isExpressionAtt = function (name) {
            return this.languageConfiguration.expressionAtts ? this.languageConfiguration.expressionAtts.indexOf(name) > -1 : false;
        };
        XslLexer.prototype.calcNewState = function (isCurrentCharNewLine, char, nextChar, existing) {
            var rc = existing;
            var firstCharOfToken = true;
            switch (existing) {
                case XMLCharState.lCt:
                    rc = XMLCharState.lCt2;
                    break;
                case XMLCharState.lCt2:
                    rc = XMLCharState.lCtName;
                    break;
                case XMLCharState.lCtName:
                    if (char === '>') {
                        rc = XMLCharState.rCt;
                    }
                    break;
                case XMLCharState.lPi:
                    rc = XMLCharState.lPi2;
                    break;
                case XMLCharState.lPi2:
                    rc = XMLCharState.lPiName;
                    break;
                case XMLCharState.lPiName:
                    if (this.isWhitespace(isCurrentCharNewLine, char)) {
                        rc = XMLCharState.rPiName;
                    }
                    else if (char === '?' && nextChar === '>') {
                        rc = XMLCharState.rPiNameOnly;
                        this.skipTokenChar = true;
                    }
                    break;
                case XMLCharState.rPiName:
                    if (this.isWhitespace(isCurrentCharNewLine, char)) {
                        // no change
                    }
                    else if (char === '?' && nextChar === '>') {
                        rc = XMLCharState.rPi;
                        this.skipTokenChar = true;
                    }
                    else {
                        rc = XMLCharState.lPiValue;
                    }
                    break;
                case XMLCharState.lPiValue:
                    if (char === '?' && nextChar === '>') {
                        rc = XMLCharState.rPi;
                        this.skipTokenChar = true;
                    }
                    break;
                case XMLCharState.rPi:
                case XMLCharState.rPiNameOnly:
                case XMLCharState.rSelfCt:
                case XMLCharState.rSelfCtNoAtt:
                    if (this.skipTokenChar) {
                        this.skipTokenChar = false;
                    }
                    else {
                        rc = this.testChar(char, nextChar, false);
                    }
                    break;
                case XMLCharState.lComment:
                    if (this.commentCharCount === 0) {
                        // char === '-' we've already processed <!-
                        this.commentCharCount++;
                    }
                    else if (this.commentCharCount === 1) {
                        // if commendCharCount === 1 then we're just in the comment value
                        if (char === '-' && nextChar === '-') {
                            this.commentCharCount++;
                        }
                    }
                    else if (this.commentCharCount === 2) {
                        // we're on the second '-' at comment end
                        this.commentCharCount++;
                    }
                    else if (this.commentCharCount === 3) {
                        // we're expecting the '>' at the comment end
                        if (char === '>') {
                            rc = XMLCharState.rComment;
                        }
                        // stop checking as '--' already encountered without '>'
                        this.commentCharCount = 4;
                    }
                    break;
                case XMLCharState.lExclam:
                    // assume  <![CDATA[
                    if (char === '[' && nextChar === 'C') {
                        this.cdataCharCount = 0;
                        rc = XMLCharState.lCd;
                    }
                    else if (char === '-' && nextChar === '-') {
                        rc = XMLCharState.lComment;
                        this.commentCharCount = 0;
                    }
                    else if (char === '>') {
                        this.dtdNesting--;
                        if (this.dtdNesting < 0) {
                            this.dtdNesting = 0;
                            rc = XMLCharState.rDtd;
                        }
                    }
                    else if (char === '<') {
                        this.dtdNesting++;
                    }
                    // TODO: Handle internal DTD subset
                    break;
                case XMLCharState.lCd:
                    switch (this.cdataCharCount) {
                        case 0:
                        // [C  of <![CDATA[ already checked
                        case 2:
                        // DA already checked
                        case 4:
                            // TA already checked
                            this.cdataCharCount++;
                            break;
                        case 1:
                            if (char === 'D' && nextChar === 'A') {
                                this.cdataCharCount++;
                            }
                            else {
                                rc = XMLCharState.init;
                            }
                            break;
                        case 3:
                            if (char === 'T' && nextChar === 'A') {
                                this.cdataCharCount++;
                            }
                            else {
                                rc = XMLCharState.init;
                            }
                            break;
                        case 5:
                            if (char === '[') {
                                this.cdataCharCount = 0;
                                rc = XMLCharState.lCdataEnd;
                            }
                            else {
                                rc = XMLCharState.init;
                            }
                            break;
                    }
                    break;
                case XMLCharState.lCdataEnd:
                case XMLCharState.awaitingRcdata:
                    if (char === ']' && nextChar === ']') {
                        this.cdataCharCount = 0;
                        rc = XMLCharState.rCd;
                    }
                    else if (char === '{') {
                        if (nextChar === '{') {
                            rc = XMLCharState.escTvtCdata;
                        }
                        else {
                            rc = XMLCharState.tvtCdata;
                        }
                    }
                    break;
                // otherwise continue awaiting ]]>
                case XMLCharState.rCd:
                    if (this.cdataCharCount === 0) {
                        this.cdataCharCount++;
                    }
                    else if (char === '>') {
                        this.cdataCharCount = 0;
                        rc = XMLCharState.rCdataEnd;
                    }
                    else {
                        // TODO: ]] not permited on its own in CDATA, show error
                        this.cdataCharCount = 0;
                        rc = XMLCharState.init;
                    }
                    break;
                case XMLCharState.lSt:
                    if (char === '>') {
                        // error for: '<>'
                        rc = XMLCharState.rSt;
                    }
                    else {
                        // TODO: check first char of element name is oK
                        rc = XMLCharState.lEn;
                    }
                    break;
                // element name started
                case XMLCharState.lEn:
                    if (this.isWhitespace(isCurrentCharNewLine, char)) {
                        rc = XMLCharState.lsElementNameWs;
                    }
                    else if (char === '>') {
                        rc = XMLCharState.rStNoAtt;
                    }
                    else if (char === '/' && nextChar === '>') {
                        rc = XMLCharState.rSelfCtNoAtt;
                        this.skipTokenChar = true;
                    }
                    break;
                // whitespace after element name (or after att-value)
                case XMLCharState.lsElementNameWs:
                case XMLCharState.rSq:
                case XMLCharState.rDq:
                case XMLCharState.wsBeforeAttname:
                    if (this.isWhitespace(isCurrentCharNewLine, char)) {
                        if (existing !== XMLCharState.lsElementNameWs) {
                            rc = XMLCharState.wsBeforeAttname;
                        }
                    }
                    else if (char === '>') {
                        rc = XMLCharState.rSt;
                    }
                    else if (char === '/' && nextChar === '>') {
                        rc = XMLCharState.rSelfCt;
                        this.skipTokenChar = true;
                    }
                    else {
                        rc = XMLCharState.lAn;
                    }
                    break;
                // attribute name started
                case XMLCharState.lAn:
                    if (this.isWhitespace(isCurrentCharNewLine, char)) {
                        rc = XMLCharState.wsAfterAttName;
                    }
                    else if (char === '=') {
                        rc = XMLCharState.lStEq;
                    }
                    else {
                        var charState = this.testAttNameChar(char, nextChar);
                        if (charState !== XMLCharState.lText) {
                            rc = charState;
                        }
                    }
                    break;
                // whitespace after attribute name
                case XMLCharState.wsAfterAttName:
                    if (char === '=') {
                        rc = XMLCharState.lStEq;
                    }
                    else if (!this.isWhitespace(isCurrentCharNewLine, char)) {
                        // TODO: force error - guessing intended end of start tag
                        rc = XMLCharState.syntaxError;
                    }
                    break;
                // '=' char after attribute name or
                // whitespace after attname and '=' char
                case XMLCharState.lStEq:
                case XMLCharState.lsEqWs:
                    if (this.isWhitespace(isCurrentCharNewLine, char)) {
                        rc = XMLCharState.lsEqWs;
                    }
                    else if (char === '"') {
                        rc = XMLCharState.lDq;
                    }
                    else if (char === '\'') {
                        rc = XMLCharState.lSq;
                    }
                    else {
                        rc = XMLCharState.syntaxError;
                    }
                    break;
                case XMLCharState.lDq:
                    if (char === '"') {
                        rc = XMLCharState.rDq;
                    }
                    else if (char === '{') {
                        if (nextChar === '{') {
                            rc = XMLCharState.escDqAvt;
                        }
                        else {
                            rc = XMLCharState.dqAvt;
                        }
                    }
                    else if (char === '&') {
                        rc = XMLCharState.lEntity;
                        this.entityContext = EntityPosition.attrDq;
                    }
                    else {
                        var charState = this.testAttValueChar(char, nextChar);
                        if (charState !== XMLCharState.lText) {
                            rc = charState;
                        }
                    }
                    break;
                case XMLCharState.lSq:
                    if (char === '\'') {
                        rc = XMLCharState.rSq;
                    }
                    else if (char === '{') {
                        if (nextChar === '{') {
                            rc = XMLCharState.escSqAvt;
                        }
                        else {
                            rc = XMLCharState.sqAvt;
                        }
                    }
                    else if (char === '&') {
                        rc = XMLCharState.lEntity;
                        this.entityContext = EntityPosition.attrSq;
                    }
                    else {
                        var charState = this.testAttValueChar(char, nextChar);
                        if (charState !== XMLCharState.lText) {
                            rc = charState;
                        }
                    }
                    break;
                case XMLCharState.escDqAvt:
                    rc = XMLCharState.lDq;
                    break;
                case XMLCharState.escSqAvt:
                    rc = XMLCharState.lSq;
                    break;
                case XMLCharState.escTvt:
                    rc = XMLCharState.init;
                    break;
                case XMLCharState.escTvtCdata:
                    rc = XMLCharState.awaitingRcdata;
                    break;
                case XMLCharState.lEntity:
                    if (char === ';') {
                        rc = XMLCharState.rEntity;
                    }
                    else if (this.isWhitespace(isCurrentCharNewLine, char)) {
                        rc = this.testChar(char, nextChar, false);
                    }
                    break;
                case XMLCharState.lText:
                    rc = this.testChar(char, nextChar, true);
                    break;
                default:
                    // awaiting a new node
                    rc = this.testChar(char, nextChar, false);
            }
            return rc;
        };
        XslLexer.prototype.testAttNameChar = function (char, nextChar) {
            var rc;
            switch (char) {
                case '<':
                    switch (nextChar) {
                        case '?':
                            rc = XMLCharState.lPi;
                            break;
                        case '!':
                            rc = XMLCharState.lExclam;
                            break;
                        case '/':
                            rc = XMLCharState.lCt;
                            break;
                        default:
                            rc = XMLCharState.lSt;
                    }
                    break;
                case '{':
                    if (nextChar === '{') {
                        rc = XMLCharState.escTvt;
                    }
                    else {
                        rc = XMLCharState.tvt;
                    }
                    break;
                case '&':
                    // TODO: check next char is not ';'
                    rc = XMLCharState.lEntity;
                    this.entityContext = EntityPosition.text;
                    break;
                case '/':
                case '>':
                    rc = XMLCharState.syntaxError;
                    break;
                default:
                    rc = XMLCharState.lText;
                    break;
            }
            return rc;
        };
        XslLexer.prototype.testAttValueChar = function (char, nextChar) {
            var rc;
            switch (char) {
                case '<':
                    switch (nextChar) {
                        case '?':
                            rc = XMLCharState.lPi;
                            break;
                        case '!':
                            rc = XMLCharState.lExclam;
                            break;
                        case '/':
                            rc = XMLCharState.lCt;
                            break;
                        default:
                            rc = XMLCharState.lSt;
                    }
                    break;
                case '/':
                    rc = nextChar === '>' ? XMLCharState.syntaxError : XMLCharState.lText;
                    break;
                default:
                    rc = XMLCharState.lText;
                    break;
            }
            return rc;
        };
        XslLexer.prototype.testChar = function (char, nextChar, isText) {
            var rc;
            switch (char) {
                case ' ':
                case '\t':
                case '\r':
                    if (isText) {
                        rc = XMLCharState.lText;
                    }
                    else {
                        rc = XMLCharState.lWs;
                    }
                    break;
                case '\n':
                    rc = XMLCharState.lWs;
                    break;
                case '<':
                    switch (nextChar) {
                        case '?':
                            rc = XMLCharState.lPi;
                            break;
                        case '!':
                            rc = XMLCharState.lExclam;
                            break;
                        case '/':
                            rc = XMLCharState.lCt;
                            break;
                        default:
                            rc = XMLCharState.lSt;
                    }
                    break;
                case '{':
                    if (nextChar === '{') {
                        rc = XMLCharState.escTvt;
                    }
                    else {
                        rc = XMLCharState.tvt;
                    }
                    break;
                case '&':
                    // TODO: check next char is not ';'
                    rc = XMLCharState.lEntity;
                    this.entityContext = EntityPosition.text;
                    break;
                default:
                    rc = XMLCharState.lText;
                    break;
            }
            return rc;
        };
        XslLexer.prototype.analyse = function (xsl, keepNameTests) {
            var _a;
            if (this.timerOn) {
                console.time('xslLexer.analyse');
            }
            this.globalInstructionData.length = 0;
            this.globalModeData.length = 0;
            this.lineNumber = 0;
            this.lineCharCount = -1;
            this.charCount = -1;
            if (keepNameTests) {
                this.attributeNameTests = [];
                this.elementNameTests = [];
            }
            else {
                this.attributeNameTests = undefined;
                this.elementNameTests = undefined;
            }
            var currentState = XMLCharState.init;
            var currentChar = '';
            var tokenChars = [];
            var result = [];
            var attName = '';
            var avtExit = false;
            var xpLexer = new xpLexer_1.XPathLexer();
            xpLexer.elementNameTests = this.elementNameTests;
            xpLexer.attributeNameTests = this.attributeNameTests;
            xpLexer.documentText = xsl;
            xpLexer.documentTokens = result;
            xpLexer.debug = this.debug;
            xpLexer.timerOn = this.timerOn;
            var xslLength = xsl.length;
            var storeToken = false;
            var isNativeElement = false;
            var tagGlobalInstructionType = GlobalInstructionType.Unknown;
            var tagInstructionNameAdded = false;
            var tagMatchToken = null;
            var contextGlobalInstructionType = GlobalInstructionType.Unknown;
            var isXPathAttribute = false;
            var isExpandTextAttribute = false;
            var isGlobalInstructionName = false;
            var isGlobalInstructionMode = false;
            var isGlobalParameterName = false;
            var isGlobalUsePackageVersion = false;
            var isGlobalInstructionMatch = false;
            var expandTextValue = false;
            var xmlElementStack = [];
            var tokenStartChar = -1;
            var tokenStartLine = -1;
            var attributeNameTokenAdded = false;
            var collectParamName = false;
            var xpathEnded = false;
            if (this.debug) {
                console.log("xsl:\n" + xsl);
            }
            while (this.charCount < xslLength) {
                this.charCount++;
                this.lineCharCount++;
                var nextState = XMLCharState.init;
                var nextChar = xsl.charAt(this.charCount);
                var isLastChar = this.charCount === xslLength;
                var resultLengthAtLastChar = isLastChar ? result.length : -1;
                if (currentChar) {
                    var isCurrentCharNewLIne = currentChar === '\n';
                    nextState = this.calcNewState(isCurrentCharNewLIne, currentChar, nextChar, currentState);
                    if (nextState === currentState) {
                        if (isCurrentCharNewLIne || isLastChar) {
                            // we must split multi-line tokens:
                            var addToken = null;
                            switch (nextState) {
                                case XMLCharState.lPiValue:
                                    addToken = XSLTokenLevelState.processingInstrValue;
                                    this.addNewTokenToResult(tokenStartChar, addToken, result, nextState);
                                    break;
                                case XMLCharState.lComment:
                                    addToken = XSLTokenLevelState.xmlComment;
                                    tokenStartChar = tokenStartChar === 0 ? tokenStartChar : tokenStartChar - 2;
                                    break;
                                case XMLCharState.lDq:
                                case XMLCharState.lSq:
                                    addToken = XSLTokenLevelState.attributeValue;
                                    break;
                                case XMLCharState.lExclam:
                                    addToken = XSLTokenLevelState.dtd;
                                    break;
                            }
                            if (addToken !== null) {
                                this.addNewTokenToResult(tokenStartChar, addToken, result, nextState);
                                tokenStartChar = 0;
                            }
                            else if (isLastChar) {
                                var alreadyDone = result.length > 0 && result[result.length - 1].startCharacter === tokenStartChar;
                                if (!alreadyDone) {
                                    this.addNewTokenToResult(tokenStartChar, XSLTokenLevelState.xmlText, result, nextState);
                                }
                            }
                        }
                        else if (storeToken) {
                            tokenChars.push(currentChar);
                        }
                    }
                    else {
                        if (currentState === XMLCharState.lText) {
                            if (nextState === XMLCharState.escTvt) {
                                this.addCharTokenToResult(tokenStartChar, this.lineCharCount - tokenStartChar, XSLTokenLevelState.xmlText, result, currentState);
                            }
                            else {
                                this.addCharTokenToResult(tokenStartChar, (this.lineCharCount - 1) - tokenStartChar, XSLTokenLevelState.xmlText, result, currentState);
                            }
                        }
                        else if (currentState === XMLCharState.escTvt) {
                            this.addCharTokenToResult(tokenStartChar, 2, XSLTokenLevelState.xmlText, result, currentState);
                        }
                        if (currentState === XMLCharState.lEntity && nextState !== XMLCharState.rEntity) {
                            // recover from syntax error:
                            this.addNewTokenToResult(tokenStartChar, XSLTokenLevelState.entityRef, result, nextState);
                            switch (this.entityContext) {
                                case EntityPosition.text:
                                    nextState = XMLCharState.init;
                                    break;
                                case EntityPosition.attrSq:
                                    nextState = XMLCharState.lSq;
                                    break;
                                case EntityPosition.attrDq:
                                    nextState = XMLCharState.lDq;
                                    break;
                            }
                        }
                        switch (nextState) {
                            case XMLCharState.lSt:
                                this.addCharTokenToResult(this.lineCharCount - 1, 1, XSLTokenLevelState.xmlPunctuation, result, nextState);
                                break;
                            case XMLCharState.lCtName:
                            case XMLCharState.lEn:
                                expandTextValue = null;
                                if (tokenChars.length < 5) {
                                    tokenChars.push(currentChar);
                                    storeToken = true;
                                }
                                else {
                                    storeToken = false;
                                }
                                break;
                            case XMLCharState.rStNoAtt:
                                expandTextValue = this.addToElementStack(expandTextValue, xmlElementStack);
                            // cascade, so no-break intentional
                            case XMLCharState.lsElementNameWs:
                            case XMLCharState.rSelfCtNoAtt:
                            case XMLCharState.rCt:
                                var isCloseTag = nextState === XMLCharState.rCt;
                                var isRootChildStartTag = !isCloseTag && xmlElementStack.length === 1;
                                var elementProperties = this.getElementProperties(tokenChars, isRootChildStartTag);
                                isNativeElement = elementProperties.isNative;
                                tagGlobalInstructionType = elementProperties.instructionType;
                                tagInstructionNameAdded = false;
                                tagMatchToken = null;
                                collectParamName = false;
                                if (xmlElementStack.length === 1) {
                                    contextGlobalInstructionType = tagGlobalInstructionType;
                                }
                                else if (xmlElementStack.length === 2
                                    && (contextGlobalInstructionType === GlobalInstructionType.Function || contextGlobalInstructionType === GlobalInstructionType.Template)
                                    && isNativeElement && elementProperties.nativeName === 'param') {
                                    collectParamName = true;
                                }
                                if (isCloseTag) {
                                    if (xmlElementStack.length > 0) {
                                        xmlElementStack.pop();
                                    }
                                }
                                storeToken = false;
                                tokenChars = [];
                                var newTokenType = isNativeElement ? XSLTokenLevelState.xslElementName : XSLTokenLevelState.elementName;
                                this.addNewTokenToResult(tokenStartChar, newTokenType, result, nextState);
                                if (nextState !== XMLCharState.lsElementNameWs) {
                                    var punctuationLength = nextState === XMLCharState.rCt || nextState === XMLCharState.rStNoAtt ? 1 : 2;
                                    this.addCharTokenToResult(this.lineCharCount - 1, punctuationLength, XSLTokenLevelState.xmlPunctuation, result, nextState);
                                }
                                break;
                            case XMLCharState.rDtd:
                                this.addCharTokenToResult(tokenStartChar, this.lineCharCount - tokenStartChar, XSLTokenLevelState.dtdEnd, result, currentState);
                                break;
                            case XMLCharState.rPiName:
                                this.addNewTokenToResult(tokenStartChar, XSLTokenLevelState.processingInstrName, result, nextState);
                                break;
                            case XMLCharState.rPi:
                                this.addNewTokenToResult(tokenStartChar, XSLTokenLevelState.processingInstrValue, result, currentState);
                                this.addCharTokenToResult(this.lineCharCount - 1, 2, XSLTokenLevelState.xmlPunctuation, result, nextState);
                                break;
                            case XMLCharState.rPiNameOnly:
                                this.addNewTokenToResult(tokenStartChar, XSLTokenLevelState.processingInstrName, result, currentState);
                                this.addCharTokenToResult(this.lineCharCount - 1, 2, XSLTokenLevelState.xmlPunctuation, result, nextState);
                                break;
                            case XMLCharState.rComment:
                                var startChar = tokenStartChar > 0 ? tokenStartChar - 2 : 0;
                                this.addNewTokenToResult(startChar, XSLTokenLevelState.xmlComment, result, nextState);
                                break;
                            case XMLCharState.wsAfterAttName:
                            case XMLCharState.syntaxError:
                                storeToken = false;
                                this.addNewTokenToResult(tokenStartChar, XSLTokenLevelState.attributeName, result, nextState);
                                attributeNameTokenAdded = true;
                                break;
                            case XMLCharState.lAn:
                                tokenChars.push(currentChar);
                                storeToken = true;
                                attributeNameTokenAdded = false;
                                break;
                            case XMLCharState.lStEq:
                                var isXMLNSattribute = false;
                                isGlobalInstructionName = false;
                                isGlobalInstructionMode = false;
                                isGlobalParameterName = false;
                                isGlobalInstructionMatch = false;
                                isGlobalUsePackageVersion = false;
                                attName = tokenChars.join('');
                                var attributeNameToken = XSLTokenLevelState.attributeName;
                                if (isNativeElement) {
                                    if (attName === 'saxon:options') {
                                        isXPathAttribute = true;
                                    }
                                    else if (this.genericTvtAttributes.indexOf(attName) > -1) {
                                        isXPathAttribute = false;
                                        isExpandTextAttribute = true;
                                    }
                                    else if (attName.startsWith('xmlns')) {
                                        isExpandTextAttribute = false;
                                        isXMLNSattribute = true;
                                        attributeNameToken = XSLTokenLevelState.xmlnsName;
                                    }
                                    else if ((tagGlobalInstructionType === GlobalInstructionType.Include || tagGlobalInstructionType === GlobalInstructionType.Import)
                                        && (attName === 'href' || (this.languageConfiguration.docType === DocumentTypes.DCP && this.languageConfiguration.linkElementAttrNames && attName === ((_a = this.languageConfiguration) === null || _a === void 0 ? void 0 : _a.linkElementAttrNames[1])))) {
                                        isExpandTextAttribute = false;
                                        isGlobalInstructionName = true;
                                    }
                                    else if (tagGlobalInstructionType !== GlobalInstructionType.Unknown && attName === 'name') {
                                        isExpandTextAttribute = false;
                                        isGlobalInstructionName = true;
                                    }
                                    else if (tagGlobalInstructionType === GlobalInstructionType.Template && attName === 'mode' || tagGlobalInstructionType === GlobalInstructionType.Mode && attName === 'name') {
                                        isExpandTextAttribute = false;
                                        isGlobalInstructionMode = true;
                                    }
                                    else if (tagGlobalInstructionType === GlobalInstructionType.Template && attName === 'match') {
                                        isExpandTextAttribute = false;
                                        isGlobalInstructionMatch = true;
                                        isXPathAttribute = true;
                                    }
                                    else if (collectParamName && attName === 'name') {
                                        isGlobalParameterName = true;
                                    }
                                    else if (contextGlobalInstructionType === GlobalInstructionType.UsePackage && attName === 'package-version') {
                                        isExpandTextAttribute = false;
                                        isGlobalUsePackageVersion = true;
                                    }
                                    else {
                                        isExpandTextAttribute = false;
                                        isXPathAttribute = this.isExpressionAtt(attName);
                                    }
                                }
                                else {
                                    if (this.nativeTvtAttributes.indexOf(attName) > -1) {
                                        isExpandTextAttribute = true;
                                    }
                                    else if (attName.startsWith('xmlns')) {
                                        isExpandTextAttribute = false;
                                        isXMLNSattribute = true;
                                        attributeNameToken = XSLTokenLevelState.xmlnsName;
                                    }
                                    else {
                                        isExpandTextAttribute = false;
                                    }
                                }
                                if (!attributeNameTokenAdded) {
                                    this.addNewTokenToResult(tokenStartChar, attributeNameToken, result, nextState);
                                }
                                else if (isXMLNSattribute) {
                                    result[result.length - 1].tokenType = attributeNameToken;
                                }
                                this.addCharTokenToResult(this.lineCharCount - 1, 1, XSLTokenLevelState.attributeEquals, result, nextState);
                                tokenChars = [];
                                storeToken = false;
                                break;
                            case XMLCharState.rSt:
                                if (tagGlobalInstructionType === GlobalInstructionType.Template && !tagInstructionNameAdded && tagMatchToken) {
                                    this.globalInstructionData.push({ type: GlobalInstructionType.TemplateMatch, name: tagMatchToken.value + "#" + this.globalInstructionData.length, token: tagMatchToken, idNumber: 0 });
                                }
                                expandTextValue = this.addToElementStack(expandTextValue, xmlElementStack);
                                this.addCharTokenToResult(this.lineCharCount - 1, 1, XSLTokenLevelState.xmlPunctuation, result, nextState);
                                storeToken = false;
                                tokenChars = [];
                                break;
                            case XMLCharState.lCt:
                            case XMLCharState.lPi:
                                this.addCharTokenToResult(this.lineCharCount - 1, 2, XSLTokenLevelState.xmlPunctuation, result, nextState);
                                break;
                            case XMLCharState.rSelfCt:
                                this.addCharTokenToResult(this.lineCharCount - 1, 2, XSLTokenLevelState.xmlPunctuation, result, nextState);
                                break;
                            case XMLCharState.lCt2:
                                break;
                            case XMLCharState.rSq:
                            case XMLCharState.rDq:
                            case XMLCharState.escDqAvt:
                            case XMLCharState.escSqAvt:
                                if (isExpandTextAttribute) {
                                    var attValue = tokenChars.join('');
                                    expandTextValue = attValue === 'yes' || attValue === 'true' || attValue === '1';
                                }
                                if (xpathEnded) {
                                    tokenStartChar++;
                                    xpathEnded = false;
                                }
                                var newToken = this.addNewTokenToResult(tokenStartChar, XSLTokenLevelState.attributeValue, result, nextState);
                                if (isGlobalInstructionName || isGlobalInstructionMode) {
                                    var attValue = tokenChars.join('');
                                    var newTokenCopy = Object.assign({}, newToken);
                                    var globalType = isGlobalInstructionMode ? GlobalInstructionType.Mode : tagGlobalInstructionType;
                                    var targetGlobal = void 0;
                                    if (isGlobalInstructionMode) {
                                        targetGlobal = this.globalModeData;
                                    }
                                    else {
                                        targetGlobal = this.globalInstructionData;
                                        tagInstructionNameAdded = true;
                                    }
                                    var idNumber = globalType === GlobalInstructionType.Variable ? result.length : 0;
                                    targetGlobal.push({ type: globalType, name: attValue, token: newTokenCopy, idNumber: idNumber });
                                }
                                else if (isGlobalParameterName) {
                                    var attValue = tokenChars.join('');
                                    if (this.globalInstructionData.length > 0) {
                                        var gd = this.globalInstructionData[this.globalInstructionData.length - 1];
                                        if (gd.memberNames) {
                                            if (gd.memberNames.indexOf(attValue) > -1) {
                                                newToken['error'] = xpLexer_1.ErrorType.DuplicateParameterName;
                                                newToken.value = attValue;
                                            }
                                            gd.memberNames.push(attValue);
                                        }
                                        else {
                                            gd['memberNames'] = [attValue];
                                        }
                                        gd.idNumber++;
                                    }
                                }
                                else if (isGlobalUsePackageVersion) {
                                    var attValue = tokenChars.join('');
                                    if (this.globalInstructionData.length > 0) {
                                        var gd = this.globalInstructionData[this.globalInstructionData.length - 1];
                                        gd['version'] = attValue;
                                    }
                                }
                                else if (isGlobalInstructionMatch) {
                                    var attValue = tokenChars.join('');
                                    tagMatchToken = newToken;
                                    tagMatchToken.value = attValue;
                                }
                                tokenChars = [];
                                storeToken = false;
                                break;
                            case XMLCharState.lSq:
                            case XMLCharState.lDq:
                                if (contextGlobalInstructionType === GlobalInstructionType.Function || contextGlobalInstructionType === GlobalInstructionType.Template || contextGlobalInstructionType === GlobalInstructionType.UsePackage) {
                                    storeToken = true;
                                }
                                if (isExpandTextAttribute || isGlobalInstructionName || isGlobalInstructionMode) {
                                    storeToken = true;
                                }
                                else if (isXPathAttribute) {
                                    this.addCharTokenToResult(this.lineCharCount - 1, 1, XSLTokenLevelState.attributeValue, result, nextState);
                                    var p = { line: this.lineNumber, startCharacter: this.lineCharCount, documentOffset: this.charCount };
                                    var exit_1 = void 0;
                                    if (nextState === XMLCharState.lSq) {
                                        exit_1 = xpLexer_1.ExitCondition.SingleQuote;
                                    }
                                    else {
                                        exit_1 = xpLexer_1.ExitCondition.DoubleQuote;
                                    }
                                    xpLexer.analyse('', exit_1, p);
                                    this.updateNames(result);
                                    // need to process right double-quote/single-quote
                                    this.lineNumber = p.line;
                                    var newCharCount = p.documentOffset - 1;
                                    if (newCharCount > this.charCount) {
                                        this.charCount = newCharCount;
                                    }
                                    xpathEnded = true;
                                    this.lineCharCount = p.startCharacter;
                                    nextChar = xsl.charAt(this.charCount);
                                    isXPathAttribute = false;
                                }
                                break;
                            case XMLCharState.sqAvt:
                            case XMLCharState.dqAvt:
                                var exit = void 0;
                                if (isNativeElement) {
                                    if (this.docType === DocumentTypes.DCP) {
                                        exit = xpLexer_1.ExitCondition.CurlyBrace;
                                    }
                                    else if (exit = attName.startsWith('_')) {
                                        exit = xpLexer_1.ExitCondition.CurlyBrace;
                                    }
                                    else {
                                        exit = this.isAvtAtt(attName) ? xpLexer_1.ExitCondition.CurlyBrace : xpLexer_1.ExitCondition.None;
                                    }
                                }
                                else if (this.nonNativeAvts) {
                                    exit = xpLexer_1.ExitCondition.CurlyBrace;
                                }
                                else {
                                    exit = xpLexer_1.ExitCondition.None;
                                }
                                if (exit !== xpLexer_1.ExitCondition.None) {
                                    this.addNewTokenToResult(tokenStartChar, XSLTokenLevelState.attributeValue, result, nextState);
                                    var p = { line: this.lineNumber, startCharacter: this.lineCharCount, documentOffset: this.charCount };
                                    xpLexer.analyse('', exit, p);
                                    this.updateNames(result);
                                    // need to process right double-quote
                                    this.lineNumber = p.line;
                                    var newCharCount = p.documentOffset - 1;
                                    if (newCharCount > this.charCount) {
                                        this.charCount = newCharCount;
                                    }
                                    // fix issue with last char of xpath
                                    this.lineCharCount = p.startCharacter;
                                    nextChar = xsl.charAt(this.charCount);
                                    avtExit = true;
                                }
                                nextState = nextState === XMLCharState.sqAvt ? XMLCharState.lSq : XMLCharState.lDq;
                                break;
                            case XMLCharState.tvt:
                                this.addCharTokenToResult(this.lineCharCount - 1, 1, XSLTokenLevelState.xmlText, result, currentState);
                            case XMLCharState.tvtCdata:
                                var useTvt = xmlElementStack.length > 0 &&
                                    xmlElementStack[xmlElementStack.length - 1].expandText;
                                if (useTvt) {
                                    var p = { line: this.lineNumber, startCharacter: this.lineCharCount, documentOffset: this.charCount };
                                    xpLexer.analyse('', xpLexer_1.ExitCondition.CurlyBrace, p);
                                    this.updateNames(result);
                                    // need to process right double-quote
                                    this.lineNumber = p.line;
                                    var newCharCount = p.documentOffset - 1;
                                    if (newCharCount > this.charCount) {
                                        this.charCount = newCharCount;
                                    }
                                    this.lineCharCount = p.startCharacter;
                                    nextChar = xsl.charAt(this.charCount);
                                    if (nextState === XMLCharState.tvtCdata) {
                                        nextState = XMLCharState.awaitingRcdata;
                                    }
                                    else {
                                        nextState = XMLCharState.init;
                                    }
                                }
                                else if (nextState === XMLCharState.tvtCdata) {
                                    nextState = XMLCharState.awaitingRcdata;
                                }
                                break;
                            case XMLCharState.lEntity:
                                if (this.entityContext !== EntityPosition.text) {
                                    this.addCharTokenToResult(tokenStartChar, (this.lineCharCount - 1) - tokenStartChar, XSLTokenLevelState.attributeValue, result, nextState);
                                }
                                break;
                            case XMLCharState.rEntity:
                                this.addCharTokenToResult(tokenStartChar, this.lineCharCount - tokenStartChar, XSLTokenLevelState.entityRef, result, nextState);
                                switch (this.entityContext) {
                                    case EntityPosition.text:
                                        nextState = XMLCharState.init;
                                        break;
                                    case EntityPosition.attrSq:
                                        nextState = XMLCharState.lSq;
                                        avtExit = true;
                                        break;
                                    case EntityPosition.attrDq:
                                        nextState = XMLCharState.lDq;
                                        avtExit = true;
                                        break;
                                }
                                break;
                            case XMLCharState.lCdataEnd:
                                this.addCharTokenToResult(tokenStartChar - 2, 9, XSLTokenLevelState.xmlPunctuation, result, nextState);
                                break;
                            case XMLCharState.rCdataEnd:
                                this.addCharTokenToResult(tokenStartChar, 3, XSLTokenLevelState.xmlPunctuation, result, nextState);
                                break;
                        }
                        tokenStartChar = this.lineCharCount > 0 ? this.lineCharCount - 1 : 0;
                        if (avtExit) {
                            avtExit = false;
                            tokenStartChar++;
                        }
                        tokenStartLine = this.lineNumber;
                    } // else ends
                    if (isCurrentCharNewLIne) {
                        tokenStartChar = 0;
                        tokenStartLine = 0;
                        this.lineNumber++;
                        this.lineCharCount = 0;
                    }
                    currentState = nextState;
                }
                currentChar = nextChar;
                if (isLastChar && resultLengthAtLastChar === result.length && !(nextState === XMLCharState.lWs || nextState === XMLCharState.lsEqWs)) {
                    var alreadyDone = result.length > 0 && result[result.length - 1].startCharacter === tokenStartChar;
                    if (!alreadyDone) {
                        this.addCharTokenToResult(tokenStartChar, this.lineCharCount - tokenStartChar, XSLTokenLevelState.xmlText, result, currentState);
                    }
                }
            }
            if (this.timerOn) {
                console.timeEnd('xslLexer.analyse');
            }
            this.globalInstructionData = this.globalInstructionData.concat(this.globalModeData);
            return result;
        };
        XslLexer.prototype.updateNames = function (result) {
            if (this.elementNameTests && this.attributeNameTests && result.length > 0) {
                var prevToken = result[result.length - 1];
                if (prevToken.tokenType === xpLexer_1.TokenLevelState.nodeNameTest) {
                    if (this.elementNameTests.indexOf(prevToken.value) < 0) {
                        this.elementNameTests.push(prevToken.value);
                    }
                }
                else if (prevToken.tokenType === xpLexer_1.TokenLevelState.attributeNameTest) {
                    if (this.attributeNameTests.indexOf(prevToken.value) < 0) {
                        this.attributeNameTests.push(prevToken.value);
                    }
                }
            }
        };
        XslLexer.prototype.addNewTokenToResult = function (tokenStartChar, newTokenType, result, charLevelState) {
            var tokenLength = (this.lineCharCount - 1) - tokenStartChar;
            var localTokenStartChar = tokenStartChar;
            if (newTokenType === XSLTokenLevelState.xmlComment || newTokenType === XSLTokenLevelState.attributeValue) {
                tokenLength++;
            }
            var tkn = {
                line: this.lineNumber,
                length: tokenLength,
                startCharacter: localTokenStartChar,
                value: '',
                tokenType: newTokenType + XslLexer.xpathLegendLength
            };
            if (this.provideCharLevelState) {
                tkn['charType'] = charLevelState;
            }
            result.push(tkn);
            return tkn;
        };
        XslLexer.prototype.addCharTokenToResult = function (tokenStartChar, tokenLength, newTokenType, result, charLevelState) {
            var tkn = {
                line: this.lineNumber,
                length: tokenLength,
                startCharacter: tokenStartChar,
                value: '',
                tokenType: newTokenType + XslLexer.xpathLegendLength
            };
            if (this.provideCharLevelState) {
                tkn['charType'] = charLevelState;
            }
            result.push(tkn);
        };
        XslLexer.prototype.addToElementStack = function (expandTextValue, xmlElementStack) {
            if (expandTextValue === null) {
                if (xmlElementStack.length > 0) {
                    expandTextValue = xmlElementStack[xmlElementStack.length - 1].expandText;
                }
                else {
                    expandTextValue = false;
                }
            }
            xmlElementStack.push({ "expandText": expandTextValue });
            return expandTextValue;
        };
        XslLexer.prototype.getElementProperties = function (tokenChars, isRootChild) {
            var elementName = tokenChars.join('');
            var isNative = (this.nativePrefixLength === 0 && elementName.indexOf(':') === -1) || (tokenChars.length > this.nativePrefixLength && elementName.startsWith(this.languageConfiguration.nativePrefix + ':'));
            var instructionType = GlobalInstructionType.Unknown;
            var nativeName = '';
            if (this.languageConfiguration.docType === DocumentTypes.DCP) {
                if (this.languageConfiguration.variableElementNames && this.languageConfiguration.variableElementNames.indexOf(elementName) !== -1) {
                    instructionType = GlobalInstructionType.Variable;
                }
                if (instructionType === GlobalInstructionType.Unknown && this.languageConfiguration.linkElementAttrNames && this.languageConfiguration.linkElementAttrNames[0] === elementName) {
                    instructionType = GlobalInstructionType.Import;
                }
            }
            else if (isNative) {
                nativeName = elementName.substring(this.nativePrefixLength);
                if (isRootChild) {
                    switch (nativeName) {
                        case 'variable':
                            instructionType = GlobalInstructionType.Variable;
                            break;
                        case 'param':
                            instructionType = GlobalInstructionType.Parameter;
                            break;
                        case 'function':
                            instructionType = GlobalInstructionType.Function;
                            break;
                        case 'template':
                            instructionType = GlobalInstructionType.Template;
                            break;
                        case 'key':
                            instructionType = GlobalInstructionType.Key;
                            break;
                        case 'import':
                            instructionType = GlobalInstructionType.Import;
                            break;
                        case 'include':
                            instructionType = GlobalInstructionType.Include;
                            break;
                        case 'accumulator':
                            instructionType = GlobalInstructionType.Accumulator;
                            break;
                        case 'mode':
                            instructionType = GlobalInstructionType.Mode;
                            break;
                        case 'attribute-set':
                            instructionType = GlobalInstructionType.AttributeSet;
                            break;
                        case 'use-package':
                            instructionType = GlobalInstructionType.UsePackage;
                            break;
                    }
                }
            }
            return { isNative: isNative, instructionType: instructionType, nativeName: nativeName };
        };
        XslLexer.xpathLegend = xpLexer_1.XPathLexer.getTextmateTypeLegend();
        XslLexer.xpathLegendLength = XslLexer.xpathLegend.length;
        return XslLexer;
    }());
    exports.XslLexer = XslLexer;
    var GlobalInstructionType;
    (function (GlobalInstructionType) {
        GlobalInstructionType[GlobalInstructionType["Variable"] = 0] = "Variable";
        GlobalInstructionType[GlobalInstructionType["Parameter"] = 1] = "Parameter";
        GlobalInstructionType[GlobalInstructionType["Function"] = 2] = "Function";
        GlobalInstructionType[GlobalInstructionType["Mode"] = 3] = "Mode";
        GlobalInstructionType[GlobalInstructionType["Accumulator"] = 4] = "Accumulator";
        GlobalInstructionType[GlobalInstructionType["AttributeSet"] = 5] = "AttributeSet";
        GlobalInstructionType[GlobalInstructionType["Key"] = 6] = "Key";
        GlobalInstructionType[GlobalInstructionType["Template"] = 7] = "Template";
        GlobalInstructionType[GlobalInstructionType["TemplateMatch"] = 8] = "TemplateMatch";
        GlobalInstructionType[GlobalInstructionType["Include"] = 9] = "Include";
        GlobalInstructionType[GlobalInstructionType["Import"] = 10] = "Import";
        GlobalInstructionType[GlobalInstructionType["UsePackage"] = 11] = "UsePackage";
        GlobalInstructionType[GlobalInstructionType["RootXMLNS"] = 12] = "RootXMLNS";
        GlobalInstructionType[GlobalInstructionType["Unknown"] = 13] = "Unknown";
    })(GlobalInstructionType = exports.GlobalInstructionType || (exports.GlobalInstructionType = {}));
});
//# sourceMappingURL=xslLexer.js.map