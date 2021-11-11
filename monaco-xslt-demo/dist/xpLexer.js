/**
 *  Copyright (c) 2020 DeltaXML Ltd. and others.
 *  All rights reserved. This program and the accompanying materials
 *  are made available under the terms of the MIT license
 *  which accompanies this distribution.
 *
 *  Contributors:
 *  DeltaXML Ltd. - XPath/XSLT Lexer/Syntax Highlighter
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Utilities = exports.ErrorType = exports.XPathLexer = exports.Data = exports.ModifierState = exports.ExitCondition = exports.TokenLevelState = exports.CharLevelState = void 0;
    var CharLevelState;
    (function (CharLevelState) {
        CharLevelState[CharLevelState["init"] = 0] = "init";
        CharLevelState[CharLevelState["lB"] = 1] = "lB";
        CharLevelState[CharLevelState["rB"] = 2] = "rB";
        CharLevelState[CharLevelState["lC"] = 3] = "lC";
        CharLevelState[CharLevelState["rC"] = 4] = "rC";
        CharLevelState[CharLevelState["lSq"] = 5] = "lSq";
        CharLevelState[CharLevelState["rSq"] = 6] = "rSq";
        CharLevelState[CharLevelState["lDq"] = 7] = "lDq";
        CharLevelState[CharLevelState["rDq"] = 8] = "rDq";
        CharLevelState[CharLevelState["lBr"] = 9] = "lBr";
        CharLevelState[CharLevelState["rBr"] = 10] = "rBr";
        CharLevelState[CharLevelState["lPr"] = 11] = "lPr";
        CharLevelState[CharLevelState["rPr"] = 12] = "rPr";
        CharLevelState[CharLevelState["lWs"] = 13] = "lWs";
        CharLevelState[CharLevelState["escSq"] = 14] = "escSq";
        CharLevelState[CharLevelState["escDq"] = 15] = "escDq";
        CharLevelState[CharLevelState["sep"] = 16] = "sep";
        CharLevelState[CharLevelState["lUri"] = 17] = "lUri";
        CharLevelState[CharLevelState["rUri"] = 18] = "rUri";
        CharLevelState[CharLevelState["lNl"] = 19] = "lNl";
        CharLevelState[CharLevelState["rNl"] = 20] = "rNl";
        CharLevelState[CharLevelState["dSep"] = 21] = "dSep";
        CharLevelState[CharLevelState["lVar"] = 22] = "lVar";
        CharLevelState[CharLevelState["exp"] = 23] = "exp";
        CharLevelState[CharLevelState["lName"] = 24] = "lName";
        CharLevelState[CharLevelState["lAttr"] = 25] = "lAttr";
        CharLevelState[CharLevelState["dSep2"] = 26] = "dSep2";
        CharLevelState[CharLevelState["lEnt"] = 27] = "lEnt";
        CharLevelState[CharLevelState["rEnt"] = 28] = "rEnt";
        CharLevelState[CharLevelState["lSqEnt"] = 29] = "lSqEnt";
        CharLevelState[CharLevelState["rSqEnt"] = 30] = "rSqEnt";
        CharLevelState[CharLevelState["lDqEnt"] = 31] = "lDqEnt";
        CharLevelState[CharLevelState["rDqEnt"] = 32] = "rDqEnt";
        CharLevelState[CharLevelState["lLiteralSqEnt"] = 33] = "lLiteralSqEnt";
        CharLevelState[CharLevelState["rLiteralSqEnt"] = 34] = "rLiteralSqEnt";
        CharLevelState[CharLevelState["lLiteralDqEnt"] = 35] = "lLiteralDqEnt";
        CharLevelState[CharLevelState["rLiteralDqEnt"] = 36] = "rLiteralDqEnt";
        CharLevelState[CharLevelState["dot"] = 37] = "dot";
    })(CharLevelState = exports.CharLevelState || (exports.CharLevelState = {}));
    /*
        Enum for Token Types.
        Note that these names correspond either directly
        to Semantic Token types or they are mapped to
        Semantic Tokens types via semanticTokenStyleDefaults
        property in package.json
    */
    var TokenLevelState;
    (function (TokenLevelState) {
        TokenLevelState[TokenLevelState["attributeNameTest"] = 0] = "attributeNameTest";
        TokenLevelState[TokenLevelState["comment"] = 1] = "comment";
        TokenLevelState[TokenLevelState["number"] = 2] = "number";
        TokenLevelState[TokenLevelState["Unset"] = 3] = "Unset";
        TokenLevelState[TokenLevelState["operator"] = 4] = "operator";
        TokenLevelState[TokenLevelState["variable"] = 5] = "variable";
        TokenLevelState[TokenLevelState["Whitespace"] = 6] = "Whitespace";
        TokenLevelState[TokenLevelState["string"] = 7] = "string";
        TokenLevelState[TokenLevelState["uriLiteral"] = 8] = "uriLiteral";
        TokenLevelState[TokenLevelState["nodeType"] = 9] = "nodeType";
        TokenLevelState[TokenLevelState["simpleType"] = 10] = "simpleType";
        TokenLevelState[TokenLevelState["axisName"] = 11] = "axisName";
        TokenLevelState[TokenLevelState["nodeNameTest"] = 12] = "nodeNameTest";
        TokenLevelState[TokenLevelState["functionNameTest"] = 13] = "functionNameTest";
        TokenLevelState[TokenLevelState["complexExpression"] = 14] = "complexExpression";
        TokenLevelState[TokenLevelState["function"] = 15] = "function";
        TokenLevelState[TokenLevelState["entityRef"] = 16] = "entityRef";
        TokenLevelState[TokenLevelState["anonymousFunction"] = 17] = "anonymousFunction";
        TokenLevelState[TokenLevelState["mapKey"] = 18] = "mapKey";
    })(TokenLevelState = exports.TokenLevelState || (exports.TokenLevelState = {}));
    var ExitCondition;
    (function (ExitCondition) {
        ExitCondition[ExitCondition["None"] = 0] = "None";
        ExitCondition[ExitCondition["SingleQuote"] = 1] = "SingleQuote";
        ExitCondition[ExitCondition["DoubleQuote"] = 2] = "DoubleQuote";
        ExitCondition[ExitCondition["CurlyBrace"] = 3] = "CurlyBrace";
    })(ExitCondition = exports.ExitCondition || (exports.ExitCondition = {}));
    var ModifierState;
    (function (ModifierState) {
        ModifierState[ModifierState["UnusedVar"] = 0] = "UnusedVar";
        ModifierState[ModifierState["UnresolvedRef"] = 1] = "UnresolvedRef";
    })(ModifierState = exports.ModifierState || (exports.ModifierState = {}));
    var Data = /** @class */ (function () {
        function Data() {
        }
        Data.setAsOperatorIfKeyword = function (token) {
            if (token.value === 'return' || token.value === 'satisfies' || token.value === 'in' ||
                Data.nonFunctionConditional.indexOf(token.value) > -1) {
                token.tokenType = TokenLevelState.complexExpression;
            }
            else if (Data.keywords.indexOf(token.value) > -1) {
                token.tokenType = TokenLevelState.operator;
            }
            else {
                // token['error'] = ErrorType.XPathKeyword;
            }
        };
        Data.isPart2andMatchesPart1 = function (part1Token, part2Token) {
            var p1 = part1Token.value;
            var p2 = part2Token.value;
            var isPart2;
            var matchesPart1;
            switch (p2) {
                case "else":
                    isPart2 = true;
                    matchesPart1 = p1 === 'then';
                    break;
                case ",":
                    matchesPart1 = p1 === 'in' || p1 === ':=';
                    // 'then' added here as it must not appear in an if expr:
                    isPart2 = p1 === 'then', p1 === 'in' || p1 === ':=';
                    break;
                default:
                    isPart2 = false;
                    matchesPart1 = false;
                    break;
            }
            return [isPart2, matchesPart1];
        };
        Data.separators = ['!', '*', '+', ',', '-', '.', '/', ':', '<', '=', '>', '?', '|', '%'];
        Data.doubleSeps = ['!=', '*:', '..', '//', '::', ':=', '<<', '<=', '=>', '>=', '>>', '||'];
        Data.anySeps = ['=', ':', '.', '/', '=', '<', '>', '|', '!', '*', '+', ',', '-', '.', '?', '['];
        Data.triggerWords = ["and", "array", "as", "div",
            "else", "eq", "except",
            "ge", "gt", "idiv", "if", "in", "intersect", "is", "le",
            "lt", "mod", "ne", "of", "or", "otherwise", "return", "satisfies",
            "then", "to", "union", "&lt;", "&gt;"];
        Data.axes = ["ancestor", "ancestor-or-self", "attribute", "child", "descendant", "descendant-or-self",
            "following", "following-sibling", "namespace", "parent", "preceding", "preceding-sibling", "self"];
        Data.cAxes = ["ancestor", "ancestor-or-self", "descendant", "descendant-or-self",
            "following", "following-sibling", "parent", "preceding", "preceding-sibling", "self"];
        Data.nodeTypes = ["attribute",
            "comment", "document-node", "element", "empty-sequence", "item", "namespace-node", "node",
            "processing-instruction",
            "schema-attribute", "schema-element", "text"];
        Data.nodeTypesBrackets = Data.nodeTypes.map(function (t) { return t + '()'; });
        Data.cNodeTypes = ["attribute", "comment", "element", "item", "namespace-node", "node",
            "processing-instruction", "text"];
        // note: 'otherwise' is a Saxon extension operator:
        Data.keywords = ["and", "array", "as", "div",
            "else", "eq", "except",
            "function", "ge", "gt", "idiv", "if", "in", "intersect", "is", "le",
            "lt", "map", "mod", "ne", "of", "or", "otherwise", "return", "satisfies",
            "then", "to", "treat", "union", "&lt;", "&gt;"];
        // note: 'member' is a proposed Saxon extension: for member $a in array-expression:
        Data.rangeVars = ["every", "for", "let", "member", "some", "return"];
        Data.firstParts = ["cast", "castable", "instance", "treat"];
        Data.secondParts = ["as", "of"];
        Data.nonFunctionConditional = ["if", "then", "else"];
        Data.nonFunctionTypes = ["map", "array", "function"];
        Data.nonFunctionTypesBrackets = Data.nonFunctionTypes.map(function (t) { return t + '(*)'; });
        return Data;
    }());
    exports.Data = Data;
    var XPathLexer = /** @class */ (function () {
        function XPathLexer() {
            this.debug = false;
            this.timerOn = false;
            this.entityRefOn = true;
            this.documentText = '';
            this.documentTokens = [];
            this.latestRealToken = null;
            this.lineNumber = 0;
            this.wsCharNumber = 0;
            this.tokenCharNumber = 0;
            this.wsNewLine = false;
            this.deferWsNewLine = false;
        }
        XPathLexer.prototype.reset = function () {
            this.documentText = '';
            this.documentTokens = [];
            this.attributeNameTests = undefined;
            this.elementNameTests = undefined;
            this.latestRealToken = null;
            this.lineNumber = 0;
            this.wsCharNumber = 0;
            this.tokenCharNumber = 0;
            this.wsNewLine = false;
            this.deferWsNewLine = false;
        };
        XPathLexer.getTextmateTypeLegend = function () {
            var textmateTypes = [];
            var keyCount = Object.keys(TokenLevelState).length / 2;
            for (var i = 0; i < keyCount; i++) {
                textmateTypes.push(TokenLevelState[i]);
            }
            return textmateTypes;
        };
        XPathLexer.isPartOperator = function (firstPart, secondPart) {
            var result = false;
            switch (firstPart) {
                case "cast":
                case "castable":
                case "treat":
                    result = secondPart === "as";
                    break;
                case "instance":
                    result = secondPart === "of";
                    break;
            }
            return result;
        };
        XPathLexer.prototype.calcNewState = function (isFirstChar, nesting, char, nextChar, existing) {
            var _a, _b, _c, _d;
            var rv;
            var firstCharOfToken = true;
            switch (existing) {
                case CharLevelState.lNl:
                    var charCode = char.charCodeAt(0);
                    var nextCharCode = (nextChar) ? nextChar.charCodeAt(0) : -1;
                    if (XPathLexer.isDigit(charCode) || char === '.') {
                        rv = existing;
                    }
                    else if (char === 'e' || char === 'E') {
                        if (nextChar === '-' || nextChar === '+' || XPathLexer.isDigit(nextCharCode)) {
                            rv = CharLevelState.exp;
                        }
                        else {
                            rv = existing;
                        }
                    }
                    else {
                        (_a = this.testChar(existing, firstCharOfToken, char, nextChar, nesting), rv = _a.rv, nesting = _a.nesting);
                    }
                    break;
                case CharLevelState.exp:
                    rv = CharLevelState.lNl;
                    break;
                case CharLevelState.rDqEnt:
                    rv = existing;
                    switch (nesting) {
                        case 0:
                        case 2:
                            nesting++;
                            break;
                        case 1:
                            if (char === 'u' && nextChar === 'o') {
                                nesting++;
                            }
                            else {
                                nesting = 0;
                                rv = CharLevelState.lDqEnt;
                            }
                            break;
                        case 3:
                            if (char === 't') {
                                nesting++;
                            }
                            else {
                                rv = CharLevelState.lDqEnt;
                                nesting = 0;
                            }
                            break;
                        case 4:
                            if (char === ';') {
                                rv = CharLevelState.rDq;
                            }
                            else {
                                rv = CharLevelState.lDqEnt;
                            }
                            nesting = 0;
                            break;
                    }
                    break;
                case CharLevelState.rSqEnt:
                    rv = existing;
                    switch (nesting) {
                        case 0:
                        case 2:
                            nesting++;
                            break;
                        case 1:
                            if (char === 'p' && nextChar === 'o') {
                                nesting++;
                            }
                            else {
                                nesting = 0;
                                rv = CharLevelState.lSqEnt;
                            }
                            break;
                        case 3:
                            if (char === 's') {
                                nesting++;
                            }
                            else {
                                rv = CharLevelState.lSqEnt;
                                nesting = 0;
                            }
                            break;
                        case 4:
                            if (char === ';') {
                                rv = CharLevelState.rSq;
                            }
                            else {
                                rv = CharLevelState.lSqEnt;
                            }
                            nesting = 0;
                            break;
                    }
                    break;
                case CharLevelState.lWs:
                    if (char === ' ' || char === '\t') {
                        rv = existing;
                        this.wsCharNumber++;
                    }
                    else if (char === '\n') {
                        rv = existing;
                        this.wsCharNumber = 0;
                        this.wsNewLine = true;
                        this.lineNumber++;
                    }
                    else {
                        // we must switch to the new state, depending on the char/nextChar
                        (_b = this.testChar(existing, firstCharOfToken, char, nextChar, nesting), rv = _b.rv, nesting = _b.nesting);
                    }
                    break;
                case CharLevelState.lName:
                case CharLevelState.lVar:
                case CharLevelState.lAttr:
                    if (char === '-' || char === '.' ||
                        (char === ':' && !(nextChar === ':' || nextChar === '*' || nextChar === ' ' || nextChar === '\n' || nextChar === '\r' || nextChar === '\t'))) {
                        rv = existing;
                    }
                    else {
                        // we must switch to the new state, depending on the char/nextChar
                        (_c = this.testChar(existing, isFirstChar, char, nextChar, nesting), rv = _c.rv, nesting = _c.nesting);
                    }
                    break;
                case CharLevelState.dSep:
                    rv = CharLevelState.dSep2;
                    break;
                case CharLevelState.lUri:
                    rv = (char === '}') ? CharLevelState.rUri : existing;
                    break;
                case CharLevelState.lSqEnt:
                    rv = (char === '&' && nextChar === 'a') ? CharLevelState.rSqEnt : existing;
                    break;
                case CharLevelState.lDqEnt:
                    rv = (char === '&' && nextChar === 'q') ? CharLevelState.rDqEnt : existing;
                    break;
                case CharLevelState.lSq:
                case CharLevelState.rLiteralSqEnt:
                    if (char === '\'') {
                        if (nextChar === '\'') {
                            rv = CharLevelState.escSq;
                        }
                        else {
                            rv = CharLevelState.rSq;
                        }
                    }
                    else if (char === '&') {
                        rv = CharLevelState.lLiteralSqEnt;
                    }
                    else {
                        rv = CharLevelState.lSq;
                    }
                    break;
                case CharLevelState.lLiteralSqEnt:
                    if (char === '\'') {
                        if (nextChar === '\'') {
                            rv = CharLevelState.escSq;
                        }
                        else {
                            rv = CharLevelState.rSq;
                        }
                    }
                    else if (char === ';') {
                        rv = CharLevelState.rLiteralSqEnt;
                    }
                    else {
                        rv = existing;
                    }
                    break;
                case CharLevelState.escSq:
                    rv = CharLevelState.lSq;
                    break;
                case CharLevelState.escDq:
                    rv = CharLevelState.lDq;
                    break;
                case CharLevelState.lDq:
                case CharLevelState.rLiteralDqEnt:
                    if (char === '\"') {
                        if (nextChar === '\"') {
                            rv = CharLevelState.escDq;
                        }
                        else {
                            rv = CharLevelState.rDq;
                        }
                    }
                    else if (char === '&') {
                        rv = CharLevelState.lLiteralDqEnt;
                    }
                    else {
                        rv = CharLevelState.lDq;
                    }
                    break;
                case CharLevelState.lLiteralDqEnt:
                    if (char === '"') {
                        if (nextChar === '"') {
                            rv = CharLevelState.escDq;
                        }
                        else {
                            rv = CharLevelState.rDq;
                        }
                    }
                    else if (char === ';') {
                        rv = CharLevelState.rLiteralDqEnt;
                    }
                    else {
                        rv = existing;
                    }
                    break;
                case CharLevelState.lC:
                    if (char === ':' && nextChar === ')') {
                        rv = (nesting === 1) ? CharLevelState.rC : existing;
                        nesting--;
                    }
                    else if (char === '(' && nextChar === ':') {
                        rv = existing;
                        nesting++;
                    }
                    else {
                        rv = existing;
                    }
                    break;
                case CharLevelState.lEnt:
                    rv = (char === ';') ? CharLevelState.rEnt : existing;
                    break;
                default:
                    (_d = this.testChar(existing, isFirstChar, char, nextChar, nesting), rv = _d.rv, nesting = _d.nesting);
            }
            return [rv, nesting];
        };
        XPathLexer.prototype.analyse = function (xpathArg, exitCondition, position) {
            var _a;
            if (this.timerOn) {
                console.time('xplexer.analyse');
            }
            this.latestRealToken = null;
            this.lineNumber = position.line;
            this.wsCharNumber = 0;
            this.tokenCharNumber = position.startCharacter;
            this.wsNewLine = false;
            this.deferWsNewLine = false;
            var xpath = xpathArg.length === 0 ? this.documentText : xpathArg;
            var currentState = [CharLevelState.init, 0];
            var currentChar = '';
            var tokenChars = [];
            if (exitCondition === ExitCondition.None) {
                this.documentTokens.length = 0;
            }
            var result = this.documentTokens;
            var nestedTokenStack = [];
            var poppedContext = null;
            if (xpath.length === 0) {
                return [];
            }
            for (var i = position.documentOffset; i < xpath.length + 1; i++) {
                var nextChar = xpath.charAt(i);
                // deconstruct state:
                var currentLabelState = currentState[0], nestingState = currentState[1];
                var nextState = void 0;
                var isFirstTokenChar = tokenChars.length === 0;
                if (currentChar) {
                    var exitAnalysis = false;
                    switch (exitCondition) {
                        case ExitCondition.None:
                            exitAnalysis = false;
                            break;
                        case ExitCondition.CurlyBrace:
                            if (currentLabelState !== CharLevelState.lDq &&
                                currentLabelState !== CharLevelState.lSq &&
                                currentLabelState !== CharLevelState.lC &&
                                currentChar === "}") {
                                var isNestedOk = false;
                                for (var x = 0; x < nestedTokenStack.length; x++) {
                                    if (nestedTokenStack[x].value === '{') {
                                        isNestedOk = true;
                                        break;
                                    }
                                }
                                exitAnalysis = !isNestedOk;
                            }
                            break;
                        case ExitCondition.DoubleQuote:
                            exitAnalysis = currentChar === "\"";
                            break;
                        case ExitCondition.SingleQuote:
                            exitAnalysis = currentChar === "'";
                            break;
                    }
                    if (exitAnalysis) {
                        this.update(poppedContext, result, tokenChars, currentLabelState);
                        if (result.length > 0) {
                            var lastToken = result[result.length - 1];
                            if (lastToken.tokenType === TokenLevelState.string) {
                                XPathLexer.checkExitStringLiteralEnd(lastToken, result);
                            }
                            else if (lastToken.tokenType === TokenLevelState.entityRef) {
                                if (result.length > 1) {
                                    var nextLastToken = result[result.length - 2];
                                    if (nextLastToken.tokenType === TokenLevelState.string) {
                                        if (!lastToken.value.endsWith('&quot;') && !lastToken.value.startsWith('&apos;')) {
                                            lastToken['error'] = ErrorType.XPathStringLiteral;
                                        }
                                    }
                                }
                            }
                        }
                        position.line = this.lineNumber;
                        position.startCharacter = this.tokenCharNumber;
                        position.documentOffset = i;
                        return result;
                    }
                    nextState = this.calcNewState(isFirstTokenChar, nestingState, currentChar, nextChar, currentLabelState);
                    var nextLabelState = nextState[0];
                    if ((nextLabelState === currentLabelState
                        && !(this.unChangedStateSignificant(currentLabelState)))
                        || (currentLabelState === CharLevelState.exp && nextLabelState == CharLevelState.lNl)) {
                        // do nothing if state has not changed
                        // or we're within a number with an exponent
                        if (currentChar == '\n' && (currentLabelState === CharLevelState.lSq || currentLabelState === CharLevelState.lDq ||
                            currentLabelState === CharLevelState.lC || currentLabelState === CharLevelState.lSqEnt || currentLabelState === CharLevelState.lDqEnt)) {
                            // split multi-line strings or comments - don't include newline char
                            this.update(poppedContext, result, tokenChars, currentLabelState);
                            this.lineNumber++;
                            this.tokenCharNumber = 0;
                        }
                        else {
                            tokenChars.push(currentChar);
                        }
                    }
                    else {
                        // state has changed, so save token and start new token
                        switch (nextLabelState) {
                            case CharLevelState.lNl:
                            case CharLevelState.lVar:
                            case CharLevelState.lName:
                            case CharLevelState.lEnt:
                            case CharLevelState.lLiteralSqEnt:
                            case CharLevelState.lLiteralDqEnt:
                                this.update(poppedContext, result, tokenChars, currentLabelState);
                                tokenChars = [];
                                tokenChars.push(currentChar);
                                break;
                            case CharLevelState.exp:
                            case CharLevelState.rSqEnt:
                            case CharLevelState.rDqEnt:
                                tokenChars.push(currentChar);
                                break;
                            case CharLevelState.dSep:
                                this.update(poppedContext, result, tokenChars, currentLabelState);
                                var bothChars = currentChar + nextChar;
                                this.updateResult(poppedContext, result, new BasicToken(bothChars, nextLabelState));
                                break;
                            case CharLevelState.dSep2:
                                break;
                            case CharLevelState.sep:
                            case CharLevelState.dot:
                                this.update(poppedContext, result, tokenChars, currentLabelState);
                                this.updateResult(poppedContext, result, new BasicToken(currentChar, nextLabelState));
                                break;
                            case CharLevelState.escSq:
                            case CharLevelState.escDq:
                                tokenChars.push(currentChar);
                                break;
                            case CharLevelState.rC:
                                tokenChars.push(':)');
                                this.update(poppedContext, result, tokenChars, currentLabelState);
                                break;
                            case CharLevelState.lB:
                            case CharLevelState.lBr:
                            case CharLevelState.lPr:
                                this.update(poppedContext, result, tokenChars, currentLabelState);
                                var currentToken = void 0;
                                currentToken = new FlattenedToken(currentChar, nextLabelState, this.latestRealToken);
                                this.updateResult(poppedContext, result, currentToken);
                                // add to nesting level
                                nestedTokenStack.push(currentToken);
                                this.latestRealToken = null;
                                break;
                            case CharLevelState.rB:
                            case CharLevelState.rBr:
                            case CharLevelState.rPr:
                                if (currentLabelState !== CharLevelState.rC) {
                                    var prevToken = new BasicToken(tokenChars.join(''), currentLabelState);
                                    this.updateResult(poppedContext, result, prevToken);
                                    var newToken = new BasicToken(currentChar, nextLabelState);
                                    this.updateResult(poppedContext, result, newToken);
                                    if (nestedTokenStack.length > 0) {
                                        // remove from nesting level
                                        if (XPathLexer.closeMatchesOpen(nextLabelState, nestedTokenStack)) {
                                            poppedContext = (_a = nestedTokenStack.pop()) === null || _a === void 0 ? void 0 : _a.context;
                                        }
                                        else {
                                            newToken['error'] = ErrorType.BracketNesting;
                                        }
                                    }
                                    else {
                                        newToken['error'] = ErrorType.BracketNesting;
                                    }
                                    tokenChars = [];
                                }
                                break;
                            case CharLevelState.rEnt:
                                tokenChars.push(currentChar);
                                var ent = tokenChars.join('');
                                if (ent === '&quot;') {
                                    nextState = [CharLevelState.lDqEnt, 0];
                                }
                                else if (ent === '&apos;') {
                                    nextState = [CharLevelState.lSqEnt, 0];
                                }
                                else {
                                    var entToken = new BasicToken(ent, CharLevelState.lName);
                                    this.updateResult(poppedContext, result, entToken);
                                    tokenChars.length = 0;
                                }
                                break;
                            case CharLevelState.rSq:
                            case CharLevelState.rDq:
                            case CharLevelState.rUri:
                            case CharLevelState.rLiteralSqEnt:
                            case CharLevelState.rLiteralDqEnt:
                                tokenChars.push(currentChar);
                                this.update(poppedContext, result, tokenChars, currentLabelState);
                                break;
                            case CharLevelState.lSq:
                            case CharLevelState.lDq:
                            case CharLevelState.lC:
                            case CharLevelState.lWs:
                            case CharLevelState.lUri:
                                if (currentLabelState !== CharLevelState.escSq && currentLabelState !== CharLevelState.escDq) {
                                    this.update(poppedContext, result, tokenChars, currentLabelState);
                                }
                                tokenChars.push(currentChar);
                                break;
                            default:
                                if (currentLabelState === CharLevelState.rC) {
                                    // in this case, don't include ')' as it is part of last token
                                    tokenChars = [];
                                }
                                else if (currentLabelState === CharLevelState.lWs) {
                                    // set whitespace token and then initial with currentChar
                                    this.update(poppedContext, result, tokenChars, currentLabelState);
                                    tokenChars.push(currentChar);
                                }
                                else {
                                    tokenChars.push(currentChar);
                                }
                                break;
                        }
                    }
                    if (!nextChar && tokenChars.length > 0) {
                        this.update(poppedContext, result, tokenChars, nextLabelState);
                    }
                    currentState = nextState;
                } // end if(currentChar)
                currentChar = nextChar;
            } // end iteration over chars
            if (this.timerOn) {
                console.timeEnd('xplexer.analyse');
            }
            return result;
        };
        XPathLexer.checkExitStringLiteralEnd = function (lastToken, result) {
            var followsEntityRef = false;
            if (result.length > 1) {
                var nextLastToken = result[result.length - 2];
                followsEntityRef = nextLastToken.tokenType === TokenLevelState.entityRef;
            }
            if (followsEntityRef) {
                var lastChar_1 = lastToken.value.charAt(lastToken.value.length - 1);
                var lastCharIsSingleQuote = lastChar_1 === "'";
                if (lastChar_1 !== '"' && !lastCharIsSingleQuote && !lastToken.value.endsWith('&quot;') && !lastToken.value.startsWith('&apos;')) {
                    lastToken['error'] = ErrorType.XPathStringLiteral;
                }
                else if (lastChar_1 === '"' || lastChar_1 === "'" && lastToken.length > 1) {
                    var mod2Chars = lastToken.value.split('').filter(function (l) { return l === lastChar_1; }).length % 2;
                    if (mod2Chars === 0) {
                        lastToken['error'] = ErrorType.XPathStringLiteral;
                    }
                }
            }
            else {
                this.checkStringLiteralEnd(lastToken);
            }
        };
        XPathLexer.checkStringLiteralEnd = function (lastToken) {
            var lastChar = lastToken.value.charAt(lastToken.value.length - 1);
            var firstChar = lastToken.value.charAt(0);
            if (!((lastChar === firstChar && lastToken.value.length > 1) || (lastToken.value.length > 6 &&
                (lastToken.value.startsWith('&quot;') && lastToken.value.endsWith('&quot;')) || (lastToken.value.startsWith('&apos;') && lastToken.value.endsWith('&apos;'))))) {
                lastToken['error'] = ErrorType.XPathStringLiteral;
            }
        };
        XPathLexer.closeMatchesOpen = function (close, stack) {
            var open = stack[stack.length - 1].charType;
            var result = false;
            switch (close) {
                case CharLevelState.rB:
                    result = open === CharLevelState.lB;
                    break;
                case CharLevelState.rBr:
                    result = open === CharLevelState.lBr;
                    break;
                case CharLevelState.rPr:
                    result = open === CharLevelState.lPr;
            }
            return result;
        };
        XPathLexer.prototype.update = function (poppedContext, result, tokenChars, charState) {
            if (tokenChars.length > 0) {
                this.updateResult(poppedContext, result, new BasicToken(tokenChars.join(''), charState));
            }
            tokenChars.length = 0;
        };
        XPathLexer.prototype.unChangedStateSignificant = function (charState) {
            var result = false;
            switch (charState) {
                case CharLevelState.lB:
                case CharLevelState.lBr:
                case CharLevelState.lPr:
                case CharLevelState.rB:
                case CharLevelState.rBr:
                case CharLevelState.rPr:
                case CharLevelState.sep:
                case CharLevelState.dot:
                    result = true;
            }
            return result;
        };
        XPathLexer.prototype.updateResult = function (poppedContext, result, newToken) {
            var cachedRealToken = this.latestRealToken;
            var state = newToken.charType;
            var newTokenValue = newToken.value;
            if (newTokenValue !== '') {
                newToken.length = newTokenValue.length;
                newToken.line = this.lineNumber;
                newToken.startCharacter = this.tokenCharNumber;
                if (newToken.tokenType === TokenLevelState.nodeNameTest) {
                    if (newTokenValue.includes('#')) {
                        newToken.tokenType = TokenLevelState.functionNameTest;
                    }
                }
                var isWhitespace = newToken.charType === CharLevelState.lWs;
                if (this.deferWsNewLine) {
                    if (isWhitespace) {
                        this.lineNumber++;
                        newToken.line = this.lineNumber;
                        this.tokenCharNumber = this.wsCharNumber;
                    }
                    else {
                        this.tokenCharNumber = 0;
                        this.lineNumber++;
                        this.wsNewLine = true;
                    }
                    this.deferWsNewLine = false;
                }
                else if (this.wsNewLine) {
                    if (isWhitespace) {
                        this.tokenCharNumber = this.wsCharNumber;
                    }
                    else {
                        this.tokenCharNumber += newTokenValue.length;
                    }
                    this.wsNewLine = false;
                }
                else {
                    this.tokenCharNumber += newTokenValue.length;
                }
                if (!isWhitespace) {
                    this.wsCharNumber = 0;
                }
                if (!isWhitespace) {
                    result.push(newToken);
                }
                var prevToken = this.latestRealToken;
                this.setLabelForLastTokenOnly(prevToken, newToken);
                this.setLabelsUsingCurrentToken(poppedContext, prevToken, newToken);
                if (prevToken && !isWhitespace && this.elementNameTests && this.attributeNameTests) {
                    if (prevToken.tokenType === TokenLevelState.nodeNameTest) {
                        if (this.elementNameTests.indexOf(prevToken.value) < 0) {
                            this.elementNameTests.push(prevToken.value);
                        }
                    }
                    else if (prevToken.tokenType === TokenLevelState.attributeNameTest) {
                        if (this.attributeNameTests.indexOf(prevToken.value) < 0) {
                            this.attributeNameTests.push(prevToken.value);
                        }
                    }
                }
                if (!(state === CharLevelState.lC || state === CharLevelState.lWs)) {
                    this.latestRealToken = newToken;
                }
            }
        };
        XPathLexer.prototype.conditionallyPopStack = function (stack, token) {
            if (stack.length > 0) {
                var _a = Data.isPart2andMatchesPart1(stack[stack.length - 1], token), isPart2 = _a[0], matchesPart1 = _a[1];
                var initStackVal = stack.length > 0 ? stack[stack.length - 1].value : '';
                if ((initStackVal === 'return' || initStackVal === 'satisfies') && token.value === ',') {
                    stack.pop();
                    var validStackValue = null;
                    var init = true;
                    while (stack.length > 0) {
                        if (init) {
                            init = false;
                            var v = stack[stack.length - 1].value;
                            if (v === ':=' || v === 'in') {
                                validStackValue = v;
                                stack.pop();
                            }
                        }
                        else if (stack[stack.length - 1].value === validStackValue) {
                            stack.pop();
                        }
                        else {
                            break;
                        }
                    }
                }
                else if (isPart2) {
                    if (matchesPart1) {
                        stack.pop();
                    }
                    else
                        token['error'] = ErrorType.XPathUnexpected;
                }
            }
        };
        XPathLexer.prototype.updateTokenBeforeBrackets = function (prevToken) {
            if (prevToken.tokenType === TokenLevelState.nodeNameTest) {
                if (Data.nodeTypes.indexOf(prevToken.value) > -1) {
                    prevToken.tokenType = TokenLevelState.nodeType;
                }
                else if (Data.nonFunctionConditional.indexOf(prevToken.value) > -1) {
                    prevToken.tokenType = TokenLevelState.complexExpression;
                }
                else if (prevToken.value === 'function') {
                    prevToken.tokenType = TokenLevelState.anonymousFunction;
                }
                else {
                    prevToken.tokenType = TokenLevelState.function;
                }
            }
            else if (prevToken.tokenType === TokenLevelState.simpleType && (Data.nodeTypes.indexOf(prevToken.value) > -1)) {
                prevToken.tokenType = TokenLevelState.nodeType;
            }
        };
        XPathLexer.prototype.setLabelForLastTokenOnly = function (prevToken, currentToken) {
            var currentState = currentToken.charType;
            if (prevToken) {
                if (prevToken.charType === CharLevelState.lName) {
                    switch (currentState) {
                        case CharLevelState.lVar:
                            if (Data.rangeVars.indexOf(prevToken.value) > -1) {
                                // every, for, let, some
                                prevToken.tokenType = TokenLevelState.complexExpression;
                            }
                            break;
                        case CharLevelState.lB:
                            this.updateTokenBeforeBrackets(prevToken);
                            break;
                        case CharLevelState.dSep:
                            if (currentToken.value === '::') {
                                if (Data.axes.indexOf(prevToken.value) < 0) {
                                    prevToken['error'] = ErrorType.AxisName;
                                }
                                prevToken.tokenType = TokenLevelState.axisName;
                            }
                            else if (currentToken.value === '()') {
                                this.updateTokenBeforeBrackets(prevToken);
                            }
                            else if (currentToken.value === '{}' &&
                                (prevToken.value === 'map' || prevToken.value === 'array')) {
                                prevToken.tokenType = TokenLevelState.operator;
                            }
                            break;
                        case CharLevelState.lBr:
                            if (prevToken.value === 'map' || prevToken.value === 'array') {
                                prevToken.tokenType = TokenLevelState.operator;
                            }
                            break;
                        case CharLevelState.lName:
                            if (currentToken.value === 'member' && prevToken.value === 'for') {
                                prevToken.tokenType = TokenLevelState.complexExpression;
                            }
                            break;
                    }
                }
                else if (currentState === CharLevelState.sep &&
                    prevToken.tokenType === TokenLevelState.string && currentToken.value === ':') {
                    prevToken.tokenType = TokenLevelState.mapKey;
                }
            }
        };
        XPathLexer.prototype.setLabelsUsingCurrentToken = function (poppedContext, prevToken, currentToken) {
            if (!(prevToken)) {
                prevToken = new BasicToken(',', CharLevelState.sep);
                prevToken.tokenType = TokenLevelState.operator;
            }
            var currentValue = currentToken.value;
            switch (currentToken.charType) {
                case CharLevelState.lName:
                    // token is a 'name' that needs resolving:
                    // a Name cannot follow a Name -- unless it's like 'instance of'
                    switch (prevToken.charType) {
                        case CharLevelState.lName:
                            // previous token was lName and current token is lName
                            if (Data.secondParts.indexOf(currentValue) > -1 && XPathLexer.isPartOperator(prevToken.value, currentValue)) {
                                // castable as etc.
                                prevToken.tokenType = TokenLevelState.operator;
                                currentToken.tokenType = TokenLevelState.operator;
                            }
                            else if (XPathLexer.isTokenTypeEqual(prevToken, TokenLevelState.operator)) {
                                // don't set to name because it may be a function etc.
                                //currentToken.tokenType = TokenLevelState.Name;
                                if (prevToken.value === 'as' || prevToken.value === 'of') {
                                    // e.g. castable as xs:integer
                                    // TODO: check if value equals xs:integer or element?
                                    currentToken.tokenType = TokenLevelState.simpleType;
                                }
                                else if (prevToken.value === '&gt;' && currentToken.value === '&gt;') {
                                    currentToken.tokenType = TokenLevelState.operator;
                                }
                                else if (prevToken.value === '&lt;' && (currentToken.value === '&lt;' || currentToken.value === '&gt;')) {
                                    currentToken.tokenType = TokenLevelState.operator;
                                }
                            }
                            else if (prevToken.tokenType === TokenLevelState.nodeNameTest || prevToken.tokenType === TokenLevelState.functionNameTest || XPathLexer.isTokenTypeAType(prevToken)) {
                                Data.setAsOperatorIfKeyword(currentToken);
                            }
                            break;
                        case CharLevelState.rB:
                        case CharLevelState.rBr:
                        case CharLevelState.rPr:
                        case CharLevelState.lAttr:
                        case CharLevelState.lNl:
                        case CharLevelState.lVar:
                        case CharLevelState.lSq:
                        case CharLevelState.lDq:
                        case CharLevelState.rLiteralSqEnt:
                        case CharLevelState.rLiteralDqEnt:
                        case CharLevelState.rDqEnt:
                        case CharLevelState.rSqEnt:
                        case CharLevelState.dot:
                            Data.setAsOperatorIfKeyword(currentToken);
                            break;
                        case CharLevelState.dSep:
                            if (prevToken.value === '()' || prevToken.value === '..' || prevToken.value === '[]' || prevToken.value === '{}') {
                                Data.setAsOperatorIfKeyword(currentToken);
                            }
                            break;
                        default: // current token is an lName but previous token was not
                            if (XPathLexer.isTokenTypeUnset(prevToken)
                                && Data.keywords.indexOf(currentValue) > -1) {
                                currentToken.tokenType = TokenLevelState.operator;
                            }
                            else if (XPathLexer.isCharTypeEqual(prevToken, CharLevelState.dSep)
                                && prevToken.value === '()'
                                && Data.keywords.indexOf(currentValue) > -1) {
                                currentToken.tokenType = TokenLevelState.operator;
                            }
                            else if (XPathLexer.isTokenTypeEqual(prevToken, TokenLevelState.operator) &&
                                (prevToken.value === 'as' || prevToken.value === 'of')) {
                                currentToken.tokenType = TokenLevelState.simpleType;
                            }
                            break;
                    }
                    break;
                case CharLevelState.sep:
                    var prevTokenT = prevToken.tokenType;
                    var isStar = currentToken.value === '*';
                    if (isStar && (prevTokenT === TokenLevelState.attributeNameTest ||
                        prevTokenT === TokenLevelState.uriLiteral ||
                        (prevTokenT === TokenLevelState.operator && prevToken.value === '?') ||
                        prevTokenT === TokenLevelState.nodeType && prevToken.value === '()')) {
                        // @* or {example.com}*
                        currentToken.charType = CharLevelState.lName;
                        currentToken.tokenType = TokenLevelState.nodeType;
                    }
                    else {
                        var possOccurrentIndicator = currentToken.value === '?' || currentToken.value === '+' || isStar;
                        if (possOccurrentIndicator) {
                            if (prevTokenT === TokenLevelState.simpleType && prevToken.length > 1) {
                                // xs:integer? etc
                                currentToken.charType = CharLevelState.lName;
                                currentToken.tokenType = TokenLevelState.simpleType;
                            }
                            else if (prevTokenT === TokenLevelState.operator && (prevToken.value === ')') || prevToken.value === ']') {
                                // ($a) * 9 or count($a) * 8 or abc as map(*)* or $item as node()+
                                if (poppedContext && poppedContext.tokenType === TokenLevelState.simpleType) {
                                    currentToken.charType = CharLevelState.lName;
                                    currentToken.tokenType = TokenLevelState.nodeType;
                                }
                            }
                            else if (isStar && (prevTokenT === TokenLevelState.operator || prevTokenT === TokenLevelState.complexExpression)) {
                                // $a and * or if ($a) then * else book
                                if (prevTokenT === TokenLevelState.operator && prevToken.charType === CharLevelState.dSep && prevToken.value === '()') {
                                    // keep the same
                                }
                                else {
                                    currentToken.charType = CharLevelState.lName;
                                    currentToken.tokenType = TokenLevelState.nodeType;
                                }
                            }
                        }
                    }
                    break;
                case CharLevelState.dSep:
                    if (currentToken.value === ':*' || currentToken.value === '..') {
                        currentToken.charType = CharLevelState.lName;
                        currentToken.tokenType = TokenLevelState.nodeType;
                    }
                    else if (currentToken.value === '()' && prevToken.tokenType === TokenLevelState.nodeType) {
                        currentToken.charType = CharLevelState.lName;
                        currentToken.tokenType = TokenLevelState.nodeType;
                    }
                    break;
            }
        };
        XPathLexer.prototype.testChar = function (existingState, isFirstChar, char, nextChar, nesting) {
            var rv;
            if (isFirstChar && char === 'Q' && nextChar === '{') {
                rv = CharLevelState.lUri;
                return { rv: rv, nesting: nesting };
            }
            switch (char) {
                case '(':
                    if (nextChar === ':') {
                        rv = CharLevelState.lC;
                        nesting++;
                    }
                    else if (nextChar == ')') {
                        rv = CharLevelState.dSep;
                    }
                    else {
                        rv = CharLevelState.lB;
                    }
                    break;
                case '{':
                    if (nextChar === '}') {
                        rv = CharLevelState.dSep;
                    }
                    else {
                        rv = CharLevelState.lBr;
                    }
                    break;
                case '[':
                    if (nextChar === ']') {
                        rv = CharLevelState.dSep;
                    }
                    else {
                        rv = CharLevelState.lPr;
                    }
                    break;
                case ')':
                    rv = CharLevelState.rB;
                    break;
                case ']':
                    rv = CharLevelState.rPr;
                    break;
                case '}':
                    rv = CharLevelState.rBr;
                    break;
                case '\'':
                    rv = CharLevelState.lSq;
                    break;
                case '\"':
                    rv = CharLevelState.lDq;
                    break;
                case ' ':
                case '\t':
                    rv = CharLevelState.lWs;
                    this.wsCharNumber++;
                    break;
                case '\r':
                    rv = CharLevelState.lWs;
                    break;
                case '\n':
                    this.deferWsNewLine = true;
                    rv = CharLevelState.lWs;
                    break;
                case '+':
                case '-':
                    rv = CharLevelState.sep;
                    break;
                case '&':
                    rv = (this.entityRefOn) ? CharLevelState.lEnt : existingState;
                    break;
                default:
                    var doubleChar = char + nextChar;
                    if ((nextChar) && Data.doubleSeps.indexOf(doubleChar) > -1) {
                        rv = CharLevelState.dSep;
                        break;
                    }
                    else if (Data.separators.indexOf(char) > -1) {
                        var isDot = char === '.';
                        if (isDot && !!(nextChar) && XPathLexer.isDigit(nextChar.charCodeAt(0))) {
                            rv = CharLevelState.lNl;
                        }
                        else if (isDot) {
                            rv = CharLevelState.dot;
                        }
                        else {
                            rv = CharLevelState.sep;
                        }
                    }
                    else if (isFirstChar) {
                        var charCode = char.charCodeAt(0);
                        var nextCharCode = (nextChar) ? nextChar.charCodeAt(0) : -1;
                        // check 'dot' char:
                        if (charCode === 46) {
                            if (nextCharCode === 46) {
                                // '..' parent axis
                                rv = CharLevelState.dSep;
                            }
                            else {
                                rv = XPathLexer.isDigit(nextCharCode) ? CharLevelState.lNl : CharLevelState.dot;
                            }
                        }
                        else if (XPathLexer.isDigit(charCode)) {
                            rv = CharLevelState.lNl;
                        }
                        else if (char === '$') {
                            rv = CharLevelState.lVar;
                        }
                        else if (char === '@') {
                            rv = CharLevelState.lAttr;
                        }
                        else {
                            rv = CharLevelState.lName;
                        }
                    }
                    else {
                        rv = existingState;
                    }
            }
            return { rv: rv, nesting: nesting };
        };
        XPathLexer.isDigit = function (charCode) {
            return charCode > 47 && charCode < 58;
        };
        XPathLexer.isCharTypeEqual = function (token, type2) {
            return token ? token.charType === type2 : false;
        };
        XPathLexer.isTokenTypeEqual = function (token, type2) {
            return token.tokenType === type2;
        };
        XPathLexer.isTokenTypeAType = function (token) {
            return token.tokenType === TokenLevelState.simpleType ||
                token.tokenType === TokenLevelState.nodeType;
        };
        XPathLexer.isTokenTypeUnset = function (token) {
            return token.tokenType.valueOf() === TokenLevelState.Unset.valueOf();
        };
        return XPathLexer;
    }());
    exports.XPathLexer = XPathLexer;
    var ErrorType;
    (function (ErrorType) {
        ErrorType[ErrorType["None"] = 0] = "None";
        ErrorType[ErrorType["AxisName"] = 1] = "AxisName";
        ErrorType[ErrorType["UnusedVariable"] = 2] = "UnusedVariable";
        ErrorType[ErrorType["UnresolvedVarReference"] = 3] = "UnresolvedVarReference";
        ErrorType[ErrorType["DuplicateVarName"] = 4] = "DuplicateVarName";
        ErrorType[ErrorType["DuplicateFnName"] = 5] = "DuplicateFnName";
        ErrorType[ErrorType["DuplicateParameterName"] = 6] = "DuplicateParameterName";
        ErrorType[ErrorType["DuplicateTemplateName"] = 7] = "DuplicateTemplateName";
        ErrorType[ErrorType["DuplicateAccumulatorName"] = 8] = "DuplicateAccumulatorName";
        ErrorType[ErrorType["ElementNesting"] = 9] = "ElementNesting";
        ErrorType[ErrorType["ElementNestingX"] = 10] = "ElementNestingX";
        ErrorType[ErrorType["ParentLessText"] = 11] = "ParentLessText";
        ErrorType[ErrorType["ProcessingInstructionName"] = 12] = "ProcessingInstructionName";
        ErrorType[ErrorType["MultiRoot"] = 13] = "MultiRoot";
        ErrorType[ErrorType["XMLName"] = 14] = "XMLName";
        ErrorType[ErrorType["XMLSyntax"] = 15] = "XMLSyntax";
        ErrorType[ErrorType["XSLTName"] = 16] = "XSLTName";
        ErrorType[ErrorType["XSLTInstrUnexpected"] = 17] = "XSLTInstrUnexpected";
        ErrorType[ErrorType["XSLTAttrUnexpected"] = 18] = "XSLTAttrUnexpected";
        ErrorType[ErrorType["XPathTypeName"] = 19] = "XPathTypeName";
        ErrorType[ErrorType["XSLTPrefix"] = 20] = "XSLTPrefix";
        ErrorType[ErrorType["MissingTemplateParam"] = 21] = "MissingTemplateParam";
        ErrorType[ErrorType["IterateParamInvalid"] = 22] = "IterateParamInvalid";
        ErrorType[ErrorType["MissingPrefixInList"] = 23] = "MissingPrefixInList";
        ErrorType[ErrorType["TemplateNameUnresolved"] = 24] = "TemplateNameUnresolved";
        ErrorType[ErrorType["TemplateModeUnresolved"] = 25] = "TemplateModeUnresolved";
        ErrorType[ErrorType["AttributeSetUnresolved"] = 26] = "AttributeSetUnresolved";
        ErrorType[ErrorType["AccumulatorNameUnresolved"] = 27] = "AccumulatorNameUnresolved";
        ErrorType[ErrorType["XMLDeclaration"] = 28] = "XMLDeclaration";
        ErrorType[ErrorType["XPathName"] = 29] = "XPathName";
        ErrorType[ErrorType["EntityName"] = 30] = "EntityName";
        ErrorType[ErrorType["XPathFunction"] = 31] = "XPathFunction";
        ErrorType[ErrorType["XSLTFunctionNamePrefix"] = 32] = "XSLTFunctionNamePrefix";
        ErrorType[ErrorType["XPathEmpty"] = 33] = "XPathEmpty";
        ErrorType[ErrorType["XPathFunctionNamespace"] = 34] = "XPathFunctionNamespace";
        ErrorType[ErrorType["XPathFunctionUnexpected"] = 35] = "XPathFunctionUnexpected";
        ErrorType[ErrorType["XPathOperatorUnexpected"] = 36] = "XPathOperatorUnexpected";
        ErrorType[ErrorType["XPathPrefix"] = 37] = "XPathPrefix";
        ErrorType[ErrorType["XPathKeyword"] = 38] = "XPathKeyword";
        ErrorType[ErrorType["XPathExpectedComplex"] = 39] = "XPathExpectedComplex";
        ErrorType[ErrorType["XMLXMLNS"] = 40] = "XMLXMLNS";
        ErrorType[ErrorType["XMLAttributeName"] = 41] = "XMLAttributeName";
        ErrorType[ErrorType["XSLTNamesapce"] = 42] = "XSLTNamesapce";
        ErrorType[ErrorType["XMLAttributeXMLNS"] = 43] = "XMLAttributeXMLNS";
        ErrorType[ErrorType["XMLAttNameSyntax"] = 44] = "XMLAttNameSyntax";
        ErrorType[ErrorType["XMLAttEqualExpected"] = 45] = "XMLAttEqualExpected";
        ErrorType[ErrorType["XMLDupllicateAtt"] = 46] = "XMLDupllicateAtt";
        ErrorType[ErrorType["XPathUnexpected"] = 47] = "XPathUnexpected";
        ErrorType[ErrorType["XPathAwaiting"] = 48] = "XPathAwaiting";
        ErrorType[ErrorType["XPathStringLiteral"] = 49] = "XPathStringLiteral";
        ErrorType[ErrorType["BracketNesting"] = 50] = "BracketNesting";
        ErrorType[ErrorType["ExpectedElseAfterThen"] = 51] = "ExpectedElseAfterThen";
        ErrorType[ErrorType["ExpectedDollarAfterComma"] = 52] = "ExpectedDollarAfterComma";
        ErrorType[ErrorType["PopNesting"] = 53] = "PopNesting";
        ErrorType[ErrorType["XSLTKeyUnresolved"] = 54] = "XSLTKeyUnresolved";
        ErrorType[ErrorType["XMLRootMissing"] = 55] = "XMLRootMissing";
        ErrorType[ErrorType["DTD"] = 56] = "DTD";
    })(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
    var Utilities = /** @class */ (function () {
        function Utilities() {
        }
        Utilities.minimiseTokens = function (tokens) {
            var r = new Array();
            for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
                var token = tokens_1[_i];
                if (token.charType !== CharLevelState.lWs) {
                    delete token.charType;
                    delete token.context;
                    // delete token.line;
                    // delete token.length;
                    // delete token.startCharacter;
                    r.push(token);
                }
                if (token.children) {
                    token.children = this.minimiseTokens(token.children);
                }
            }
            return r;
        };
        Utilities.minimiseTokens2 = function (tokens) {
            var r = new Array();
            for (var _i = 0, tokens_2 = tokens; _i < tokens_2.length; _i++) {
                var token = tokens_2[_i];
                if (token.charType !== CharLevelState.lWs) {
                    delete token.charType;
                    delete token.context;
                    r.push(token);
                }
                if (token.children) {
                    token.children = this.minimiseTokens2(token.children);
                }
            }
            return r;
        };
        return Utilities;
    }());
    exports.Utilities = Utilities;
    var BasicToken = /** @class */ (function () {
        function BasicToken(value, type) {
            this.line = 0;
            this.startCharacter = 0;
            this.length = 0;
            this.value = value;
            this.charType = type;
            switch (type) {
                case CharLevelState.lWs:
                    this.tokenType = TokenLevelState.Whitespace;
                    break;
                case CharLevelState.lName:
                    this.tokenType = TokenLevelState.nodeNameTest;
                    break;
                case CharLevelState.dSep:
                    this.tokenType = value === ':=' ? TokenLevelState.complexExpression : TokenLevelState.operator;
                    break;
                case CharLevelState.dot:
                    this.tokenType = TokenLevelState.nodeType;
                    break;
                case CharLevelState.sep:
                case CharLevelState.lB:
                case CharLevelState.lBr:
                case CharLevelState.lPr:
                case CharLevelState.rB:
                case CharLevelState.rBr:
                case CharLevelState.rPr:
                    this.tokenType = TokenLevelState.operator;
                    break;
                case CharLevelState.lAttr:
                    this.tokenType = TokenLevelState.attributeNameTest;
                    break;
                case CharLevelState.lNl:
                    this.tokenType = TokenLevelState.number;
                    break;
                case CharLevelState.lVar:
                    this.tokenType = TokenLevelState.variable;
                    break;
                case CharLevelState.lSq:
                case CharLevelState.lDq:
                case CharLevelState.lSqEnt:
                case CharLevelState.lDqEnt:
                case CharLevelState.rDqEnt:
                case CharLevelState.rSqEnt:
                case CharLevelState.rLiteralSqEnt:
                case CharLevelState.rLiteralDqEnt:
                    this.tokenType = TokenLevelState.string;
                    break;
                case CharLevelState.lUri:
                    this.tokenType = TokenLevelState.uriLiteral;
                    break;
                case CharLevelState.lC:
                    this.tokenType = TokenLevelState.comment;
                    break;
                case CharLevelState.lLiteralSqEnt:
                case CharLevelState.lLiteralDqEnt:
                    this.tokenType = TokenLevelState.entityRef;
                    break;
                default:
                    this.tokenType = TokenLevelState.Unset;
                    break;
            }
        }
        return BasicToken;
    }());
    var FlattenedToken = /** @class */ (function () {
        function FlattenedToken(value, type, context) {
            this.line = 0;
            this.startCharacter = 0;
            this.length = 0;
            this.value = value;
            this.charType = type;
            this.tokenType = TokenLevelState.operator;
            this.context = context;
        }
        return FlattenedToken;
    }());
});
//# sourceMappingURL=xpLexer.js.map