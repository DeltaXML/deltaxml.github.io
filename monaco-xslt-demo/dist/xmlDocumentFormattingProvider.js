define(["require", "exports", "vscode", "./xslLexer", "./xpLexer", "./xsltTokenDiagnostics"], function (require, exports, vscode, xslLexer_1, xpLexer_1, xsltTokenDiagnostics_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XMLDocumentFormattingProvider = void 0;
    var HasCharacteristic;
    (function (HasCharacteristic) {
        HasCharacteristic[HasCharacteristic["unknown"] = 0] = "unknown";
        HasCharacteristic[HasCharacteristic["yes"] = 1] = "yes";
        HasCharacteristic[HasCharacteristic["no"] = 2] = "no";
    })(HasCharacteristic || (HasCharacteristic = {}));
    var XMLDocumentFormattingProvider = /** @class */ (function () {
        function XMLDocumentFormattingProvider(xsltConfiguration) {
            var _this = this;
            this.replaceIndendation = true;
            this.minimiseXPathIndents = true;
            this.indentMixedContent = false;
            this.onType = false;
            this.onTypeLineEmpty = false;
            this.isCloseTag = false;
            this.closeTagLine = null;
            this.closeTagPos = null;
            this.provideOnTypeFormattingEdits = function (document, pos, ch, options, token) {
                _this.isCloseTag = ch.indexOf('/') > -1;
                if (_this.isCloseTag && pos.character > 1) {
                    var tLine = document.lineAt(pos.line);
                    _this.closeTagLine = tLine;
                    _this.closeTagPos = pos;
                    var chBefore = tLine.text.charAt(pos.character - 2);
                    _this.isCloseTag = chBefore === '<';
                }
                if (ch.indexOf('\n') > -1 || _this.isCloseTag) {
                    //const prevLine = document.lineAt(pos.line - 1);
                    var newLine = document.lineAt(pos.line);
                    _this.onTypeLineEmpty = newLine.text.trim().length === 0;
                    var documentRange = new vscode.Range(newLine.range.start, newLine.range.end);
                    _this.onType = true;
                    var formatEdit = _this.provideDocumentRangeFormattingEdits(document, documentRange, options, token);
                    _this.onType = false;
                    return formatEdit;
                }
                else {
                    return [];
                }
            };
            this.provideDocumentFormattingEdits = function (document, options, token) {
                var lastLine = document.lineAt(document.lineCount - 1);
                var documentRange = new vscode.Range(document.positionAt(0), lastLine.range.end);
                return _this.provideDocumentRangeFormattingEdits(document, documentRange, options, token);
            };
            this.provideDocumentRangeFormattingEdits = function (document, range, options, token) {
                var result = [];
                var indentString = '';
                var useTabs = !(options.insertSpaces);
                var newLineString = (document.eol === vscode.EndOfLine.CRLF) ? "\r\n" : "\n";
                // using non-whitespace for testing only!!
                if (useTabs) {
                    indentString = '\t';
                }
                else {
                    indentString = ' ';
                }
                var indentCharLength = useTabs ? 1 : options.tabSize;
                var currentLine = document.lineAt(range.start.line);
                if (range.start.character > currentLine.firstNonWhitespaceCharacterIndex) {
                    // don't format pastes / range selections if they don't include the start non-ws char of the line
                    return [];
                }
                var startFormattingLineNumber = range.start.line;
                var firstLine = document.lineAt(0);
                var adjustedStartRange = new vscode.Range(firstLine.range.start, range.end);
                var stringForTokens;
                if (_this.onTypeLineEmpty) {
                    // add extra char to make token on newline - so it can be indented
                    stringForTokens = document.getText(adjustedStartRange) + '< ';
                }
                else {
                    stringForTokens = document.getText(adjustedStartRange);
                }
                var lexPosition = { line: 0, startCharacter: 0, documentOffset: 0 };
                var allTokens = _this.docType === xslLexer_1.DocumentTypes.XPath ?
                    _this.xpLexer.analyse(document.getText(), xpLexer_1.ExitCondition.None, lexPosition) :
                    _this.xslLexer.analyse(stringForTokens);
                var lineNumber = -1;
                var prevLineNumber = -1;
                var nestingLevel = 0;
                var xpathNestingLevel = 0;
                var newNestingLevel = 0;
                var tokenIndex = -1;
                var multiLineState = MultiLineState.None;
                var xmlSpacePreserveStack = [];
                var xmlelementStack = [];
                var xmlSpaceAttributeValue = null;
                var awaitingXmlSpaceAttributeValue = false;
                var attributeNameOffset = 0;
                var attributeValueOffset = 0;
                var attributeNameOnNewLine = false;
                var isPreserveSpaceElement = false;
                var withinCDATA = false;
                var complexStateStack = [];
                var elseLineNumber = -1;
                var isXSLTStartTag = false;
                var nameIndentRequired = false;
                var preThen = false;
                var documenthasNewLines = HasCharacteristic.unknown;
                var awaitingSecondTag = HasCharacteristic.unknown;
                var firstStartTagLineNumber = -1;
                var prevToken = null;
                var elementName = '';
                var closeTagWithinText = false;
                var closeTagName = null;
                var emptyStackIsElseBlock = false;
                if (_this.docType === xslLexer_1.DocumentTypes.XPath) {
                    complexStateStack = [[0, [], false]];
                    _this.xpLexer.reset();
                }
                allTokens.forEach(function (token) {
                    var _a;
                    var newMultiLineState = MultiLineState.None;
                    var stackLength = xmlSpacePreserveStack.length;
                    var addNewLine = false;
                    tokenIndex++;
                    lineNumber = token.line;
                    var lineNumberDiff = lineNumber - prevLineNumber;
                    var isXMLToken = token.tokenType >= XMLDocumentFormattingProvider.xsltStartTokenNumber;
                    var indent = 0;
                    if (_this.onType && result.length > 0) {
                        // do nothing
                    }
                    else if (isXMLToken) {
                        xpathNestingLevel = 0;
                        var xmlCharType = token.charType;
                        var xmlTokenType = (token.tokenType - XMLDocumentFormattingProvider.xsltStartTokenNumber);
                        switch (xmlTokenType) {
                            case xslLexer_1.XSLTokenLevelState.xslElementName:
                                complexStateStack = [[0, [], false]];
                                emptyStackIsElseBlock = false;
                                isXSLTStartTag = true;
                                elementName = xsltTokenDiagnostics_1.XsltTokenDiagnostics.getTextForToken(lineNumber, token, document);
                                isPreserveSpaceElement = elementName === 'xsl:text';
                                break;
                            case xslLexer_1.XSLTokenLevelState.elementName:
                                complexStateStack = [[0, [], false]];
                                emptyStackIsElseBlock = false;
                                isXSLTStartTag = false;
                                elementName = xsltTokenDiagnostics_1.XsltTokenDiagnostics.getTextForToken(lineNumber, token, document);
                                break;
                            case xslLexer_1.XSLTokenLevelState.xmlPunctuation:
                                switch (xmlCharType) {
                                    case xslLexer_1.XMLCharState.lSt:
                                        attributeNameOffset = 0;
                                        attributeValueOffset = 0;
                                        xmlSpaceAttributeValue = null;
                                        newNestingLevel++;
                                        if (awaitingSecondTag === HasCharacteristic.unknown) {
                                            firstStartTagLineNumber = lineNumber;
                                            awaitingSecondTag = HasCharacteristic.yes;
                                        }
                                        else if (awaitingSecondTag === HasCharacteristic.yes) {
                                            documenthasNewLines = lineNumber > firstStartTagLineNumber ? HasCharacteristic.yes : HasCharacteristic.no;
                                            awaitingSecondTag = HasCharacteristic.no;
                                        }
                                        addNewLine = _this.shouldAddNewLine(documenthasNewLines, prevToken, token);
                                        break;
                                    case xslLexer_1.XMLCharState.rStNoAtt:
                                        var preserveSpace = stackLength > 0 ? xmlSpacePreserveStack[stackLength - 1] : false;
                                        xmlSpacePreserveStack.push(preserveSpace);
                                        if (_this.isCloseTag) {
                                            xmlelementStack.push(elementName);
                                        }
                                        break;
                                    case xslLexer_1.XMLCharState.rSt:
                                        attributeNameOffset = 0;
                                        attributeValueOffset = 0;
                                        if (xmlSpaceAttributeValue === null) {
                                            var preserveSpace_1 = stackLength > 0 ? xmlSpacePreserveStack[stackLength - 1] : false;
                                            xmlSpacePreserveStack.push(preserveSpace_1);
                                        }
                                        else {
                                            xmlSpacePreserveStack.push(xmlSpaceAttributeValue);
                                            xmlSpaceAttributeValue = null;
                                        }
                                        if (_this.isCloseTag) {
                                            xmlelementStack.push(elementName);
                                        }
                                        break;
                                    case xslLexer_1.XMLCharState.lCt:
                                        // outdent:
                                        indent = -1;
                                        newNestingLevel--;
                                        addNewLine = _this.shouldAddNewLine(documenthasNewLines, prevToken, token);
                                        if (_this.isCloseTag) {
                                            closeTagWithinText = ((_a = _this.closeTagPos) === null || _a === void 0 ? void 0 : _a.line) === token.line &&
                                                _this.closeTagPos.character >= token.startCharacter &&
                                                _this.closeTagPos.character <= token.startCharacter + token.length;
                                            if (closeTagWithinText && xmlelementStack.length > 0) {
                                                closeTagName = xmlelementStack[xmlelementStack.length - 1];
                                            }
                                        }
                                        break;
                                    case xslLexer_1.XMLCharState.rSelfCtNoAtt:
                                    case xslLexer_1.XMLCharState.rSelfCt:
                                        attributeNameOffset = 0;
                                        attributeValueOffset = 0;
                                        isPreserveSpaceElement = false;
                                        newNestingLevel--;
                                        break;
                                    case xslLexer_1.XMLCharState.rCt:
                                        attributeNameOffset = 0;
                                        attributeValueOffset = 0;
                                        isPreserveSpaceElement = false;
                                        if (stackLength > 0) {
                                            xmlSpacePreserveStack.pop();
                                        }
                                        if (_this.isCloseTag && xmlelementStack.length > 0) {
                                            xmlelementStack.pop();
                                        }
                                        break;
                                    case xslLexer_1.XMLCharState.lPi:
                                        // may be xml-declaration:
                                        if (awaitingSecondTag === HasCharacteristic.unknown) {
                                            firstStartTagLineNumber = lineNumber;
                                            awaitingSecondTag = HasCharacteristic.yes;
                                        }
                                        attributeNameOffset = 0;
                                        attributeValueOffset = 0;
                                        break;
                                    case xslLexer_1.XMLCharState.rPi:
                                        indent = 0;
                                        break;
                                    case xslLexer_1.XMLCharState.rCdataEnd:
                                        withinCDATA = true;
                                        break;
                                }
                                break;
                            case xslLexer_1.XSLTokenLevelState.attributeName:
                            case xslLexer_1.XSLTokenLevelState.xmlnsName:
                                // test: xml:space
                                attributeValueOffset = 0;
                                attributeNameOnNewLine = lineNumberDiff > 0;
                                nameIndentRequired = true;
                                if (token.length === 9 || (isXSLTStartTag && _this.minimiseXPathIndents)) {
                                    var valueText = xsltTokenDiagnostics_1.XsltTokenDiagnostics.getTextForToken(lineNumber, token, document);
                                    awaitingXmlSpaceAttributeValue = (valueText === 'xml:space');
                                    nameIndentRequired = !(isXSLTStartTag && attributeNameOnNewLine && _this.xslLexer.isExpressionAtt(valueText));
                                }
                                var attNameLine = document.lineAt(lineNumber);
                                if (!nameIndentRequired) {
                                    attributeNameOffset = 0;
                                }
                                else if (!attributeNameOnNewLine && attributeNameOffset === 0) {
                                    attributeNameOffset = token.startCharacter - attNameLine.firstNonWhitespaceCharacterIndex;
                                }
                                break;
                            case xslLexer_1.XSLTokenLevelState.attributeValue:
                                var attValueLine = document.lineAt(lineNumber);
                                var attValueText = xsltTokenDiagnostics_1.XsltTokenDiagnostics.getTextForToken(lineNumber, token, document);
                                // token constains single/double quotes also
                                var textOnFirstLine = token.length > 1 && attValueText.trim().length > 1;
                                var indentRemainder = attributeNameOffset % indentCharLength;
                                var adjustedIndentChars = attributeNameOffset + (indentCharLength - indentRemainder);
                                var calcOffset = token.startCharacter - attValueLine.firstNonWhitespaceCharacterIndex;
                                calcOffset = attributeNameOnNewLine ? calcOffset + attributeNameOffset : calcOffset;
                                var newValueOffset = textOnFirstLine ? 1 + calcOffset : adjustedIndentChars;
                                attributeValueOffset = lineNumberDiff > 0 ? attributeValueOffset : newValueOffset;
                                if (awaitingXmlSpaceAttributeValue) {
                                    // token includes surrounding quotes.
                                    xmlSpaceAttributeValue = attValueText === '\"preserve\"' || attValueText === '\'preserve\'';
                                    awaitingXmlSpaceAttributeValue = false;
                                }
                                break;
                            case xslLexer_1.XSLTokenLevelState.processingInstrValue:
                            case xslLexer_1.XSLTokenLevelState.processingInstrName:
                                attributeNameOffset = 0;
                                newMultiLineState = (multiLineState === MultiLineState.None) ? MultiLineState.Start : MultiLineState.Middle;
                                // TODO: outdent ?> on separate line - when token value is only whitespace
                                var piText = xsltTokenDiagnostics_1.XsltTokenDiagnostics.getTextForToken(lineNumber, token, document);
                                var trimPi = piText.trim();
                                if (newMultiLineState === MultiLineState.Middle && trimPi.length > 0) {
                                    indent = 1;
                                }
                                break;
                            case xslLexer_1.XSLTokenLevelState.xmlComment:
                                newMultiLineState = (multiLineState === MultiLineState.None) ? MultiLineState.Start : MultiLineState.Middle;
                                var commentLineText = xsltTokenDiagnostics_1.XsltTokenDiagnostics.getTextForToken(lineNumber, token, document);
                                var trimLine = _this.trimLeft(commentLineText);
                                var doIndent = newMultiLineState === MultiLineState.Middle
                                    && token.length > 0 && !trimLine.startsWith('-->') && !trimLine.startsWith('<!--');
                                indent = doIndent ? 1 : 0;
                                attributeNameOffset = doIndent ? 5 : 0;
                                break;
                        }
                    }
                    else {
                        var xpathCharType = token.charType;
                        var xpathTokenType = token.tokenType;
                        var currentStateLevel = complexStateStack.length > 0 ? complexStateStack[complexStateStack.length - 1] : [0, [], emptyStackIsElseBlock];
                        var bracketNesting = currentStateLevel[0];
                        var ifElseStack = currentStateLevel[1];
                        var isElseBlock = currentStateLevel[2];
                        var ifElseStackLength = ifElseStack.length;
                        switch (xpathTokenType) {
                            case xpLexer_1.TokenLevelState.complexExpression:
                                var valueText = token.value;
                                switch (valueText) {
                                    case 'if':
                                        if (lineNumber === elseLineNumber) {
                                            xpathNestingLevel--;
                                        }
                                        elseLineNumber = -1;
                                        preThen = true;
                                        break;
                                    case 'every':
                                    case 'for':
                                    case 'let':
                                    case 'some':
                                        indent = -1;
                                    // no-break;
                                    case 'then':
                                        preThen = false;
                                        xpathNestingLevel++;
                                        ifElseStack.push(xpathNestingLevel);
                                        break;
                                    case 'else':
                                        isElseBlock = true;
                                        if (complexStateStack.length === 0) {
                                            emptyStackIsElseBlock = true;
                                        }
                                        else {
                                            complexStateStack[complexStateStack.length - 1][2] = true;
                                        }
                                    case 'return':
                                    case 'satisfies':
                                        elseLineNumber = lineNumber;
                                        xpathNestingLevel = ifElseStackLength > 0 ? ifElseStack[ifElseStackLength - 1] : 0;
                                        if (ifElseStack.length > 0) {
                                            ifElseStack.pop();
                                        }
                                        indent = -1;
                                        break;
                                }
                                break;
                            case xpLexer_1.TokenLevelState.operator:
                                switch (xpathCharType) {
                                    case xpLexer_1.CharLevelState.lB:
                                    case xpLexer_1.CharLevelState.lPr:
                                    case xpLexer_1.CharLevelState.lBr:
                                        complexStateStack.push([xpathNestingLevel, [], false]);
                                        xpathNestingLevel++;
                                        indent = -1;
                                        break;
                                    case xpLexer_1.CharLevelState.rB:
                                    case xpLexer_1.CharLevelState.rPr:
                                    case xpLexer_1.CharLevelState.rBr:
                                        if (complexStateStack.length > 0) {
                                            xpathNestingLevel = bracketNesting;
                                            complexStateStack.pop();
                                        }
                                        else {
                                            xpathNestingLevel = 0;
                                        }
                                        break;
                                    case xpLexer_1.CharLevelState.dSep:
                                        var valueText_1 = token.value;
                                        if (valueText_1 === ':=') {
                                            indent = -1;
                                        }
                                        break;
                                    case xpLexer_1.CharLevelState.sep:
                                        if (token.value === ',') {
                                            if (isElseBlock) {
                                                xpathNestingLevel--;
                                                if (complexStateStack.length === 0) {
                                                    emptyStackIsElseBlock = false;
                                                }
                                                else {
                                                    complexStateStack[complexStateStack.length - 1][2] = false;
                                                }
                                            }
                                        }
                                        break;
                                }
                                break;
                        }
                    }
                    if (addNewLine && lineNumberDiff === 0) {
                        lineNumberDiff = 1;
                    }
                    if (_this.onType && result.length > 0) {
                    }
                    else if (_this.isCloseTag) {
                        if (nestingLevel > 0 && closeTagName !== null && _this.closeTagPos !== null) {
                            var nonWsStart = _this.closeTagLine ? _this.closeTagLine.firstNonWhitespaceCharacterIndex : 0;
                            var replacementString = '';
                            var edit = void 0;
                            if ((nonWsStart + 2) === _this.closeTagPos.character) {
                                var requiredIndentLength = ((nestingLevel - 1) * indentCharLength);
                                replacementString = indentString.repeat(requiredIndentLength);
                                replacementString += '</' + closeTagName + '>';
                                var startPos = new vscode.Position(_this.closeTagPos.line, 0);
                                var endPos = new vscode.Position(_this.closeTagPos.line, token.startCharacter + 2);
                                edit = vscode.TextEdit.replace(new vscode.Range(startPos, endPos), replacementString);
                            }
                            else {
                                edit = vscode.TextEdit.insert(_this.closeTagPos, closeTagName + '>');
                            }
                            closeTagName = null;
                            result.push(edit);
                        }
                    }
                    else if (!withinCDATA && lineNumber >= startFormattingLineNumber && lineNumberDiff > 0) {
                        // process any skipped lines (text not in tokens):
                        for (var i = lineNumberDiff - 1; i > -1; i--) {
                            var loopLineNumber = lineNumber - i;
                            var currentLine_1 = document.lineAt(loopLineNumber);
                            // token may not be at start of line
                            var actualIndentLength = currentLine_1.firstNonWhitespaceCharacterIndex;
                            var preserveSpace = stackLength > 0 ? xmlSpacePreserveStack[stackLength - 1] : false;
                            var totalAttributeOffset = void 0;
                            if (!isXMLToken && _this.minimiseXPathIndents) {
                                totalAttributeOffset = 0;
                            }
                            else {
                                totalAttributeOffset = attributeValueOffset > 0 ? attributeValueOffset : attributeNameOffset;
                            }
                            var indentExtraAsNoNameIndent = (!nameIndentRequired && !isXMLToken) && _this.docType !== xslLexer_1.DocumentTypes.XPath ? 1 : 0;
                            // guard against attempt to indent negative:
                            var guardedNestingLevel = xpathNestingLevel > -1 ? xpathNestingLevel : 0;
                            var requiredIndentLength = totalAttributeOffset + ((nestingLevel + guardedNestingLevel + indentExtraAsNoNameIndent) * indentCharLength);
                            if (totalAttributeOffset > 0) {
                                indent = -1 + indent;
                            }
                            if (i > 0) {
                                // on a missed line, ignore outdent
                            }
                            else {
                                requiredIndentLength += (indent * indentCharLength);
                            }
                            requiredIndentLength = requiredIndentLength < 0 ? 0 : requiredIndentLength;
                            if (!(preserveSpace || isPreserveSpaceElement)) {
                                if (_this.replaceIndendation) {
                                    if (addNewLine) {
                                        var editPos = new vscode.Position(loopLineNumber, token.startCharacter);
                                        var replacementString = newLineString + indentString.repeat(requiredIndentLength);
                                        result.push(vscode.TextEdit.insert(editPos, replacementString));
                                    }
                                    else {
                                        var replacementString = indentString.repeat(requiredIndentLength);
                                        result.push(_this.getReplaceLineIndentTextEdit(currentLine_1, replacementString));
                                    }
                                }
                                else if (actualIndentLength !== requiredIndentLength) {
                                    var indentLengthDiff = requiredIndentLength - actualIndentLength;
                                    if (indentLengthDiff > 0) {
                                        result.push(vscode.TextEdit.insert(currentLine_1.range.start, indentString.repeat(indentLengthDiff)));
                                    }
                                    else {
                                        var endPos = new vscode.Position(loopLineNumber, 0 - indentLengthDiff);
                                        var deletionRange = currentLine_1.range.with(currentLine_1.range.start, endPos);
                                        result.push(vscode.TextEdit.delete(deletionRange));
                                    }
                                }
                            }
                        }
                    }
                    withinCDATA = false;
                    prevLineNumber = lineNumber;
                    nestingLevel = newNestingLevel;
                    multiLineState = newMultiLineState;
                    prevToken = token;
                });
                _this.isCloseTag = false;
                return result;
            };
            this.getReplaceLineIndentTextEdit = function (currentLine, indentString) {
                var startPos = currentLine.range.start;
                if (currentLine.firstNonWhitespaceCharacterIndex === 0) {
                    return vscode.TextEdit.insert(startPos, indentString);
                }
                else {
                    var endPos = new vscode.Position(currentLine.lineNumber, currentLine.firstNonWhitespaceCharacterIndex);
                    var valueRange = currentLine.range.with(startPos, endPos);
                    return vscode.TextEdit.replace(valueRange, indentString);
                }
            };
            this.xslLexer = new xslLexer_1.XslLexer(xsltConfiguration);
            this.docType = xsltConfiguration.docType;
            this.xpLexer = new xpLexer_1.XPathLexer();
            this.xslLexer.provideCharLevelState = true;
        }
        XMLDocumentFormattingProvider.prototype.trimLeft = function (text) {
            return text.replace(/^\s+/, "");
        };
        XMLDocumentFormattingProvider.prototype.shouldAddNewLine = function (documenthasNewLines, prevToken, token) {
            var addNewLine = false;
            if (documenthasNewLines === HasCharacteristic.no) {
                if (this.indentMixedContent) {
                    addNewLine = true;
                }
                else {
                    // TODO!!! check if prevtoken was a right-close-tag or a self-closing tag or comment????
                    var pct = prevToken === null || prevToken === void 0 ? void 0 : prevToken.charType;
                    addNewLine = pct === xslLexer_1.XMLCharState.rSelfCt || pct === xslLexer_1.XMLCharState.rSt || pct === xslLexer_1.XMLCharState.rCt ||
                        pct === xslLexer_1.XMLCharState.rSelfCtNoAtt || pct === xslLexer_1.XMLCharState.rStNoAtt ||
                        pct === xslLexer_1.XMLCharState.rComment || pct === xslLexer_1.XMLCharState.rPi;
                }
            }
            else if (this.indentMixedContent) {
                // add a new line if we're on the same line
                addNewLine = (prevToken === null || prevToken === void 0 ? void 0 : prevToken.line) === token.line;
            }
            return addNewLine;
        };
        XMLDocumentFormattingProvider.xsltStartTokenNumber = xslLexer_1.XslLexer.getXsltStartTokenNumber();
        return XMLDocumentFormattingProvider;
    }());
    exports.XMLDocumentFormattingProvider = XMLDocumentFormattingProvider;
    var MultiLineState;
    (function (MultiLineState) {
        MultiLineState[MultiLineState["None"] = 0] = "None";
        MultiLineState[MultiLineState["Start"] = 1] = "Start";
        MultiLineState[MultiLineState["Middle"] = 2] = "Middle";
    })(MultiLineState || (MultiLineState = {}));
});
//# sourceMappingURL=xmlDocumentFormattingProvider.js.map