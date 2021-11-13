define(["require", "exports", "vscode", "./xslLexer", "./xpLexer", "./functionData", "./schemaQuery", "./languageConfigurations"], function (require, exports, vscode, xslLexer_1, xpLexer_1, functionData_1, schemaQuery_1, languageConfigurations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XsltTokenDiagnostics = void 0;
    var HasCharacteristic;
    (function (HasCharacteristic) {
        HasCharacteristic[HasCharacteristic["unknown"] = 0] = "unknown";
        HasCharacteristic[HasCharacteristic["yes"] = 1] = "yes";
        HasCharacteristic[HasCharacteristic["no"] = 2] = "no";
    })(HasCharacteristic || (HasCharacteristic = {}));
    var TagType;
    (function (TagType) {
        TagType[TagType["XSLTstart"] = 0] = "XSLTstart";
        TagType[TagType["XMLstart"] = 1] = "XMLstart";
        TagType[TagType["XSLTvar"] = 2] = "XSLTvar";
        TagType[TagType["Start"] = 3] = "Start";
        TagType[TagType["NonStart"] = 4] = "NonStart";
    })(TagType || (TagType = {}));
    var AttributeType;
    (function (AttributeType) {
        AttributeType[AttributeType["None"] = 0] = "None";
        AttributeType[AttributeType["Variable"] = 1] = "Variable";
        AttributeType[AttributeType["VariableRef"] = 2] = "VariableRef";
        AttributeType[AttributeType["InstructionName"] = 3] = "InstructionName";
        AttributeType[AttributeType["InstructionMode"] = 4] = "InstructionMode";
        AttributeType[AttributeType["UseAttributeSets"] = 5] = "UseAttributeSets";
        AttributeType[AttributeType["ExcludeResultPrefixes"] = 6] = "ExcludeResultPrefixes";
        AttributeType[AttributeType["XPath"] = 7] = "XPath";
    })(AttributeType || (AttributeType = {}));
    var CurlyBraceType;
    (function (CurlyBraceType) {
        CurlyBraceType[CurlyBraceType["None"] = 0] = "None";
        CurlyBraceType[CurlyBraceType["Map"] = 1] = "Map";
        CurlyBraceType[CurlyBraceType["Array"] = 2] = "Array";
    })(CurlyBraceType || (CurlyBraceType = {}));
    var NameValidationError;
    (function (NameValidationError) {
        NameValidationError[NameValidationError["None"] = 0] = "None";
        NameValidationError[NameValidationError["NamespaceError"] = 1] = "NamespaceError";
        NameValidationError[NameValidationError["NameError"] = 2] = "NameError";
        NameValidationError[NameValidationError["XSLTElementNameError"] = 3] = "XSLTElementNameError";
        NameValidationError[NameValidationError["XSLTAttributeNameError"] = 4] = "XSLTAttributeNameError";
    })(NameValidationError || (NameValidationError = {}));
    var ValidationType;
    (function (ValidationType) {
        ValidationType[ValidationType["XMLAttribute"] = 0] = "XMLAttribute";
        ValidationType[ValidationType["XMLElement"] = 1] = "XMLElement";
        ValidationType[ValidationType["XSLTAttribute"] = 2] = "XSLTAttribute";
        ValidationType[ValidationType["PrefixedName"] = 3] = "PrefixedName";
        ValidationType[ValidationType["Name"] = 4] = "Name";
    })(ValidationType || (ValidationType = {}));
    var XsltTokenDiagnostics = /** @class */ (function () {
        function XsltTokenDiagnostics() {
        }
        XsltTokenDiagnostics.isBracket = function (charState) {
            return XsltTokenDiagnostics.brackets.indexOf(charState) !== -1;
        };
        XsltTokenDiagnostics.validateName = function (name, type, isSchematron, xmlnsPrefixes, elementStack, expectedAttributes) {
            var valid = NameValidationError.None;
            if (name.trim().length === 0) {
                return NameValidationError.NameError;
            }
            if (type === ValidationType.XMLAttribute || type === ValidationType.XSLTAttribute) {
                if (name === 'xml:space' || name === 'xml:lang' || name === 'xml:base' || name === 'xml:id') {
                    return NameValidationError.None;
                }
            }
            var nameParts = name.split(':');
            if (nameParts.length > 2) {
                return NameValidationError.NameError;
            }
            else {
                if (nameParts.length === 2) {
                    var prefix = nameParts[0];
                    if (type === ValidationType.XMLElement) {
                        // TODO: when within literal result element, iterate up stack until we get to an XSLT instruction:
                        var expectedNames = elementStack && elementStack.length > 0 ? elementStack[elementStack.length - 1].expectedChildElements : ['xsl:transform', 'xsl:stylesheet', 'xsl:package'];
                        if (prefix === 'xsl' || prefix === 'ixsl') {
                            if (isSchematron) {
                                // TODO: check xslt elements within schematron
                                valid = NameValidationError.None;
                            }
                            else if (expectedNames.length === 0 && elementStack) {
                                var withinNextIteration = elementStack[elementStack.length - 1].symbolName === 'xsl:next-iteration';
                                valid = name === 'xsl:with-param' && withinNextIteration ? NameValidationError.None : NameValidationError.XSLTElementNameError;
                            }
                            else {
                                valid = expectedNames.indexOf(name) > -1 ? NameValidationError.None : NameValidationError.XSLTElementNameError;
                                if (valid !== NameValidationError.None && (name === 'xsl:next-iteration' || name === 'xsl:break')) {
                                    var withinIterarator = elementStack === null || elementStack === void 0 ? void 0 : elementStack.find(function (item) { return item.symbolName === 'xsl:iterate'; });
                                    if (withinIterarator) {
                                        valid = NameValidationError.None;
                                    }
                                }
                            }
                            return valid;
                        }
                        else if (isSchematron) {
                            if (prefix === 'sch') {
                                if ((elementStack === null || elementStack === void 0 ? void 0 : elementStack.length) === 0) {
                                    valid = name === 'sch:schema' ? NameValidationError.None : NameValidationError.XSLTElementNameError;
                                }
                                else {
                                    valid = expectedNames.indexOf(name) > -1 ? NameValidationError.None : NameValidationError.XSLTElementNameError;
                                }
                            }
                        }
                        else {
                            valid = xmlnsPrefixes.indexOf(prefix) > -1 ? NameValidationError.None : NameValidationError.NamespaceError;
                        }
                    }
                    else if (prefix === 'xsl' && type === ValidationType.XSLTAttribute) {
                        // TODO: for attributes on non-xsl instructions, check that name is in the attributeGroup: xsl:literal-result-element-attributes (e.g. xsl:expand-text)
                        //valid = xmlnsPrefixes.indexOf(prefix) > -1? NameValidationError.None: NameValidationError.NamespaceError;
                    }
                    else {
                        valid = xmlnsPrefixes.indexOf(prefix) > -1 ? NameValidationError.None : NameValidationError.NamespaceError;
                    }
                }
                else if (isSchematron && type === ValidationType.XMLElement) {
                    if ((elementStack === null || elementStack === void 0 ? void 0 : elementStack.length) === 0) {
                        valid = name === 'schema' ? NameValidationError.None : NameValidationError.XSLTElementNameError;
                    }
                    else {
                        var expectedNames = elementStack && elementStack.length > 0 ? elementStack[elementStack.length - 1].expectedChildElements : [];
                        valid = expectedNames.indexOf('sch:' + name) > -1 ? NameValidationError.None : NameValidationError.XSLTElementNameError;
                    }
                }
                else if ((type === ValidationType.XSLTAttribute || (isSchematron && type === ValidationType.XMLAttribute)) && expectedAttributes) {
                    valid = expectedAttributes.indexOf(name) > -1 ? NameValidationError.None : NameValidationError.XSLTAttributeNameError;
                    return valid;
                }
                if (valid === NameValidationError.None) {
                    nameParts.forEach(function (namePart) {
                        if (valid === NameValidationError.None) {
                            var charsOK = true;
                            var firstChar = true;
                            var charExists = false;
                            for (var _i = 0, namePart_1 = namePart; _i < namePart_1.length; _i++) {
                                var s = namePart_1[_i];
                                if (firstChar) {
                                    firstChar = false;
                                    charExists = true;
                                    charsOK = XsltTokenDiagnostics.nameStartCharRgx.test(s);
                                    if (!charsOK) {
                                        break;
                                    }
                                }
                                else {
                                    charsOK = XsltTokenDiagnostics.nameCharRgx.test(s);
                                    if (!charsOK) {
                                        break;
                                    }
                                }
                            }
                            valid = charExists && charsOK ? NameValidationError.None : NameValidationError.NameError;
                        }
                    });
                }
            }
            return valid;
        };
        XsltTokenDiagnostics.checkFinalXPathToken = function (prevToken, allTokens, index, problemTokens) {
            var isValid = false;
            switch (prevToken.charType) {
                case xpLexer_1.CharLevelState.rB:
                case xpLexer_1.CharLevelState.rBr:
                case xpLexer_1.CharLevelState.rPr:
                    isValid = true;
                    break;
                case xpLexer_1.CharLevelState.dSep:
                    isValid = prevToken.value === '()' || prevToken.value === '[]' || prevToken.value === '{}';
                    break;
                default:
                    if (prevToken.value === '%') {
                        isValid = true;
                    }
                    else if (prevToken.value === '/' || prevToken.value === '.') {
                        // these are ok provided that the previous token was XSLT or previous token was ,;
                        var prevToken2 = allTokens[index - 2];
                        var tokenBeforePrevWasXSLT = prevToken2.tokenType >= XsltTokenDiagnostics.xsltStartTokenNumber;
                        isValid = tokenBeforePrevWasXSLT || (prevToken2.tokenType === xpLexer_1.TokenLevelState.operator &&
                            prevToken2.charType !== xpLexer_1.CharLevelState.rB &&
                            prevToken2.charType !== xpLexer_1.CharLevelState.rBr &&
                            prevToken2.charType !== xpLexer_1.CharLevelState.rPr);
                    }
                    break;
            }
            if (!isValid) {
                prevToken['error'] = xpLexer_1.ErrorType.XPathOperatorUnexpected;
                problemTokens.push(prevToken);
            }
        };
        XsltTokenDiagnostics.getExpectedElementNames = function (parentName, schemaQuery, elementStack) {
            var expectedElements = [];
            var expectedAttributes = [];
            if (parentName.startsWith('xsl') && schemaQuery && schemaQuery.docType === xslLexer_1.DocumentTypes.XSLT ||
                (parentName.startsWith('sch') && schemaQuery && schemaQuery.docType === xslLexer_1.DocumentTypes.SCH)) {
                var allExpected = schemaQuery.getExpected(parentName);
                var nameDetailArray = allExpected.elements;
                expectedElements = nameDetailArray.map(function (item) { return item[0]; });
                expectedAttributes = allExpected.attrs;
            }
            else if (elementStack.length > 0) {
                expectedElements = elementStack[elementStack.length - 1].expectedChildElements;
            }
            else {
                expectedElements = [];
            }
            return [expectedElements, expectedAttributes];
        };
        XsltTokenDiagnostics.validateEntityRef = function (entityName, dtdEnded, inheritedPrefixes) {
            var validationResult = NameValidationError.None;
            if (entityName.length > 2 && entityName.endsWith(';')) {
                entityName = entityName.substring(1, entityName.length - 1);
                if (entityName.length > 1 && entityName.charAt(0) === '#') {
                    var validNumber = void 0;
                    if (entityName.charAt(1).toLocaleLowerCase() === 'x') {
                        validNumber = /^#[Xx][0-9a-fA-F]+$/.test(entityName);
                    }
                    else {
                        validNumber = /^#[0-9]+$/.test(entityName);
                    }
                    validationResult = validNumber ? NameValidationError.None : NameValidationError.NameError;
                }
                else if (!dtdEnded) {
                    var isXmlChar = XsltTokenDiagnostics.xmlChars.indexOf(entityName) > -1;
                    validationResult = isXmlChar ? NameValidationError.None : NameValidationError.NameError;
                }
                else {
                    validationResult = XsltTokenDiagnostics.validateName(entityName, ValidationType.Name, false, inheritedPrefixes);
                }
            }
            else {
                validationResult = NameValidationError.NameError;
            }
            return { validationResult: validationResult, entityName: entityName };
        };
        XsltTokenDiagnostics.checkTokenIsExpected = function (prevToken, token, problemTokens, overridType) {
            if (token.error) {
                return;
            }
            var tokenType = overridType ? overridType : token.tokenType;
            var errorSingleSeparators;
            if (tokenType === xpLexer_1.TokenLevelState.number) {
                errorSingleSeparators = ['|'];
            }
            else if (tokenType === xpLexer_1.TokenLevelState.string) {
                errorSingleSeparators = ['|', '+', '-', '*', '?'];
            }
            else {
                errorSingleSeparators = [];
            }
            var errDoubleSeparators;
            if (tokenType === xpLexer_1.TokenLevelState.nodeNameTest) {
                errDoubleSeparators = ['{}', '[]', '()'];
            }
            else if (tokenType === xpLexer_1.TokenLevelState.number || tokenType === xpLexer_1.TokenLevelState.string) {
                errDoubleSeparators = ['{}', '[]', '()', '*:', '::', '//'];
            }
            else {
                errDoubleSeparators = ['{}', '[]', '()', '*:', '::'];
            }
            if (prevToken) {
                var isXMLToken = prevToken.tokenType >= XsltTokenDiagnostics.xsltStartTokenNumber;
                if (!isXMLToken) {
                    var isXPathError = false;
                    if (prevToken.tokenType === xpLexer_1.TokenLevelState.complexExpression || prevToken.tokenType === xpLexer_1.TokenLevelState.entityRef) {
                        // no error
                    }
                    else if (prevToken.tokenType === xpLexer_1.TokenLevelState.uriLiteral && tokenType !== xpLexer_1.TokenLevelState.nodeNameTest) {
                        isXPathError = true;
                    }
                    else if (prevToken.tokenType === xpLexer_1.TokenLevelState.operator) {
                        if (prevToken.charType === xpLexer_1.CharLevelState.rB || prevToken.charType === xpLexer_1.CharLevelState.rPr || prevToken.charType === xpLexer_1.CharLevelState.rPr) {
                            isXPathError = true;
                        }
                        else if (prevToken.charType === xpLexer_1.CharLevelState.dSep) {
                            if (errDoubleSeparators.indexOf(prevToken.value) !== -1) {
                                isXPathError = true;
                            }
                        }
                        else if (prevToken.charType === xpLexer_1.CharLevelState.sep) {
                            if (errorSingleSeparators.indexOf(prevToken.value) !== -1) {
                                isXPathError = true;
                            }
                        }
                    }
                    else if (tokenType === xpLexer_1.TokenLevelState.nodeNameTest && prevToken.tokenType === xpLexer_1.TokenLevelState.uriLiteral) {
                        // no error
                    }
                    else {
                        isXPathError = true;
                    }
                    if (isXPathError) {
                        var errType = tokenType === xpLexer_1.TokenLevelState.function ? xpLexer_1.ErrorType.XPathFunctionUnexpected : xpLexer_1.ErrorType.XPathUnexpected;
                        token.error = errType;
                        problemTokens.push(token);
                    }
                }
            }
        };
        XsltTokenDiagnostics.validateXMLDeclaration = function (lineNumber, token, document, problemTokens) {
            var piValue = XsltTokenDiagnostics.getTextForToken(lineNumber, token, document);
            var xmlPIrgx = /(=|'|"|\d+\.\d+|[\w|-]+|\s+)/;
            var encodingRgx = /[A-Za-z]([A-Za-z0-9._-])*/;
            var spaceRegx = /\s+/;
            var pState = XMLPIState.none;
            var pName = XMLPIName.none;
            var names = [];
            var namesWithValues = [];
            var isValid = true;
            var allParts = piValue.split(xmlPIrgx);
            var lastPartIndex = allParts.length - 1;
            allParts.forEach(function (part, index) {
                if (pState !== XMLPIState.invalid && part.length > 0) {
                    switch (pState) {
                        case XMLPIState.none:
                            if (!spaceRegx.test(part)) {
                                if (part === 'version' && names.indexOf(XMLPIName.version) < 0) {
                                    pState = XMLPIState.Name;
                                    pName = XMLPIName.version;
                                    names.push(pName);
                                }
                                else if (part === 'encoding' && names.indexOf(XMLPIName.encoding) < 0) {
                                    pState = XMLPIState.Name;
                                    pName = XMLPIName.encoding;
                                    names.push(pName);
                                }
                                else if (part === 'standalone' && names.indexOf(XMLPIName.standalone) < 0) {
                                    pState = XMLPIState.Name;
                                    pName = XMLPIName.standalone;
                                    names.push(pName);
                                }
                                else {
                                    pState = XMLPIState.invalid;
                                }
                            }
                            break;
                        case XMLPIState.Name:
                            if (!spaceRegx.test(part)) {
                                pState = part === '=' ? XMLPIState.Eq : XMLPIState.invalid;
                            }
                            break;
                        case XMLPIState.Eq:
                            if (!spaceRegx.test(part)) {
                                pState = part === '"' || part === '\'' ? XMLPIState.Start : XMLPIState.invalid;
                            }
                            break;
                        case XMLPIState.Start:
                            switch (pName) {
                                case XMLPIName.version:
                                    pState = part === '1.0' || part === '1.1' ? XMLPIState.End : XMLPIState.invalid;
                                    break;
                                case XMLPIName.encoding:
                                    pState = encodingRgx.test(part) ? XMLPIState.End : XMLPIState.invalid;
                                    break;
                                case XMLPIName.standalone:
                                    pState = part === 'yes' || part === 'no' ? XMLPIState.End : XMLPIState.invalid;
                                    break;
                            }
                            break;
                        case XMLPIState.End:
                            pState = part === '"' || part === '\'' ? XMLPIState.none : XMLPIState.invalid;
                            namesWithValues.push(pName);
                            break;
                    }
                }
                if (index === lastPartIndex) {
                    if (pState === XMLPIState.invalid) {
                        isValid = false;
                    }
                    else if (isValid) {
                        isValid = names.indexOf(XMLPIName.version) > -1 &&
                            namesWithValues.indexOf(XMLPIName.version) > -1 &&
                            names.indexOf(XMLPIName.encoding) > -1 === namesWithValues.indexOf(XMLPIName.encoding) > -1 &&
                            names.indexOf(XMLPIName.standalone) > -1 === namesWithValues.indexOf(XMLPIName.standalone) > -1;
                    }
                }
            });
            if (!isValid) {
                token['error'] = xpLexer_1.ErrorType.XMLDeclaration;
                token['value'] = piValue;
                problemTokens.push(token);
            }
        };
        XsltTokenDiagnostics.xorInputs = function (input1, input2) {
            if (input1) {
                return input2 === false;
            }
            else {
                return input2 === true;
            }
        };
        XsltTokenDiagnostics.isValidFunctionName = function (xmlnsPrefixes, xmlnsData, token, checkedGlobalFnNames, arity) {
            var tokenValue;
            if (arity === undefined) {
                var parts = token.value.split('#');
                arity = Number.parseInt(parts[1]);
                tokenValue = parts[0];
            }
            else {
                tokenValue = token.value;
            }
            var qFunctionName = tokenValue + '#' + arity;
            var fNameParts = qFunctionName.split(':');
            var isValid = false;
            var fErrorType = xpLexer_1.ErrorType.XPathFunction;
            if (fNameParts.length === 1) {
                if (tokenValue === 'concat') {
                    isValid = arity > 0;
                }
                else {
                    isValid = functionData_1.FunctionData.xpath.indexOf(fNameParts[0]) > -1;
                }
            }
            else {
                var xsltType = xmlnsData.get(fNameParts[0]);
                if (xmlnsPrefixes.indexOf(fNameParts[0]) < 0) {
                    // prefix is not declared
                    fErrorType = xpLexer_1.ErrorType.XPathFunctionNamespace;
                    isValid = false;
                }
                else if (xsltType === functionData_1.XSLTnamespaces.NotDefined || xsltType === undefined) {
                    isValid = checkedGlobalFnNames.indexOf(qFunctionName) > -1;
                }
                else {
                    switch (xsltType) {
                        case functionData_1.XSLTnamespaces.XPath:
                            isValid = functionData_1.FunctionData.xpath.indexOf(fNameParts[1]) > -1;
                            break;
                        case functionData_1.XSLTnamespaces.Array:
                            isValid = functionData_1.FunctionData.array.indexOf(fNameParts[1]) > -1;
                            break;
                        case functionData_1.XSLTnamespaces.Map:
                            isValid = functionData_1.FunctionData.map.indexOf(fNameParts[1]) > -1;
                            break;
                        case functionData_1.XSLTnamespaces.Math:
                            isValid = functionData_1.FunctionData.math.indexOf(fNameParts[1]) > -1;
                            break;
                        case functionData_1.XSLTnamespaces.XMLSchema:
                            isValid = functionData_1.FunctionData.schema.indexOf(fNameParts[1]) > -1;
                            break;
                        case functionData_1.XSLTnamespaces.IXSL:
                            isValid = functionData_1.FunctionData.ixsl.indexOf(fNameParts[1]) > -1;
                            break;
                        case functionData_1.XSLTnamespaces.Saxon:
                        case functionData_1.XSLTnamespaces.ExpathArchive:
                        case functionData_1.XSLTnamespaces.ExpathBinary:
                        case functionData_1.XSLTnamespaces.ExpathFile:
                            isValid = true;
                            break;
                    }
                }
            }
            fErrorType = isValid ? xpLexer_1.ErrorType.None : fErrorType;
            return { isValid: isValid, qFunctionName: qFunctionName, fErrorType: fErrorType };
        };
        XsltTokenDiagnostics.getTextForToken = function (lineNumber, token, document) {
            var start = token.startCharacter;
            if (start < 0) {
                console.error("ERROR: Found illegal token for document: " + document.fileName);
                console.error("token.startCharacter less than zero: " + token.startCharacter);
                console.error(token);
                start = 0;
            }
            var startPos = new vscode.Position(lineNumber, start);
            var endPos = new vscode.Position(lineNumber, start + token.length);
            var currentLine = document.lineAt(lineNumber);
            var valueRange = currentLine.range.with(startPos, endPos);
            var valueText = document.getText(valueRange);
            return valueText;
        };
        XsltTokenDiagnostics.resolveXPathVariableReference = function (globalVarName, document, importedVariables, token, xpathVariableCurrentlyBeingDefined, inScopeXPathVariablesList, xpathStack, inScopeVariablesList, elementStack) {
            var fullVarName = XsltTokenDiagnostics.getTextForToken(token.line, token, document);
            var varName = fullVarName.startsWith('$') ? fullVarName.substring(1) : fullVarName.substring(1, fullVarName.length - 1);
            var result = null;
            var globalVariable = null;
            var resolved = this.resolveVariableName(inScopeXPathVariablesList, varName, xpathVariableCurrentlyBeingDefined, globalVariable);
            if (!resolved) {
                resolved = this.resolveStackVariableName(xpathStack, varName);
            }
            if (!resolved) {
                resolved = this.resolveVariableName(inScopeVariablesList, varName, false, globalVariable);
            }
            if (!resolved) {
                if (elementStack.length === 1 && globalVarName === varName) {
                    resolved = false;
                }
                else {
                    resolved = this.resolveStackVariableName(elementStack, varName);
                }
            }
            if (!resolved) {
                resolved = globalVarName !== varName && importedVariables.indexOf(varName) > -1;
            }
            if (!resolved) {
                result = token;
            }
            return result;
        };
        XsltTokenDiagnostics.createSymbolFromElementTokens = function (name, id, fullStartToken, fullEndToken, innerToken) {
            // innerToken to be used if its an attribute-value for example
            var kind;
            if (name.trim().length === 0) {
                return null;
            }
            switch (fullStartToken.tagType) {
                case TagType.XSLTvar:
                    kind = vscode.SymbolKind.Enum;
                    break;
                case TagType.XSLTstart:
                    switch (name) {
                        case 'xsl:package':
                        case 'xsl:stylesheet':
                        case 'xsl:transform':
                            kind = vscode.SymbolKind.Package;
                            break;
                        case 'xsl:function':
                            kind = vscode.SymbolKind.Function;
                            break;
                        case 'xsl:template':
                            kind = vscode.SymbolKind.Interface;
                            break;
                        case 'xsl:if':
                        case 'xsl:when':
                        case 'xsl:otherwise':
                            kind = vscode.SymbolKind.Namespace;
                            break;
                        case 'xsl:key':
                            kind = vscode.SymbolKind.Key;
                            break;
                        case 'xsl:sequence':
                            kind = vscode.SymbolKind.Module;
                            break;
                        case 'xsl:value-of':
                        case 'xsl:text':
                            kind = vscode.SymbolKind.String;
                            break;
                        case 'xsl:for-each':
                        case 'xsl:for-each-group':
                        case 'xsl:apply-templates':
                        case 'xsl:iterate':
                            kind = vscode.SymbolKind.EnumMember;
                            break;
                        case 'xsl:import':
                        case 'xsl:include':
                            kind = vscode.SymbolKind.File;
                            break;
                        case 'xsl:choose':
                            kind = vscode.SymbolKind.TypeParameter;
                            break;
                        default:
                            kind = vscode.SymbolKind.Object;
                            break;
                    }
                    break;
                case TagType.XMLstart:
                    kind = vscode.SymbolKind.Object;
                    break;
                default:
                    kind = vscode.SymbolKind.Null;
                    break;
            }
            var startCharPos = fullStartToken.startCharacter > 0 ? fullStartToken.startCharacter - 1 : 0;
            var startPos = new vscode.Position(fullStartToken.line, startCharPos);
            var endPos = new vscode.Position(fullEndToken.line, fullEndToken.startCharacter + fullEndToken.length + 1);
            var innerStartPos;
            var innerEndPos;
            if (innerToken) {
                innerStartPos = new vscode.Position(innerToken.line, innerToken.startCharacter);
                innerEndPos = new vscode.Position(innerToken.line, innerToken.startCharacter + innerToken.length);
            }
            else {
                innerStartPos = new vscode.Position(fullStartToken.line, fullStartToken.startCharacter);
                innerEndPos = new vscode.Position(fullEndToken.line, fullStartToken.startCharacter + fullStartToken.length);
            }
            var fullRange = new vscode.Range(startPos, endPos);
            var innerRange = new vscode.Range(innerStartPos, innerEndPos);
            // check for error!
            if (!fullRange.contains(innerRange)) {
                innerStartPos = new vscode.Position(fullStartToken.line, fullStartToken.startCharacter);
                innerEndPos = new vscode.Position(fullStartToken.line, fullStartToken.startCharacter + fullStartToken.length);
                innerRange = new vscode.Range(innerStartPos, innerEndPos);
            }
            var detail = '';
            var fullSymbolName = id.length > 0 ? name + ' \u203A ' + id : name;
            if (fullRange.contains(innerRange)) {
                return new vscode.DocumentSymbol(fullSymbolName, detail, kind, fullRange, innerRange);
            }
            else {
                return null;
            }
        };
        XsltTokenDiagnostics.createSymbolForAttribute = function (innerToken, attrName) {
            var startPos = new vscode.Position(innerToken.line, innerToken.startCharacter);
            var endPos = new vscode.Position(innerToken.line, innerToken.startCharacter + innerToken.length);
            var range = new vscode.Range(startPos, endPos);
            var detail = '';
            return new vscode.DocumentSymbol(attrName, detail, vscode.SymbolKind.Field, range, range);
        };
        XsltTokenDiagnostics.initChildrenSymbols = function (attrSymbols) {
            if (attrSymbols.length === 0) {
                return [];
            }
            var startPos = new vscode.Position(attrSymbols[0].range.start.line, attrSymbols[0].range.start.character);
            var endPos = new vscode.Position(attrSymbols[attrSymbols.length - 1].range.end.line, attrSymbols[attrSymbols.length - 1].range.end.character);
            var range = new vscode.Range(startPos, endPos);
            var detail = '';
            var attrSymbol = new vscode.DocumentSymbol('attributes', detail, vscode.SymbolKind.Array, range, range);
            attrSymbol.children = attrSymbols;
            return [attrSymbol];
        };
        XsltTokenDiagnostics.resolveVariableName = function (variableList, varName, xpathVariableCurrentlyBeingDefined, globalXsltVariable) {
            var resolved = false;
            var decrementedLength = variableList.length - 1;
            var globalVariableName = globalXsltVariable === null || globalXsltVariable === void 0 ? void 0 : globalXsltVariable.name;
            // last items in list of declared parameters must be resolved first:
            for (var i = decrementedLength; i > -1; i--) {
                var data = variableList[i];
                if (xpathVariableCurrentlyBeingDefined && i === decrementedLength) {
                    // do nothing: we skip last item in list as it's currently being defined
                }
                else if (data.name === varName && globalVariableName !== data.name) {
                    resolved = true;
                    data.token['referenced'] = true;
                    break;
                }
            }
            return resolved;
        };
        XsltTokenDiagnostics.resolveStackVariableName = function (elementStack, varName) {
            var resolved = false;
            var globalXsltVariable = null;
            for (var i = elementStack.length - 1; i > -1; i--) {
                var inheritedVariables = elementStack[i].variables;
                var xpathBeingDefinedInit = elementStack[i].xpathVariableCurrentlyBeingDefined;
                var xpathBeingDefined = !(xpathBeingDefinedInit === undefined || xpathBeingDefinedInit === false);
                if (i === 1) {
                    // at the level of a global variable declaration
                    var elementData = elementStack[i];
                    var currentVar = elementData.currentVariable;
                    if (currentVar) {
                        // must be inside a global variable declaration - keep this:
                        globalXsltVariable = currentVar;
                    }
                }
                resolved = this.resolveVariableName(inheritedVariables, varName, xpathBeingDefined, globalXsltVariable);
                if (resolved) {
                    break;
                }
            }
            return resolved;
        };
        XsltTokenDiagnostics.getDiagnosticsFromUnusedVariableTokens = function (document, unusedVariableTokens, unresolvedVariableTokens, includeOrImport) {
            var result = [];
            for (var _i = 0, unusedVariableTokens_1 = unusedVariableTokens; _i < unusedVariableTokens_1.length; _i++) {
                var token = unusedVariableTokens_1[_i];
                if (token.referenced === undefined) {
                    result.push(this.createUnusedVarDiagnostic(token));
                }
            }
            for (var _a = 0, unresolvedVariableTokens_1 = unresolvedVariableTokens; _a < unresolvedVariableTokens_1.length; _a++) {
                var token = unresolvedVariableTokens_1[_a];
                result.push(this.createUnresolvedVarDiagnostic(document, token, includeOrImport));
            }
            return result;
        };
        XsltTokenDiagnostics.appendDiagnosticsFromProblemTokens = function (variableRefDiagnostics, tokens) {
            tokens.forEach(function (token) {
                var line = token.line;
                var endChar = token.startCharacter + token.length;
                var tokenValue = token.value;
                var msg;
                var diagnosticMetadata = [];
                var severity = vscode.DiagnosticSeverity.Error;
                switch (token.error) {
                    case xpLexer_1.ErrorType.AxisName:
                        msg = "XPath: Invalid axis name: '" + tokenValue;
                        break;
                    case xpLexer_1.ErrorType.BracketNesting:
                        var matchingChar = XsltTokenDiagnostics.getMatchingSymbol(tokenValue);
                        msg = matchingChar.length === 0 ? "XPath: No match found for '" + tokenValue + "'" : "'" + tokenValue + "' has no matching '" + matchingChar + "'";
                        diagnosticMetadata = [vscode.DiagnosticTag.Unnecessary];
                        break;
                    case xpLexer_1.ErrorType.ElementNesting:
                        msg = "XML: Start tag '" + tokenValue + "' has no matching close tag";
                        break;
                    case xpLexer_1.ErrorType.ExpectedElseAfterThen:
                        msg = "XML: Expected 'else' but found '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.ExpectedDollarAfterComma:
                        msg = "XML: Expected '$' but found '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.EntityName:
                        msg = "XML: Invalid entity name '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.MultiRoot:
                        msg = 'XML: More than one root element';
                        break;
                    case xpLexer_1.ErrorType.ProcessingInstructionName:
                        msg = "XML: Invalid processing instruction name: '" + tokenValue;
                        break;
                    case xpLexer_1.ErrorType.ElementNestingX:
                        msg = "XML: Unexpected close tag '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.XPathKeyword:
                        msg = "XPath: Found: '" + tokenValue + "' expected keyword or operator";
                        break;
                    case xpLexer_1.ErrorType.XMLName:
                        msg = "XML: Invalid XML name: '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.XMLRootMissing:
                        msg = "XML: Root element is missing";
                        break;
                    case xpLexer_1.ErrorType.XSLTName:
                        msg = "XSLT: Invalid XSLT name: '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.XSLTInstrUnexpected:
                        msg = "XSLT: instruction: " + tokenValue + " not valid in this context";
                        break;
                    case xpLexer_1.ErrorType.DuplicateParameterName:
                        msg = "XSLT: Duplicate parameter name: '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.MissingTemplateParam:
                        var pParts = tokenValue.split('#');
                        msg = "XSLT: xsl:param '" + pParts[1] + "' is not declared for template '" + pParts[0] + "'";
                        break;
                    case xpLexer_1.ErrorType.IterateParamInvalid:
                        msg = "XSLT: param name '" + tokenValue + "' in xsl:with-param is not declared in parent xsl:instruction:";
                        break;
                    case xpLexer_1.ErrorType.TemplateNameUnresolved:
                        msg = "XSLT: xsl:template with name '" + tokenValue + "' not found";
                        break;
                    case xpLexer_1.ErrorType.XSLTFunctionNamePrefix:
                        msg = "XSLT: missing namespace prefox in xsl:function name '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.AttributeSetUnresolved:
                        msg = "XSLT: xsl:attribute-set with name '" + tokenValue + "' not found";
                        break;
                    case xpLexer_1.ErrorType.MissingPrefixInList:
                        msg = "XSLT: Namespace prefix '" + tokenValue + "' is not declared";
                        break;
                    case xpLexer_1.ErrorType.XSLTKeyUnresolved:
                        msg = "XSLT: xsl:key declaration with name '" + tokenValue + "' not found";
                        break;
                    case xpLexer_1.ErrorType.AccumulatorNameUnresolved:
                        msg = "XSLT: xsl:accumulator with name '" + tokenValue + "' not found";
                        break;
                    case xpLexer_1.ErrorType.TemplateModeUnresolved:
                        msg = "XSLT: Template mode '" + tokenValue + "' not used";
                        severity = vscode.DiagnosticSeverity.Warning;
                        break;
                    case xpLexer_1.ErrorType.ParentLessText:
                        msg = "XML: Text found outside root element: '" + tokenValue;
                        break;
                    case xpLexer_1.ErrorType.XSLTNamesapce:
                        msg = "Expected on the root element: xmlns:xsl='http://www.w3.org/1999/XSL/Transform' prefix/namespace-uri binding";
                        break;
                    case xpLexer_1.ErrorType.XSLTPrefix:
                        msg = "XSLT: Undeclared prefix in name: '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.XMLDeclaration:
                        msg = "XML: Invalid content in XML declaration: '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.XPathUnexpected:
                        msg = "XPath: Expression context - unexpected token here: " + tokenValue + " ";
                        break;
                    case xpLexer_1.ErrorType.XPathFunctionUnexpected:
                        msg = "XPath: Unexpected function after expression: '" + tokenValue + "()' ";
                        break;
                    case xpLexer_1.ErrorType.XPathEmpty:
                        msg = 'XSLT: Expected XPath expression';
                        break;
                    case xpLexer_1.ErrorType.XPathName:
                        msg = "XPath: Invalid name: '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.XPathOperatorUnexpected:
                        msg = "XPath: Operator unexpected at this position: '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.XPathAwaiting:
                        msg = "XPath: Expected expression following: '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.DTD:
                        msg = "XML: DTD position error: '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.XPathStringLiteral:
                        msg = "String literal not terminated properly: " + tokenValue;
                        break;
                    case xpLexer_1.ErrorType.XPathFunction:
                        var parts = tokenValue.split('#');
                        msg = "XPath: Function: '" + parts[0] + "' with " + parts[1] + " arguments not found";
                        break;
                    case xpLexer_1.ErrorType.XPathTypeName:
                        msg = "XPath: Invalid type: '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.XPathFunctionNamespace:
                        var partsNs = tokenValue.split('#');
                        msg = "XPath: Undeclared prefix in function: '" + partsNs[0] + "'";
                        break;
                    case xpLexer_1.ErrorType.XPathExpectedComplex:
                        var expected = tokenValue === ':=' ? 'in' : ':=';
                        msg = "XPath: '" + tokenValue + "' is invalid here, expected  '" + expected + "'";
                        break;
                    case xpLexer_1.ErrorType.XPathPrefix:
                        msg = "XPath: Undeclared prefix in name: '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.XMLAttNameSyntax:
                        msg = "XML: Missing whitespace before attribute '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.XMLAttEqualExpected:
                        msg = "XML: Missing '=' after attribute '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.XMLDupllicateAtt:
                        msg = "XML: Attribute '" + tokenValue + "' is a duplicate";
                        break;
                    case xpLexer_1.ErrorType.XMLXMLNS:
                        msg = "XML: Undeclared prefix found for element '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.XMLAttributeName:
                        msg = "XML: Invalid attribute names on element '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.XMLAttributeXMLNS:
                        msg = "XML: Invalid prefix for attribute on element '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.XSLTAttrUnexpected:
                        msg = "XSLT: Invalid attribute on element '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.DuplicateVarName:
                        msg = "XSLT: Duplicate global variable/parameter name: '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.DuplicateFnName:
                        msg = "XSLT: Duplicate function name and arity: '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.DuplicateTemplateName:
                        msg = "XSLT: Duplicate xsl:template name '" + tokenValue + "'";
                        break;
                    case xpLexer_1.ErrorType.DuplicateAccumulatorName:
                        msg = "XSLT: Duplicate xsl:accumulator name '" + tokenValue + "'";
                        break;
                    default:
                        msg = 'Unexepected Error';
                        break;
                }
                if (token.startCharacter > -1 && endChar > -1) {
                    variableRefDiagnostics.push({
                        code: '',
                        message: msg,
                        range: new vscode.Range(new vscode.Position(line, token.startCharacter), new vscode.Position(line, endChar)),
                        severity: severity,
                        tags: diagnosticMetadata,
                        source: ''
                    });
                }
            });
            return variableRefDiagnostics;
        };
        XsltTokenDiagnostics.getMatchingSymbol = function (text) {
            var r = '';
            switch (text) {
                case '(':
                    r = ')';
                    break;
                case '[':
                    r = ']';
                    break;
                case '{':
                    r = '}';
                    break;
                case ')':
                    r = '(';
                    break;
                case ']':
                    r = '[';
                    break;
                case '}':
                    r = '{';
                    break;
                case 'if':
                    r = 'then';
                    break;
                case 'then':
                    r = 'else';
                    break;
                case 'let':
                case 'for':
                    r = 'return';
                    break;
                case 'every':
                case 'some':
                    r = 'satisfies';
                    break;
                case 'else':
                    r = 'then';
                    break;
                default:
                    r = '';
                    break;
            }
            return r;
        };
        XsltTokenDiagnostics.getMatchingToken = function (text) {
            var r = '';
            switch (text) {
                case 'let':
                case 'for':
                    r = 'return';
                    break;
                case 'every':
                case 'some':
                    r = 'satisfies';
                    break;
                case 'then':
                    r = 'else';
            }
            return r;
        };
        XsltTokenDiagnostics.createUnusedVarDiagnostic = function (token) {
            var line = token.line;
            var endChar = token.startCharacter + token.length;
            return {
                code: '',
                message: 'variable is unused',
                range: new vscode.Range(new vscode.Position(line, token.startCharacter), new vscode.Position(line, endChar)),
                severity: vscode.DiagnosticSeverity.Hint,
                tags: [vscode.DiagnosticTag.Unnecessary],
                source: '',
            };
        };
        XsltTokenDiagnostics.createImportDiagnostic = function (data) {
            var token = data.token;
            var line = token.line;
            var endChar = token.startCharacter + token.length;
            return {
                code: '',
                message: "Included/imported file '" + data.name + "' not found",
                range: new vscode.Range(new vscode.Position(line, token.startCharacter), new vscode.Position(line, endChar)),
                severity: vscode.DiagnosticSeverity.Error,
                source: '',
            };
        };
        XsltTokenDiagnostics.createUnresolvedVarDiagnostic = function (document, token, includeOrImport) {
            var line = token.line;
            var endChar = token.startCharacter + token.length;
            if (includeOrImport) {
                return {
                    code: '',
                    message: "XPath: The variable/parameter: " + token.value + " cannot be resolved here, but it may be defined in an external module.",
                    range: new vscode.Range(new vscode.Position(line, token.startCharacter), new vscode.Position(line, endChar)),
                    severity: vscode.DiagnosticSeverity.Warning
                };
            }
            else {
                return {
                    code: '',
                    message: "XPath: The variable/parameter " + token.value + " cannot be resolved",
                    range: new vscode.Range(new vscode.Position(line, token.startCharacter), new vscode.Position(line, endChar)),
                    severity: vscode.DiagnosticSeverity.Error
                };
            }
        };
        XsltTokenDiagnostics.xsltStartTokenNumber = xslLexer_1.XslLexer.getXsltStartTokenNumber();
        XsltTokenDiagnostics.xsltCatchVariables = ['err:code', 'err:description', 'err:value', 'err:module', 'err:line-number', 'err:column-number'];
        XsltTokenDiagnostics.xslInclude = 'xsl:include';
        XsltTokenDiagnostics.xslImport = 'xsl:import';
        XsltTokenDiagnostics.xmlChars = ['lt', 'gt', 'quot', 'apos', 'amp'];
        XsltTokenDiagnostics.xslFunction = 'xsl:function';
        XsltTokenDiagnostics.xslNameAtt = 'name';
        XsltTokenDiagnostics.xslModeAtt = 'mode';
        XsltTokenDiagnostics.useAttSet = 'use-attribute-sets';
        XsltTokenDiagnostics.xslUseAttSet = 'xsl:use-attribute-sets';
        XsltTokenDiagnostics.excludePrefixes = 'exclude-result-prefixes';
        XsltTokenDiagnostics.xslExcludePrefixes = 'xsl:exclude-result-prefixes';
        XsltTokenDiagnostics.brackets = [xpLexer_1.CharLevelState.lB, xpLexer_1.CharLevelState.lBr, xpLexer_1.CharLevelState.lPr, xpLexer_1.CharLevelState.rB, xpLexer_1.CharLevelState.rBr, xpLexer_1.CharLevelState.rPr];
        XsltTokenDiagnostics.nameStartCharRgx = new RegExp(/[A-Z]|_|[a-z]|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]/);
        XsltTokenDiagnostics.nameCharRgx = new RegExp(/-|\.|[0-9]|\u00B7|[\u0300-\u036F]|[\u203F-\u2040]|[A-Z]|_|[a-z]|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]/);
        XsltTokenDiagnostics.calculateDiagnostics = function (languageConfig, docType, document, allTokens, globalInstructionData, importedInstructionData, symbols) {
            var lineNumber = -1;
            var xslVariable = languageConfig.variableElementNames;
            var inScopeVariablesList = [];
            var xpathVariableCurrentlyBeingDefined;
            var elementStack = [];
            var inScopeXPathVariablesList = [];
            var anonymousFunctionParamList = [];
            var xpathStack = [];
            var tagType = TagType.NonStart;
            var attType = AttributeType.None;
            var tagElementName = '';
            var tagElementAttributes = [];
            var tagElementChildren = [];
            var startTagToken = null;
            var preXPathVariable = false;
            var anonymousFunctionParams = false;
            var variableData = null;
            var xsltVariableDeclarations = [];
            var unresolvedXsltVariableReferences = [];
            var prevToken = null;
            var includeOrImport = false;
            var problemTokens = [];
            var topLevelSymbols = symbols;
            var tagIdentifierName = '';
            var lastTokenIndex = allTokens.length - 1;
            var tagAttributeNames = [];
            var tagAttributeSymbols = [];
            var tagXmlnsNames = [];
            var rootXmlnsBindings = [];
            var inheritedPrefixes = [];
            var globalVariableData = [];
            var checkedGlobalVarNames = [];
            var checkedGlobalFnNames = [];
            var importedGlobalVarNames = [];
            var importedGlobalFnNames = [];
            var incrementFunctionArity = false;
            var onRootStartTag = true;
            var rootXmlnsName = null;
            var xsltPrefixesToURIs = new Map();
            var isXMLDeclaration = false;
            var dtdStarted = false;
            var dtdEnded = false;
            var namedTemplates = new Map();
            var globalModes = ['#current', '#default'];
            var globalKeys = [];
            var globalAccumulatorNames = [];
            var globalAttributeSetNames = [];
            var tagExcludeResultPrefixes = null;
            var ifThenStack = [];
            var currentXSLTIterateParams = [];
            var schemaQuery = languageConfig.schemaData ? new schemaQuery_1.SchemaQuery(languageConfig.schemaData) : undefined;
            var xsltSchemaQuery;
            var isSchematron = docType === xslLexer_1.DocumentTypes.SCH;
            var pendingTemplateParamErrors = [];
            if (isSchematron && languageConfigurations_1.XSLTConfiguration.configuration.schemaData) {
                xsltSchemaQuery = new schemaQuery_1.SchemaQuery(languageConfigurations_1.XSLTConfiguration.configuration.schemaData);
            }
            globalInstructionData.forEach(function (instruction) {
                switch (instruction.type) {
                    case xslLexer_1.GlobalInstructionType.Variable:
                    case xslLexer_1.GlobalInstructionType.Parameter:
                        if (checkedGlobalVarNames.indexOf(instruction.name) < 0) {
                            checkedGlobalVarNames.push(instruction.name);
                        }
                        else {
                            instruction.token['error'] = xpLexer_1.ErrorType.DuplicateVarName;
                            instruction.token.value = instruction.name;
                            problemTokens.push(instruction.token);
                        }
                        globalVariableData.push({ token: instruction.token, name: instruction.name });
                        xsltVariableDeclarations.push(instruction.token);
                        break;
                    case xslLexer_1.GlobalInstructionType.Function:
                        var functionNameWithArity = instruction.name + '#' + instruction.idNumber;
                        if (checkedGlobalFnNames.indexOf(functionNameWithArity) < 0) {
                            checkedGlobalFnNames.push(functionNameWithArity);
                        }
                        else {
                            instruction.token['error'] = xpLexer_1.ErrorType.DuplicateFnName;
                            instruction.token.value = functionNameWithArity;
                            problemTokens.push(instruction.token);
                        }
                        break;
                    case xslLexer_1.GlobalInstructionType.Template:
                        if (namedTemplates.get(instruction.name)) {
                            instruction.token['error'] = xpLexer_1.ErrorType.DuplicateTemplateName;
                            instruction.token.value = instruction.name;
                            problemTokens.push(instruction.token);
                        }
                        else {
                            var members = instruction.memberNames ? instruction.memberNames : [];
                            namedTemplates.set(instruction.name, members);
                        }
                        break;
                    case xslLexer_1.GlobalInstructionType.Mode:
                        var modes = instruction.name.split(/\s+/);
                        globalModes = globalModes.concat(modes);
                        break;
                    case xslLexer_1.GlobalInstructionType.Key:
                        globalKeys.push(instruction.name);
                        break;
                    case xslLexer_1.GlobalInstructionType.Accumulator:
                        if (globalAccumulatorNames.indexOf(instruction.name) < 0) {
                            globalAccumulatorNames.push(instruction.name);
                        }
                        else {
                            instruction.token['error'] = xpLexer_1.ErrorType.DuplicateAccumulatorName;
                            instruction.token.value = instruction.name;
                            problemTokens.push(instruction.token);
                        }
                        break;
                    case xslLexer_1.GlobalInstructionType.AttributeSet:
                        globalAttributeSetNames.push(instruction.name);
                        break;
                    case xslLexer_1.GlobalInstructionType.RootXMLNS:
                        if (docType === xslLexer_1.DocumentTypes.XPath) {
                            inheritedPrefixes.push(instruction.name);
                        }
                        break;
                }
            });
            importedInstructionData.forEach(function (instruction) {
                switch (instruction.type) {
                    case xslLexer_1.GlobalInstructionType.Variable:
                    case xslLexer_1.GlobalInstructionType.Parameter:
                        if (checkedGlobalVarNames.indexOf(instruction.name) < 0) {
                            checkedGlobalVarNames.push(instruction.name);
                            importedGlobalVarNames.push(instruction.name);
                        }
                        break;
                    case xslLexer_1.GlobalInstructionType.Function:
                        var functionNameWithArity = instruction.name + '#' + instruction.idNumber;
                        if (checkedGlobalFnNames.indexOf(functionNameWithArity) < 0) {
                            checkedGlobalFnNames.push(functionNameWithArity);
                            importedGlobalFnNames.push(functionNameWithArity);
                        }
                        break;
                    case xslLexer_1.GlobalInstructionType.Template:
                        var members = instruction.memberNames ? instruction.memberNames : [];
                        namedTemplates.set(instruction.name, members);
                        break;
                    case xslLexer_1.GlobalInstructionType.Mode:
                        var modes = instruction.name.split(/\s+/);
                        globalModes = globalModes.concat(modes);
                        break;
                    case xslLexer_1.GlobalInstructionType.Key:
                        globalKeys.push(instruction.name);
                        break;
                    case xslLexer_1.GlobalInstructionType.Accumulator:
                        globalAccumulatorNames.push(instruction.name);
                        break;
                    case xslLexer_1.GlobalInstructionType.AttributeSet:
                        globalAttributeSetNames.push(instruction.name);
                        break;
                }
            });
            if (docType === xslLexer_1.DocumentTypes.XPath) {
                xsltPrefixesToURIs.set('array', functionData_1.XSLTnamespaces.Array);
                xsltPrefixesToURIs.set('map', functionData_1.XSLTnamespaces.Map);
                xsltPrefixesToURIs.set('math', functionData_1.XSLTnamespaces.Map);
                xsltPrefixesToURIs.set('xs', functionData_1.XSLTnamespaces.XMLSchema);
                xsltPrefixesToURIs.set('fn', functionData_1.XSLTnamespaces.XPath);
                xsltPrefixesToURIs.set('xsl', functionData_1.XSLTnamespaces.XSLT);
                xsltPrefixesToURIs.set('ixsl', functionData_1.XSLTnamespaces.IXSL);
                inheritedPrefixes = inheritedPrefixes.concat(['array', 'map', 'math', 'xs', 'fn', 'xsl', 'ixsl']);
            }
            allTokens.forEach(function (token, index) {
                var _a, _b, _c, _d;
                var _e, _f;
                lineNumber = token.line;
                var isXMLToken = token.tokenType >= XsltTokenDiagnostics.xsltStartTokenNumber;
                if (isXMLToken) {
                    if (ifThenStack.length > 0) {
                        var ifToken = ifThenStack[0];
                        ifToken['error'] = xpLexer_1.ErrorType.BracketNesting;
                        problemTokens.push(ifToken);
                        ifThenStack = [];
                    }
                    if (prevToken && prevToken.tokenType === xpLexer_1.TokenLevelState.operator && !prevToken.error) {
                        XsltTokenDiagnostics.checkFinalXPathToken(prevToken, allTokens, index, problemTokens);
                    }
                    else if (prevToken && prevToken.tokenType === xpLexer_1.TokenLevelState.complexExpression && !prevToken.error) {
                        prevToken['error'] = xpLexer_1.ErrorType.XPathAwaiting;
                        problemTokens.push(prevToken);
                    }
                    inScopeXPathVariablesList = [];
                    xpathVariableCurrentlyBeingDefined = false;
                    if (xpathStack.length > 0) {
                        // report last issue with nesting in each xpath:
                        var errorToken = void 0;
                        for (var index_1 = xpathStack.length - 1; index_1 > -1; index_1--) {
                            var trailingToken = xpathStack[index_1].token;
                            var tv = trailingToken.value;
                            var allowedToken = (tv === 'return' || tv === 'else' || tv === 'satisfies');
                            if (!allowedToken) {
                                errorToken = trailingToken;
                                break;
                            }
                        }
                        if (errorToken) {
                            errorToken['error'] = xpLexer_1.ErrorType.BracketNesting;
                            problemTokens.push(errorToken);
                        }
                    }
                    xpathStack = [];
                    preXPathVariable = false;
                    var xmlCharType = token.charType;
                    var xmlTokenType = (token.tokenType - XsltTokenDiagnostics.xsltStartTokenNumber);
                    switch (xmlTokenType) {
                        case xslLexer_1.XSLTokenLevelState.xmlText:
                            if (elementStack.length === 0 && token.startCharacter > -1) {
                                var tValue = XsltTokenDiagnostics.getTextForToken(lineNumber, token, document);
                                if (tValue.trim().length !== 0) {
                                    token['error'] = xpLexer_1.ErrorType.ParentLessText;
                                    token['value'] = tValue;
                                    problemTokens.push(token);
                                }
                            }
                            break;
                        case xslLexer_1.XSLTokenLevelState.xslElementName:
                            // this is xslt or schematron element
                            pendingTemplateParamErrors = [];
                            tagElementName = XsltTokenDiagnostics.getTextForToken(lineNumber, token, document);
                            var isXsltElementName = tagElementName.startsWith('xsl:');
                            var isSchElementName = tagElementName.startsWith('sch:');
                            var lookupElementName = isSchematron && !isXsltElementName && !isSchElementName ? 'sch:' + tagElementName : tagElementName;
                            var realSchemaQuery = xsltSchemaQuery && tagElementName.startsWith('xsl:') ? xsltSchemaQuery : schemaQuery;
                            _a = XsltTokenDiagnostics.getExpectedElementNames(lookupElementName, realSchemaQuery, elementStack), tagElementChildren = _a[0], tagElementAttributes = _a[1];
                            if (tagType === TagType.Start) {
                                if (tagElementName === 'xsl:iterate') {
                                    currentXSLTIterateParams.push([]);
                                }
                                tagType = (xslVariable.indexOf(tagElementName) > -1) ? TagType.XSLTvar : TagType.XSLTstart;
                                var xsltToken = token;
                                xsltToken['tagType'] = tagType;
                                startTagToken = token;
                                if (!includeOrImport && tagType !== TagType.XSLTvar && elementStack.length === 1) {
                                    includeOrImport = tagElementName === XsltTokenDiagnostics.xslImport || tagElementName === XsltTokenDiagnostics.xslInclude;
                                }
                                if (!onRootStartTag && elementStack.length === 0) {
                                    token['error'] = xpLexer_1.ErrorType.MultiRoot;
                                    token['value'] = tagElementName;
                                    problemTokens.push(token);
                                }
                            }
                            break;
                        case xslLexer_1.XSLTokenLevelState.elementName:
                            tagElementName = XsltTokenDiagnostics.getTextForToken(lineNumber, token, document);
                            if (isSchematron || tagElementName.startsWith('ixsl:')) {
                                // this must be an xsl element
                                _b = XsltTokenDiagnostics.getExpectedElementNames(tagElementName, xsltSchemaQuery, elementStack), tagElementChildren = _b[0], tagElementAttributes = _b[1];
                            }
                            if (tagType === TagType.Start) {
                                tagType = TagType.XMLstart;
                                startTagToken = token;
                                if (!onRootStartTag && elementStack.length === 0) {
                                    token['error'] = xpLexer_1.ErrorType.MultiRoot;
                                    token['value'] = tagElementName;
                                    problemTokens.push(token);
                                }
                            }
                            break;
                        case xslLexer_1.XSLTokenLevelState.xmlPunctuation:
                            switch (xmlCharType) {
                                case xslLexer_1.XMLCharState.lSt:
                                    tagAttributeNames = [];
                                    tagAttributeSymbols = [];
                                    tagXmlnsNames = [];
                                    tagIdentifierName = '';
                                    variableData = null;
                                    tagElementName = '';
                                    tagExcludeResultPrefixes = null;
                                    tagType = TagType.Start;
                                    break;
                                case xslLexer_1.XMLCharState.rStNoAtt:
                                case xslLexer_1.XMLCharState.rSt:
                                case xslLexer_1.XMLCharState.rSelfCt:
                                case xslLexer_1.XMLCharState.rSelfCtNoAtt:
                                    // start-tag ended, we're now within the new element scope:
                                    if (docType === xslLexer_1.DocumentTypes.XSLT && onRootStartTag) {
                                        rootXmlnsBindings.forEach(function (prefixNsPair) {
                                            var pfx = prefixNsPair[0];
                                            var namespaceURI = prefixNsPair[1];
                                            var xsltType = functionData_1.FunctionData.namespaces.get(namespaceURI);
                                            if (xsltType !== undefined) {
                                                xsltPrefixesToURIs.set(pfx, xsltType);
                                            }
                                        });
                                        if (xsltPrefixesToURIs.get('xsl') !== functionData_1.XSLTnamespaces.XSLT) {
                                            if (startTagToken !== null) {
                                                startTagToken['error'] = xpLexer_1.ErrorType.XSLTNamesapce;
                                                problemTokens.push(startTagToken);
                                            }
                                        }
                                    }
                                    onRootStartTag = false;
                                    var orginalPrefixes = inheritedPrefixes.slice();
                                    var problem = false;
                                    if (tagExcludeResultPrefixes) {
                                        var missingPrefix = void 0;
                                        if (!(tagExcludeResultPrefixes.prefixes.length === 1 && tagExcludeResultPrefixes.prefixes[0] === '#all')) {
                                            missingPrefix = tagExcludeResultPrefixes.prefixes.find(function (pfx) {
                                                if (pfx !== '#default' && inheritedPrefixes.indexOf(pfx) < 0)
                                                    return pfx;
                                            });
                                        }
                                        if (missingPrefix) {
                                            var xToken = tagExcludeResultPrefixes.token;
                                            xToken['error'] = xpLexer_1.ErrorType.MissingPrefixInList;
                                            xToken.value = missingPrefix;
                                            problemTokens.push(tagExcludeResultPrefixes.token);
                                            problem = true;
                                        }
                                    }
                                    var attsWithXmlnsErrors_1 = [];
                                    var attsWithNameErrors_1 = [];
                                    var xsltAttsWithNameErrors_1 = [];
                                    var attrValType_1 = tagElementName.startsWith('xsl:') ? ValidationType.XSLTAttribute : ValidationType.XMLAttribute;
                                    var tunnelAttributeFound_1 = false;
                                    var checkPendingErrors_1 = pendingTemplateParamErrors.length !== 0;
                                    tagAttributeNames.forEach(function (attName) {
                                        if (checkPendingErrors_1 && !tunnelAttributeFound_1) {
                                            tunnelAttributeFound_1 = attName === 'tunnel';
                                        }
                                        var validateResult = XsltTokenDiagnostics.validateName(attName, attrValType_1, isSchematron, inheritedPrefixes, elementStack, tagElementAttributes);
                                        if (validateResult === NameValidationError.NameError) {
                                            attsWithNameErrors_1.push(attName);
                                        }
                                        else if (validateResult === NameValidationError.NamespaceError) {
                                            attsWithXmlnsErrors_1.push(attName);
                                        }
                                        else if (validateResult === NameValidationError.XSLTAttributeNameError) {
                                            xsltAttsWithNameErrors_1.push(attName);
                                        }
                                    });
                                    if (checkPendingErrors_1 && !tunnelAttributeFound_1) {
                                        pendingTemplateParamErrors.forEach(function (item) { return problemTokens.push(item); });
                                    }
                                    pendingTemplateParamErrors = [];
                                    if (startTagToken && !problem) {
                                        var validationError = XsltTokenDiagnostics.validateName(tagElementName, ValidationType.XMLElement, isSchematron, inheritedPrefixes, elementStack);
                                        if (validationError !== NameValidationError.None) {
                                            startTagToken['error'] = validationError === NameValidationError.NameError ? xpLexer_1.ErrorType.XMLName : validationError === NameValidationError.NamespaceError ? xpLexer_1.ErrorType.XMLXMLNS : xpLexer_1.ErrorType.XSLTInstrUnexpected;
                                            startTagToken['value'] = tagElementName;
                                            problemTokens.push(startTagToken);
                                        }
                                        else if (attsWithNameErrors_1.length > 0) {
                                            startTagToken['error'] = xpLexer_1.ErrorType.XMLAttributeName;
                                            startTagToken['value'] = tagElementName + '\': \'' + attsWithNameErrors_1.join('\', ');
                                            problemTokens.push(startTagToken);
                                        }
                                        else if (attsWithXmlnsErrors_1.length > 0) {
                                            startTagToken['error'] = xpLexer_1.ErrorType.XMLAttributeXMLNS;
                                            startTagToken['value'] = tagElementName + '\': \'' + attsWithXmlnsErrors_1.join('\', ');
                                            problemTokens.push(startTagToken);
                                        }
                                        else if (xsltAttsWithNameErrors_1.length > 0) {
                                            startTagToken['error'] = xpLexer_1.ErrorType.XSLTAttrUnexpected;
                                            startTagToken['value'] = tagElementName + '\': \'' + xsltAttsWithNameErrors_1.join('\', ');
                                            problemTokens.push(startTagToken);
                                        }
                                    }
                                    if (xmlCharType === xslLexer_1.XMLCharState.rStNoAtt || xmlCharType === xslLexer_1.XMLCharState.rSt) {
                                        // on a start tag
                                        if (tagElementName === 'xsl:accumulator') {
                                            inScopeVariablesList.push({ token: token, name: 'value' });
                                        }
                                        else if (tagElementName === 'xsl:catch') {
                                            XsltTokenDiagnostics.xsltCatchVariables.forEach(function (catchVar) {
                                                inScopeVariablesList.push({ token: token, name: catchVar });
                                            });
                                        }
                                        var inheritedPrefixesCopy = inheritedPrefixes.slice();
                                        // if top-level element add global variables - these include following variables also:
                                        var newVariablesList = elementStack.length === 0 ? globalVariableData : inScopeVariablesList;
                                        var stackElementChildren = isSchematron ? tagElementChildren : attrValType_1 === ValidationType.XMLAttribute && elementStack.length > 0 ? elementStack[elementStack.length - 1].expectedChildElements : tagElementChildren;
                                        //let newVariablesList = inScopeVariablesList;
                                        var childSymbols = XsltTokenDiagnostics.initChildrenSymbols(tagAttributeSymbols);
                                        if (variableData !== null) {
                                            if (elementStack.length > 1) {
                                                xsltVariableDeclarations.push(variableData.token);
                                            }
                                            if (startTagToken) {
                                                // if a top-level element, use global variables instad of inScopeVariablesList;
                                                elementStack.push({
                                                    namespacePrefixes: inheritedPrefixesCopy, currentVariable: variableData, variables: newVariablesList,
                                                    symbolName: tagElementName, symbolID: tagIdentifierName, identifierToken: startTagToken, childSymbols: childSymbols, expectedChildElements: stackElementChildren
                                                });
                                            }
                                        }
                                        else if (startTagToken) {
                                            elementStack.push({ namespacePrefixes: inheritedPrefixesCopy, variables: newVariablesList, symbolName: tagElementName, symbolID: tagIdentifierName, identifierToken: startTagToken, childSymbols: childSymbols, expectedChildElements: stackElementChildren });
                                        }
                                        inScopeVariablesList = [];
                                        newVariablesList = [];
                                        tagType = TagType.NonStart;
                                    }
                                    else {
                                        // self-closed tag: xmlns declarations on this are no longer in scope
                                        inheritedPrefixes = orginalPrefixes;
                                        if (variableData !== null) {
                                            if (elementStack.length > 1) {
                                                if (docType === xslLexer_1.DocumentTypes.DCP) {
                                                    importedGlobalVarNames.push(variableData.name);
                                                    globalVariableData.push(variableData);
                                                }
                                                else {
                                                    inScopeVariablesList.push(variableData);
                                                }
                                                xsltVariableDeclarations.push(variableData.token);
                                            }
                                            else {
                                                inScopeVariablesList = [];
                                            }
                                        }
                                        if (startTagToken) {
                                            var symbol = XsltTokenDiagnostics.createSymbolFromElementTokens(tagElementName, tagIdentifierName, startTagToken, token);
                                            if (symbol !== null) {
                                                var childSymbols = XsltTokenDiagnostics.initChildrenSymbols(tagAttributeSymbols);
                                                symbol.children = childSymbols;
                                                if (elementStack.length > 0) {
                                                    elementStack[elementStack.length - 1].childSymbols.push(symbol);
                                                }
                                                else {
                                                    topLevelSymbols.push(symbol);
                                                }
                                            }
                                        }
                                    }
                                    break;
                                case xslLexer_1.XMLCharState.rCt:
                                    // end of an element close-tag:
                                    if (elementStack.length > 0) {
                                        var poppedData = elementStack.pop();
                                        if (tagElementName === 'xsl:iterate' && currentXSLTIterateParams.length > 0) {
                                            currentXSLTIterateParams.pop();
                                        }
                                        if (poppedData) {
                                            if (poppedData.symbolName !== tagElementName) {
                                                var errorToken = Object.assign({}, poppedData.identifierToken);
                                                errorToken['error'] = xpLexer_1.ErrorType.ElementNesting;
                                                errorToken['value'] = poppedData.symbolName;
                                                problemTokens.push(errorToken);
                                                if (prevToken) {
                                                    prevToken['error'] = xpLexer_1.ErrorType.ElementNestingX;
                                                    prevToken['value'] = tagElementName;
                                                    problemTokens.push(prevToken);
                                                }
                                                // not well-nested
                                                if (elementStack.length > 0 && elementStack[elementStack.length - 1].symbolName === tagElementName) {
                                                    // recover for benefit of outline view
                                                    poppedData = elementStack.pop();
                                                }
                                            }
                                        }
                                        if (poppedData) {
                                            inheritedPrefixes = poppedData.namespacePrefixes.slice();
                                            var symbol = XsltTokenDiagnostics.createSymbolFromElementTokens(poppedData.symbolName, poppedData.symbolID, poppedData.identifierToken, token);
                                            if (symbol !== null) {
                                                symbol.children = poppedData.childSymbols;
                                                // the parent symbol hasn't yet been created, but the elementStack parent is now the top item
                                                if (elementStack.length > 0) {
                                                    elementStack[elementStack.length - 1].childSymbols.push(symbol);
                                                }
                                                else {
                                                    topLevelSymbols.push(symbol);
                                                }
                                            }
                                            inScopeVariablesList = (poppedData) ? poppedData.variables : [];
                                            if (poppedData.currentVariable) {
                                                if (docType === xslLexer_1.DocumentTypes.DCP) {
                                                    importedGlobalVarNames.push(poppedData.currentVariable.name);
                                                    globalVariableData.push(poppedData.currentVariable);
                                                }
                                                else if (elementStack.length > 1) {
                                                    // reset inscope variables - unless at global-variable stack-level
                                                    inScopeVariablesList.push(poppedData.currentVariable);
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        var errToken = (prevToken) ? prevToken : token;
                                        errToken['error'] = xpLexer_1.ErrorType.ElementNestingX;
                                        errToken['value'] = tagElementName;
                                        problemTokens.push(errToken);
                                    }
                                    break;
                                case xslLexer_1.XMLCharState.rPi:
                                    isXMLDeclaration = false;
                                    break;
                            }
                            break;
                        case xslLexer_1.XSLTokenLevelState.attributeName:
                        case xslLexer_1.XSLTokenLevelState.xmlnsName:
                            rootXmlnsName = null;
                            var attNameText = XsltTokenDiagnostics.getTextForToken(lineNumber, token, document);
                            var problemReported = false;
                            if (prevToken) {
                                if (token.line === prevToken.line && token.startCharacter - (prevToken.startCharacter + prevToken.length) === 0) {
                                    problemReported = true;
                                    token['error'] = xpLexer_1.ErrorType.XMLAttNameSyntax;
                                    token['value'] = attNameText;
                                    problemTokens.push(token);
                                }
                            }
                            if (!problemReported && token.charType === xslLexer_1.XMLCharState.syntaxError && prevToken && !prevToken.error) {
                                problemReported = true;
                                prevToken['error'] = xpLexer_1.ErrorType.XMLAttEqualExpected;
                                prevToken['value'] = XsltTokenDiagnostics.getTextForToken(prevToken.line, prevToken, document);
                                problemTokens.push(prevToken);
                            }
                            if (!problemReported) {
                                if (xmlTokenType === xslLexer_1.XSLTokenLevelState.xmlnsName) {
                                    if (tagXmlnsNames.indexOf(attNameText) > -1) {
                                        token['error'] = xpLexer_1.ErrorType.XMLDupllicateAtt;
                                        token['value'] = attNameText;
                                        problemTokens.push(token);
                                    }
                                    tagXmlnsNames.push(attNameText);
                                    if (attNameText.length > 6) {
                                        var prefix = attNameText.substring(6);
                                        if (inheritedPrefixes.indexOf(prefix) < 0) {
                                            inheritedPrefixes.push(prefix);
                                        }
                                        if (prefix === 'ixsl') {
                                            if (schemaQuery) {
                                                schemaQuery.useIxsl = true;
                                            }
                                            if (xsltSchemaQuery) {
                                                xsltSchemaQuery.useIxsl = true;
                                            }
                                        }
                                    }
                                    if (onRootStartTag) {
                                        rootXmlnsName = attNameText;
                                    }
                                }
                                else {
                                    if (tagAttributeNames.indexOf(attNameText) > -1) {
                                        token['error'] = xpLexer_1.ErrorType.XMLDupllicateAtt;
                                        token['value'] = attNameText;
                                        problemTokens.push(token);
                                    }
                                    tagAttributeSymbols.push(XsltTokenDiagnostics.createSymbolForAttribute(token, attNameText));
                                    tagAttributeNames.push(attNameText);
                                }
                            }
                            if (tagType === TagType.XSLTvar) {
                                attType = attNameText === XsltTokenDiagnostics.xslNameAtt ? AttributeType.Variable : AttributeType.None;
                            }
                            else if (tagType === TagType.XSLTstart) {
                                if (docType === xslLexer_1.DocumentTypes.DCP && (attNameText === 'parameterRef' || attNameText === 'if' || attNameText === 'unless')) {
                                    attType = AttributeType.VariableRef;
                                }
                                else if (attNameText === XsltTokenDiagnostics.xslNameAtt) {
                                    attType = AttributeType.InstructionName;
                                }
                                else if (attNameText === XsltTokenDiagnostics.xslModeAtt) {
                                    attType = AttributeType.InstructionMode;
                                }
                                else if (attNameText === XsltTokenDiagnostics.useAttSet) {
                                    attType = AttributeType.UseAttributeSets;
                                }
                                else if (attNameText === XsltTokenDiagnostics.excludePrefixes || attNameText === XsltTokenDiagnostics.xslExcludePrefixes) {
                                    attType = AttributeType.ExcludeResultPrefixes;
                                }
                                else {
                                    attType = AttributeType.None;
                                }
                            }
                            else if (attNameText === XsltTokenDiagnostics.xslUseAttSet) {
                                attType = AttributeType.UseAttributeSets;
                            }
                            break;
                        case xslLexer_1.XSLTokenLevelState.attributeValue:
                            var fullVariableName = XsltTokenDiagnostics.getTextForToken(lineNumber, token, document);
                            if (tagAttributeSymbols.length > 0) {
                                if (fullVariableName.length !== 1) {
                                    tagAttributeSymbols[tagAttributeSymbols.length - 1].detail = fullVariableName;
                                }
                                else {
                                    tagAttributeSymbols[tagAttributeSymbols.length - 1].kind = vscode.SymbolKind.Event;
                                }
                            }
                            var variableName = fullVariableName.substring(1, fullVariableName.length - 1);
                            var hasProblem = false;
                            if (rootXmlnsName !== null) {
                                var prefix = rootXmlnsName.length === 5 ? '' : rootXmlnsName.substr(6);
                                rootXmlnsBindings.push([prefix, variableName]);
                            }
                            switch (attType) {
                                case AttributeType.Variable:
                                    tagIdentifierName = variableName;
                                    if (elementStack.length > 2) {
                                        var parentElemmentName = elementStack[elementStack.length - 1].symbolName;
                                        if (parentElemmentName === 'xsl:iterate') {
                                            currentXSLTIterateParams[currentXSLTIterateParams.length - 1].push(variableName);
                                        }
                                    }
                                    variableData = { token: token, name: variableName };
                                    break;
                                case AttributeType.VariableRef:
                                    var unResolvedToken = XsltTokenDiagnostics.resolveXPathVariableReference('', document, importedGlobalVarNames, token, xpathVariableCurrentlyBeingDefined, inScopeXPathVariablesList, xpathStack, inScopeVariablesList, elementStack);
                                    if (unResolvedToken !== null) {
                                        unresolvedXsltVariableReferences.push(unResolvedToken);
                                    }
                                    break;
                                case AttributeType.InstructionName:
                                    var slashPos = variableName.lastIndexOf('/');
                                    if (slashPos > 0) {
                                        // package name may be URI
                                        variableName = variableName.substring(slashPos + 1);
                                    }
                                    tagIdentifierName = variableName;
                                    break;
                                case AttributeType.InstructionMode:
                                    if (tagIdentifierName === '') {
                                        tagIdentifierName = variableName;
                                    }
                                    break;
                                case AttributeType.ExcludeResultPrefixes:
                                    var excludePrefixes = variableName.split(/\s+/);
                                    tagExcludeResultPrefixes = { token: token, prefixes: excludePrefixes };
                                    break;
                                case AttributeType.None:
                                    if (prevToken && prevToken.length === 1 && prevToken.tokenType === XsltTokenDiagnostics.xsltStartTokenNumber + xslLexer_1.XSLTokenLevelState.attributeValue) {
                                        token['error'] = xpLexer_1.ErrorType.XPathEmpty;
                                    }
                                    break;
                            }
                            if (token.error) {
                                problemTokens.push(token);
                                hasProblem = true;
                            }
                            if (!hasProblem && attType === AttributeType.UseAttributeSets) {
                                if (globalAttributeSetNames.indexOf(variableName) < 0 && variableName !== 'xsl:original') {
                                    token['error'] = xpLexer_1.ErrorType.AttributeSetUnresolved;
                                    token.value = variableName;
                                    problemTokens.push(token);
                                    hasProblem = true;
                                }
                            }
                            if (!hasProblem && attType === AttributeType.InstructionName && tagElementName === 'xsl:call-template') {
                                if (!namedTemplates.get(variableName)) {
                                    token['error'] = xpLexer_1.ErrorType.TemplateNameUnresolved;
                                    token.value = variableName;
                                    problemTokens.push(token);
                                    hasProblem = true;
                                }
                            }
                            if (!hasProblem && attType === AttributeType.InstructionName && tagElementName === 'xsl:function') {
                                if (!variableName.includes(':')) {
                                    token['error'] = xpLexer_1.ErrorType.XSLTFunctionNamePrefix;
                                    token.value = variableName;
                                    problemTokens.push(token);
                                    hasProblem = true;
                                }
                            }
                            if (!hasProblem && attType === AttributeType.InstructionMode && tagElementName === 'xsl:apply-templates') {
                                if (globalModes.indexOf(variableName) < 0) {
                                    token['error'] = xpLexer_1.ErrorType.TemplateModeUnresolved;
                                    token.value = variableName;
                                    problemTokens.push(token);
                                    hasProblem = true;
                                }
                            }
                            if (!hasProblem && attType === AttributeType.InstructionName && elementStack.length > 0 && tagElementName === 'xsl:with-param') {
                                var callTemplateName = elementStack[elementStack.length - 1].symbolID;
                                var templateParams = namedTemplates.get(callTemplateName);
                                if (templateParams) {
                                    if ((templateParams === null || templateParams === void 0 ? void 0 : templateParams.indexOf(variableName)) < 0) {
                                        token['error'] = xpLexer_1.ErrorType.MissingTemplateParam;
                                        token.value = callTemplateName + "#" + variableName;
                                        pendingTemplateParamErrors.push(token);
                                    }
                                }
                                else if (currentXSLTIterateParams.length > 0 && elementStack.length > 2 && elementStack[elementStack.length - 1].symbolName === 'xsl:next-iteration') {
                                    var params = currentXSLTIterateParams[currentXSLTIterateParams.length - 1];
                                    if (params.indexOf(variableName) < 0) {
                                        token['error'] = xpLexer_1.ErrorType.IterateParamInvalid;
                                        token.value = variableName;
                                        problemTokens.push(token);
                                        hasProblem = true;
                                    }
                                }
                            }
                            if (!hasProblem && attType === AttributeType.Variable || attType === AttributeType.InstructionName) {
                                if (!fullVariableName.includes('{')) {
                                    var vType = tagElementName.endsWith(':attribute') ? ValidationType.XMLAttribute : ValidationType.PrefixedName;
                                    var validateResult = XsltTokenDiagnostics.validateName(variableName, vType, isSchematron, inheritedPrefixes);
                                    if (validateResult !== NameValidationError.None) {
                                        token['error'] = validateResult === NameValidationError.NameError ? xpLexer_1.ErrorType.XSLTName : xpLexer_1.ErrorType.XSLTPrefix;
                                        token['value'] = fullVariableName;
                                        problemTokens.push(token);
                                    }
                                }
                            }
                            attType = AttributeType.None;
                            break;
                        case xslLexer_1.XSLTokenLevelState.processingInstrName:
                            var piName = XsltTokenDiagnostics.getTextForToken(lineNumber, token, document);
                            var validPiName = true;
                            if (piName.toLowerCase() === 'xml') {
                                if (lineNumber !== 0) {
                                    validPiName = false;
                                }
                                else {
                                    isXMLDeclaration = true;
                                }
                            }
                            else {
                                var validateResult = XsltTokenDiagnostics.validateName(piName, ValidationType.Name, isSchematron, inheritedPrefixes);
                                validPiName = validateResult === NameValidationError.None;
                            }
                            if (!validPiName) {
                                token['error'] = xpLexer_1.ErrorType.ProcessingInstructionName;
                                token['value'] = piName;
                                problemTokens.push(token);
                            }
                            break;
                        case xslLexer_1.XSLTokenLevelState.entityRef:
                            var entityName = XsltTokenDiagnostics.getTextForToken(lineNumber, token, document);
                            var validationResult = void 0;
                            if (token.error) {
                                problemTokens.push(token);
                            }
                            else {
                                (_c = XsltTokenDiagnostics.validateEntityRef(entityName, dtdEnded, inheritedPrefixes), validationResult = _c.validationResult, entityName = _c.entityName);
                                if (validationResult !== NameValidationError.None) {
                                    token['error'] = xpLexer_1.ErrorType.EntityName;
                                    token['value'] = entityName;
                                    problemTokens.push(token);
                                }
                            }
                        case xslLexer_1.XSLTokenLevelState.processingInstrValue:
                            if (isXMLDeclaration) {
                                XsltTokenDiagnostics.validateXMLDeclaration(lineNumber, token, document, problemTokens);
                            }
                            break;
                        case xslLexer_1.XSLTokenLevelState.dtdEnd:
                            if (dtdEnded) {
                                var endDtd = XsltTokenDiagnostics.getTextForToken(lineNumber, token, document);
                                token['error'] = xpLexer_1.ErrorType.DTD;
                                token['value'] = endDtd;
                                problemTokens.push(token);
                            }
                            dtdEnded = true;
                            break;
                        case xslLexer_1.XSLTokenLevelState.dtd:
                            if (onRootStartTag && !dtdEnded) {
                                dtdStarted = true;
                            }
                            else {
                                var dtdValue = XsltTokenDiagnostics.getTextForToken(lineNumber, token, document);
                                token['error'] = xpLexer_1.ErrorType.DTD;
                                token['value'] = dtdValue;
                                problemTokens.push(token);
                            }
                            break;
                    }
                    if (index === lastTokenIndex) {
                        if (onRootStartTag) {
                            var errorToken = Object.assign({}, token);
                            errorToken['error'] = xpLexer_1.ErrorType.XMLRootMissing;
                            problemTokens.push(errorToken);
                        }
                    }
                }
                else {
                    var xpathCharType = token.charType;
                    var xpathTokenType = token.tokenType;
                    if (xpathStack.length > 0) {
                        var tv = xpathStack[xpathStack.length - 1].token.value;
                        if ((prevToken === null || prevToken === void 0 ? void 0 : prevToken.charType) === xpLexer_1.CharLevelState.sep && prevToken.value === ',' && (tv === 'for' || tv === 'let' || tv === 'every')) {
                            if (xpathTokenType !== xpLexer_1.TokenLevelState.variable) {
                                token['error'] = xpLexer_1.ErrorType.ExpectedDollarAfterComma;
                                problemTokens.push(token);
                            }
                        }
                    }
                    switch (xpathTokenType) {
                        case xpLexer_1.TokenLevelState.string:
                            if (token.error) {
                                problemTokens.push(token);
                            }
                            XsltTokenDiagnostics.checkTokenIsExpected(prevToken, token, problemTokens);
                            if (xpathStack.length > 0) {
                                var xp = xpathStack[xpathStack.length - 1];
                                if (xp.functionArity === 0 && (((_e = xp.function) === null || _e === void 0 ? void 0 : _e.value) === 'key' || ((_f = xp.function) === null || _f === void 0 ? void 0 : _f.value.startsWith('accumulator-')))) {
                                    var keyVal = token.value.substring(1, token.value.length - 1);
                                    if (xp.function.value === 'key') {
                                        if (globalKeys.indexOf(keyVal) < 0) {
                                            token['error'] = xpLexer_1.ErrorType.XSLTKeyUnresolved;
                                            problemTokens.push(token);
                                        }
                                    }
                                    else if (globalAccumulatorNames.indexOf(keyVal) < 0) {
                                        token['error'] = xpLexer_1.ErrorType.AccumulatorNameUnresolved;
                                        problemTokens.push(token);
                                    }
                                }
                            }
                            break;
                        case xpLexer_1.TokenLevelState.axisName:
                            if (token.error) {
                                problemTokens.push(token);
                            }
                            XsltTokenDiagnostics.checkTokenIsExpected(prevToken, token, problemTokens);
                            break;
                        case xpLexer_1.TokenLevelState.variable:
                            if ((preXPathVariable && !xpathVariableCurrentlyBeingDefined) || anonymousFunctionParams) {
                                var fullVariableName = token.value;
                                var currentVariable = { token: token, name: fullVariableName.substring(1) };
                                if (anonymousFunctionParams) {
                                    anonymousFunctionParamList.push(currentVariable);
                                    xsltVariableDeclarations.push(token);
                                }
                                else {
                                    inScopeXPathVariablesList.push(currentVariable);
                                    xpathVariableCurrentlyBeingDefined = true;
                                    xsltVariableDeclarations.push(token);
                                }
                            }
                            else {
                                var prefixEnd = token.value.indexOf(':');
                                if (prefixEnd !== -1) {
                                    var prefix = token.value.substring(1, prefixEnd);
                                    if (inheritedPrefixes.indexOf(prefix) === -1) {
                                        token['error'] = xpLexer_1.ErrorType.XPathPrefix;
                                        problemTokens.push(token);
                                    }
                                }
                                // don't include any current pending variable declarations when resolving
                                var globalVarName = null;
                                if (tagType === TagType.XSLTvar && elementStack.length === 1) {
                                    globalVarName = tagIdentifierName;
                                }
                                var unResolvedToken = XsltTokenDiagnostics.resolveXPathVariableReference(globalVarName, document, importedGlobalVarNames, token, xpathVariableCurrentlyBeingDefined, inScopeXPathVariablesList, xpathStack, inScopeVariablesList, elementStack);
                                if (unResolvedToken !== null) {
                                    unresolvedXsltVariableReferences.push(unResolvedToken);
                                }
                                XsltTokenDiagnostics.checkTokenIsExpected(prevToken, token, problemTokens);
                            }
                            break;
                        case xpLexer_1.TokenLevelState.complexExpression:
                            var valueText = token.value;
                            switch (valueText) {
                                case 'if':
                                    ifThenStack.push(token);
                                    break;
                                case 'every':
                                case 'for':
                                case 'let':
                                case 'some':
                                    if (allTokens.length > index + 2) {
                                        var opToken = allTokens[index + 2];
                                        var expectedOp = valueText === 'let' ? ':=' : 'in';
                                        if (opToken.value !== expectedOp) {
                                            opToken['error'] = xpLexer_1.ErrorType.XPathExpectedComplex;
                                            problemTokens.push(opToken);
                                        }
                                    }
                                    if (index > 0) {
                                        XsltTokenDiagnostics.checkTokenIsExpected(prevToken, allTokens[index - 1], problemTokens, xpLexer_1.TokenLevelState.Unset);
                                    }
                                    preXPathVariable = true;
                                    xpathVariableCurrentlyBeingDefined = false;
                                    xpathStack.push({ token: token, variables: inScopeXPathVariablesList.slice(), preXPathVariable: preXPathVariable, xpathVariableCurrentlyBeingDefined: xpathVariableCurrentlyBeingDefined, isRangeVar: true });
                                    break;
                                case 'then':
                                    if (ifThenStack.length > 0) {
                                        ifThenStack.pop();
                                    }
                                    else {
                                        token.error = xpLexer_1.ErrorType.XPathUnexpected;
                                        problemTokens.push(token);
                                    }
                                    xpathStack.push({ token: token, variables: inScopeXPathVariablesList.slice(), preXPathVariable: preXPathVariable, xpathVariableCurrentlyBeingDefined: xpathVariableCurrentlyBeingDefined });
                                    inScopeXPathVariablesList = [];
                                    break;
                                case 'return':
                                case 'satisfies':
                                case 'else':
                                    if (xpathStack.length > 1) {
                                        var deleteCount = 0;
                                        for (var i = xpathStack.length - 1; i > -1; i--) {
                                            var sv = xpathStack[i].token.value;
                                            if (sv === 'return' || sv === 'else' || sv === 'satisfies') {
                                                deleteCount++;
                                            }
                                            else {
                                                break;
                                            }
                                        }
                                        if (deleteCount > 0) {
                                            xpathStack.splice(xpathStack.length - deleteCount);
                                        }
                                    }
                                    if (xpathStack.length > 0) {
                                        var peekedStack = xpathStack[xpathStack.length - 1];
                                        if (peekedStack) {
                                            if (valueText === 'else') {
                                                preXPathVariable = peekedStack.preXPathVariable;
                                            }
                                            else {
                                                // todo: if after a return AND a ',' prePathVariable = true; see $pos := $c.
                                                preXPathVariable = false;
                                            }
                                            xpathVariableCurrentlyBeingDefined = peekedStack.xpathVariableCurrentlyBeingDefined;
                                            var pv = peekedStack.token.value;
                                            var isAllowed = (pv === 'return' || pv === 'else' || pv === 'satisfies');
                                            var matchingToken = XsltTokenDiagnostics.getMatchingToken(pv);
                                            if (!token.error && !isAllowed && matchingToken !== token.value) {
                                                token['error'] = xpLexer_1.ErrorType.XPathUnexpected;
                                                problemTokens.push(token);
                                                peekedStack.token['error'] = xpLexer_1.ErrorType.BracketNesting;
                                                problemTokens.push(peekedStack.token);
                                            }
                                            else {
                                                peekedStack.token = token;
                                            }
                                        }
                                        else {
                                            inScopeXPathVariablesList = [];
                                            preXPathVariable = false;
                                            xpathVariableCurrentlyBeingDefined = false;
                                        }
                                    }
                                    break;
                            }
                            break;
                        case xpLexer_1.TokenLevelState.mapKey:
                            if (!(prevToken && prevToken.tokenType === xpLexer_1.TokenLevelState.operator
                                && (prevToken.value === ',' || prevToken.value === '{'))) {
                                token['error'] = xpLexer_1.ErrorType.XPathUnexpected;
                                problemTokens.push(token);
                            }
                            break;
                        case xpLexer_1.TokenLevelState.operator:
                            var isXPathError = false;
                            var tv = token.value;
                            // start checks
                            var stackItem = xpathStack.length > 0 ? xpathStack[xpathStack.length - 1] : undefined;
                            if (stackItem && stackItem.curlyBraceType === CurlyBraceType.Map) {
                                if (tv === ',') {
                                    if (stackItem.awaitingMapKey) {
                                        isXPathError = true;
                                    }
                                    else {
                                        stackItem.awaitingMapKey = true;
                                    }
                                }
                                else if (tv === '}' && stackItem.awaitingMapKey) {
                                    isXPathError = true;
                                }
                            }
                            if ((prevToken === null || prevToken === void 0 ? void 0 : prevToken.tokenType) === xpLexer_1.TokenLevelState.uriLiteral) {
                                token['error'] = xpLexer_1.ErrorType.XPathUnexpected;
                                problemTokens.push(token);
                            }
                            else if (prevToken && tv !== '/' && prevToken.value !== '/' && !prevToken.error) {
                                var isXMLToken_1 = prevToken.tokenType >= XsltTokenDiagnostics.xsltStartTokenNumber;
                                var currCharType = token.charType;
                                var nextToken = index + 1 < allTokens.length ? allTokens[index + 1] : undefined;
                                if (tv === ':') {
                                    if (stackItem && stackItem.curlyBraceType === CurlyBraceType.Map) {
                                        if (stackItem.awaitingMapKey) {
                                            stackItem.awaitingMapKey = false;
                                        }
                                        else {
                                            isXPathError = true;
                                        }
                                    }
                                    else if (prevToken.tokenType === xpLexer_1.TokenLevelState.nodeNameTest || prevToken.tokenType === xpLexer_1.TokenLevelState.attributeNameTest) {
                                        isXPathError = !(prevToken.startCharacter + prevToken.length === token.startCharacter && (nextToken === null || nextToken === void 0 ? void 0 : nextToken.value) === '*');
                                    }
                                    else {
                                        isXPathError = true;
                                    }
                                }
                                if (tv === 'map' || tv === 'array') {
                                    XsltTokenDiagnostics.checkTokenIsExpected(prevToken, token, problemTokens, xpLexer_1.TokenLevelState.function);
                                }
                                else if ((tv === '+' || tv === '-') && nextToken && nextToken.tokenType !== xpLexer_1.TokenLevelState.string) {
                                    // either a number of an operator so show no error
                                }
                                else if (isXMLToken_1) {
                                    switch (currCharType) {
                                        case xpLexer_1.CharLevelState.rB:
                                        case xpLexer_1.CharLevelState.rBr:
                                        case xpLexer_1.CharLevelState.rPr:
                                            isXPathError = true;
                                            break;
                                        case xpLexer_1.CharLevelState.sep:
                                            if (tv !== '?' && tv !== '/') {
                                                isXPathError = true;
                                            }
                                            break;
                                        case xpLexer_1.CharLevelState.dSep:
                                            if (tv !== '()' && tv !== '[]' && tv !== '//' && tv !== '*:' && tv != '//') {
                                                isXPathError = true;
                                            }
                                            break;
                                    }
                                }
                                else if (prevToken.tokenType === xpLexer_1.TokenLevelState.operator) {
                                    // current type is operator and previous type is operator
                                    var prevCharType = prevToken.charType;
                                    var pv = prevToken.value;
                                    switch (currCharType) {
                                        case xpLexer_1.CharLevelState.rB:
                                        case xpLexer_1.CharLevelState.rBr:
                                        case xpLexer_1.CharLevelState.rPr:
                                            if (!XsltTokenDiagnostics.isBracket(prevCharType)) {
                                                // +) is not ok but )) or ( ) is ok
                                                if (!((prevToken.charType === xpLexer_1.CharLevelState.sep && pv === '?' && tv === ')')
                                                    || (prevToken.charType === xpLexer_1.CharLevelState.dSep && (pv === '{}' || pv === '()' || pv === '[]')))) {
                                                    isXPathError = true;
                                                }
                                            }
                                            break;
                                        case xpLexer_1.CharLevelState.dSep:
                                            if (prevCharType === xpLexer_1.CharLevelState.rB || prevCharType === xpLexer_1.CharLevelState.rPr || prevCharType === xpLexer_1.CharLevelState.rBr ||
                                                (prevCharType === xpLexer_1.CharLevelState.dSep && (pv === '()' || pv === '[]' || pv === '{}'))) {
                                                // allow: ) !=
                                                isXPathError = tv === '*:';
                                            }
                                            else if (tv === '*:' || tv === '//') {
                                                // no error
                                            }
                                            else if (!((tv === '{}' && (pv === 'map' || pv === 'array')) || tv === '()' || tv === '[]')) {
                                                isXPathError = true;
                                            }
                                            break;
                                        case xpLexer_1.CharLevelState.lB:
                                        case xpLexer_1.CharLevelState.lBr:
                                        case xpLexer_1.CharLevelState.lPr:
                                            // +( is ok
                                            break;
                                        default:
                                            switch (prevCharType) {
                                                case xpLexer_1.CharLevelState.rB:
                                                case xpLexer_1.CharLevelState.rBr:
                                                case xpLexer_1.CharLevelState.rPr:
                                                    // ), or )+ are ok
                                                    break;
                                                case xpLexer_1.CharLevelState.dSep:
                                                    if (!(pv === '()' || pv === '{}' || pv === '[]')) {
                                                        isXPathError = true;
                                                    }
                                                    break;
                                                default:
                                                    // (+ or ++ are not ok
                                                    if ((pv === '&gt;' && tv === '&gt;') || (pv === '&lt;' && (tv === '&lt;' || tv === '&gt;'))) {
                                                        // allow << <> or >>
                                                    }
                                                    else if (tv === 'as') {
                                                        isXPathError = pv !== 'castable' && pv !== 'cast' && pv !== 'treat';
                                                    }
                                                    else if (tv === 'of') {
                                                        isXPathError = pv !== 'instance';
                                                    }
                                                    else if (!((pv === '?' && (tv === ',' || tv === ')')) ||
                                                        (tv === '?' && (pv === '(' || pv === ')' || pv === ',')) ||
                                                        (pv === '!' && tv === '?') ||
                                                        (pv === '[' && tv === '?'))) {
                                                        isXPathError = true;
                                                    }
                                                    break;
                                            }
                                    }
                                }
                                if (isXPathError) {
                                    token['error'] = xpLexer_1.ErrorType.XPathUnexpected;
                                    problemTokens.push(token);
                                    // token is pushed onto problemTokens later
                                }
                            }
                            // end checks
                            var functionToken = null;
                            switch (xpathCharType) {
                                case xpLexer_1.CharLevelState.lBr:
                                    var curlyBraceType = CurlyBraceType.None;
                                    if (prevToken && prevToken.tokenType === xpLexer_1.TokenLevelState.operator) {
                                        if (prevToken.value === 'map') {
                                            curlyBraceType = CurlyBraceType.Map;
                                        }
                                        else if (prevToken.value === 'array') {
                                            curlyBraceType = CurlyBraceType.Array;
                                        }
                                    }
                                    var stackItem_1 = { token: token, variables: inScopeXPathVariablesList, preXPathVariable: preXPathVariable, xpathVariableCurrentlyBeingDefined: xpathVariableCurrentlyBeingDefined, curlyBraceType: curlyBraceType };
                                    if (curlyBraceType === CurlyBraceType.Map) {
                                        stackItem_1.awaitingMapKey = true;
                                    }
                                    xpathStack.push(stackItem_1);
                                    if (anonymousFunctionParams) {
                                        // handle case: function($a) {$a + 8} pass params to inside '{...}'
                                        inScopeXPathVariablesList = anonymousFunctionParamList;
                                        anonymousFunctionParamList = [];
                                        anonymousFunctionParams = false;
                                    }
                                    else {
                                        inScopeXPathVariablesList = [];
                                    }
                                    preXPathVariable = false;
                                    xpathVariableCurrentlyBeingDefined = false;
                                    break;
                                case xpLexer_1.CharLevelState.lB:
                                    // handle case: function($a)
                                    if (!anonymousFunctionParams && (prevToken === null || prevToken === void 0 ? void 0 : prevToken.tokenType) !== xpLexer_1.TokenLevelState.nodeType) {
                                        anonymousFunctionParams = (prevToken === null || prevToken === void 0 ? void 0 : prevToken.tokenType) === xpLexer_1.TokenLevelState.anonymousFunction;
                                    }
                                    if ((prevToken === null || prevToken === void 0 ? void 0 : prevToken.tokenType) === xpLexer_1.TokenLevelState.function) {
                                        functionToken = prevToken;
                                    }
                                // intentionally no-break;
                                case xpLexer_1.CharLevelState.lPr:
                                    var xpathItem = { token: token, variables: inScopeXPathVariablesList, preXPathVariable: preXPathVariable, xpathVariableCurrentlyBeingDefined: xpathVariableCurrentlyBeingDefined };
                                    if (functionToken) {
                                        xpathItem.function = functionToken;
                                        if (incrementFunctionArity) {
                                            xpathItem.functionArity = 1;
                                            incrementFunctionArity = false;
                                        }
                                        else {
                                            xpathItem.functionArity = 0;
                                        }
                                    }
                                    xpathStack.push(xpathItem);
                                    preXPathVariable = false;
                                    inScopeXPathVariablesList = [];
                                    xpathVariableCurrentlyBeingDefined = false;
                                    break;
                                case xpLexer_1.CharLevelState.rB:
                                case xpLexer_1.CharLevelState.rPr:
                                case xpLexer_1.CharLevelState.rBr:
                                    if (xpathStack.length > 1) {
                                        var deleteCount = 0;
                                        for (var i = xpathStack.length - 1; i > -1; i--) {
                                            var sv = xpathStack[i].token.value;
                                            if (sv === 'return' || sv === 'else' || sv === 'satisfies') {
                                                deleteCount++;
                                            }
                                            else {
                                                break;
                                            }
                                        }
                                        if (deleteCount > 0) {
                                            xpathStack.splice(xpathStack.length - deleteCount);
                                        }
                                    }
                                    if (xpathStack.length > 0) {
                                        var poppedData = xpathStack.pop();
                                        if (poppedData) {
                                            inScopeXPathVariablesList = poppedData.variables;
                                            preXPathVariable = poppedData.preXPathVariable;
                                            xpathVariableCurrentlyBeingDefined = poppedData.xpathVariableCurrentlyBeingDefined;
                                            if (poppedData.function && poppedData.functionArity !== undefined) {
                                                if ((prevToken === null || prevToken === void 0 ? void 0 : prevToken.charType) !== xpLexer_1.CharLevelState.lB) {
                                                    if (poppedData.functionArity !== undefined) {
                                                        poppedData.functionArity++;
                                                    }
                                                }
                                                var _g = XsltTokenDiagnostics.isValidFunctionName(inheritedPrefixes, xsltPrefixesToURIs, poppedData.function, checkedGlobalFnNames, poppedData.functionArity), isValid_1 = _g.isValid, qFunctionName_1 = _g.qFunctionName, fErrorType_1 = _g.fErrorType;
                                                if (!isValid_1) {
                                                    poppedData.function['error'] = fErrorType_1;
                                                    poppedData.function['value'] = qFunctionName_1;
                                                    problemTokens.push(poppedData.function);
                                                }
                                            }
                                        }
                                        else {
                                            inScopeXPathVariablesList = [];
                                            preXPathVariable = false;
                                            xpathVariableCurrentlyBeingDefined = false;
                                        }
                                    }
                                    if (token.error && !isXPathError) {
                                        // any error should already have been added by lexer:
                                        problemTokens.push(token);
                                    }
                                    break;
                                case xpLexer_1.CharLevelState.sep:
                                    if (token.value === ',') {
                                        if (xpathStack.length > 0) {
                                            var xp = xpathStack[xpathStack.length - 1];
                                            if (xp.functionArity !== undefined) {
                                                xp.functionArity++;
                                            }
                                            if (xp.isRangeVar) {
                                                preXPathVariable = xp.preXPathVariable;
                                            }
                                            var nonBracketedThen = -1;
                                            for (var i = xpathStack.length - 1; i > -1; i--) {
                                                var xpathItem_1 = xpathStack[i].token;
                                                var val = xpathItem_1.value;
                                                if (!(val === 'return' || val === 'else' || val === 'satisfies' || val === 'then')) {
                                                    break;
                                                }
                                                else if (val === 'then') {
                                                    nonBracketedThen = i;
                                                }
                                            }
                                            if (nonBracketedThen > -1) {
                                                //xpathStack.splice(nonBracketedThen, 1);
                                                token['error'] = xpLexer_1.ErrorType.ExpectedElseAfterThen;
                                                problemTokens.push(token);
                                            }
                                            var sv = xp.token.value;
                                            if (sv === 'return' || sv === 'else' || sv === 'satisfies') {
                                                var poppedData = xpathStack.pop();
                                                if (poppedData) {
                                                    inScopeXPathVariablesList = poppedData.variables;
                                                    if (sv === 'else') {
                                                        preXPathVariable = poppedData.preXPathVariable;
                                                    }
                                                    else {
                                                        // todo: if after a return AND a ',' prePathVariable = true; see $pos := $c.
                                                        preXPathVariable = false;
                                                    }
                                                    xpathVariableCurrentlyBeingDefined = false;
                                                }
                                            }
                                        }
                                        xpathVariableCurrentlyBeingDefined = false;
                                    }
                                    break;
                                case xpLexer_1.CharLevelState.dSep:
                                    if (token.value === '()' && (prevToken === null || prevToken === void 0 ? void 0 : prevToken.tokenType) === xpLexer_1.TokenLevelState.function) {
                                        var fnArity = incrementFunctionArity ? 1 : 0;
                                        incrementFunctionArity = false;
                                        var _h = XsltTokenDiagnostics.isValidFunctionName(inheritedPrefixes, xsltPrefixesToURIs, prevToken, checkedGlobalFnNames, fnArity), isValid_2 = _h.isValid, qFunctionName_2 = _h.qFunctionName, fErrorType_2 = _h.fErrorType;
                                        if (!isValid_2) {
                                            prevToken['error'] = fErrorType_2;
                                            prevToken['value'] = qFunctionName_2;
                                            problemTokens.push(prevToken);
                                        }
                                    }
                                    else if (token.value === '=>') {
                                        incrementFunctionArity = true;
                                    }
                                    break;
                            }
                            break;
                        case xpLexer_1.TokenLevelState.nodeType:
                            if (token.value === ':*' && prevToken && !prevToken.error) {
                                var pfx = prevToken.tokenType === xpLexer_1.TokenLevelState.attributeNameTest ? prevToken.value.substring(1) : prevToken.value;
                                if (inheritedPrefixes.indexOf(pfx) === -1 && pfx !== 'xml') {
                                    prevToken['error'] = xpLexer_1.ErrorType.XPathPrefix;
                                    problemTokens.push(prevToken);
                                }
                            }
                            break;
                        case xpLexer_1.TokenLevelState.attributeNameTest:
                        case xpLexer_1.TokenLevelState.nodeNameTest:
                            if (token.error) {
                                problemTokens.push(token);
                            }
                            else {
                                var tokenValue = void 0;
                                var validationType = void 0;
                                var skipValidation = false;
                                if (xpathTokenType === xpLexer_1.TokenLevelState.nodeNameTest) {
                                    tokenValue = token.value;
                                    validationType = ValidationType.PrefixedName;
                                }
                                else {
                                    tokenValue = token.value.substr(1);
                                    validationType = ValidationType.XMLAttribute;
                                    skipValidation = token.value === '@xml';
                                    if (!skipValidation && token.value === '@') {
                                        var nextToken = allTokens.length > index + 1 ? allTokens[index + 1] : null;
                                        skipValidation = nextToken ? token.value === '@' && (nextToken.value === '*' || nextToken.value === '*:') : false;
                                    }
                                }
                                if (!skipValidation) {
                                    var validateResult = XsltTokenDiagnostics.validateName(tokenValue, validationType, isSchematron, inheritedPrefixes);
                                    if (validateResult !== NameValidationError.None) {
                                        token['error'] = validateResult === NameValidationError.NameError ? xpLexer_1.ErrorType.XPathName : xpLexer_1.ErrorType.XPathPrefix;
                                        token['value'] = token.value;
                                        problemTokens.push(token);
                                    }
                                }
                            }
                            XsltTokenDiagnostics.checkTokenIsExpected(prevToken, token, problemTokens);
                            break;
                        case xpLexer_1.TokenLevelState.functionNameTest:
                            var _j = XsltTokenDiagnostics.isValidFunctionName(inheritedPrefixes, xsltPrefixesToURIs, token, checkedGlobalFnNames), isValid = _j.isValid, qFunctionName = _j.qFunctionName, fErrorType = _j.fErrorType;
                            if (!isValid) {
                                token['error'] = fErrorType;
                                token['value'] = qFunctionName;
                                problemTokens.push(token);
                            }
                            break;
                        case xpLexer_1.TokenLevelState.function:
                        case xpLexer_1.TokenLevelState.number:
                            XsltTokenDiagnostics.checkTokenIsExpected(prevToken, token, problemTokens);
                            break;
                        case xpLexer_1.TokenLevelState.simpleType:
                            var tValue = token.value;
                            var tParts = tValue.split(':');
                            var isValidType = false;
                            if (tValue === '*' || tValue === '?' || tValue === '+') {
                                // e.g. xs:integer* don't check name
                                isValidType = true;
                            }
                            else if (tParts.length === 1) {
                                var nextToken = allTokens.length > index + 1 ? allTokens[index + 1] : null;
                                if (nextToken && (nextToken.charType === xpLexer_1.CharLevelState.lB || (nextToken.charType === xpLexer_1.CharLevelState.dSep && nextToken.value === '()'))) {
                                    isValidType = xpLexer_1.Data.nodeTypes.indexOf(tParts[0]) > -1;
                                    if (!isValidType) {
                                        isValidType = xpLexer_1.Data.nonFunctionTypes.indexOf(tParts[0]) > -1;
                                    }
                                }
                            }
                            else if (tParts.length === 2) {
                                var nsType = xsltPrefixesToURIs.get(tParts[0]);
                                if (nsType !== undefined) {
                                    if (nsType === functionData_1.XSLTnamespaces.XMLSchema) {
                                        if (tParts[1] === 'numeric') {
                                            isValidType = true;
                                        }
                                        else {
                                            isValidType = functionData_1.FunctionData.schema.indexOf(tParts[1] + '#1') > -1;
                                        }
                                    }
                                }
                            }
                            if (!isValidType) {
                                token['error'] = xpLexer_1.ErrorType.XPathTypeName;
                                problemTokens.push(token);
                            }
                            break;
                        case xpLexer_1.TokenLevelState.entityRef:
                            if (token.error) {
                                problemTokens.push(token);
                            }
                            else {
                                var validationResult = void 0, entityName = void 0;
                                (_d = XsltTokenDiagnostics.validateEntityRef(token.value, dtdEnded, inheritedPrefixes), validationResult = _d.validationResult, entityName = _d.entityName);
                                if (validationResult !== NameValidationError.None) {
                                    token['error'] = xpLexer_1.ErrorType.EntityName;
                                    token['value'] = entityName;
                                    problemTokens.push(token);
                                }
                            }
                            break;
                    }
                    if (index === lastTokenIndex && !token.error) {
                        if (token.tokenType === xpLexer_1.TokenLevelState.operator) {
                            XsltTokenDiagnostics.checkFinalXPathToken(token, allTokens, index, problemTokens);
                        }
                        if (xpathStack.length > 0 && !token.error) {
                            var disallowedStackItem = void 0;
                            for (var index_2 = xpathStack.length - 1; index_2 > -1; index_2--) {
                                var trailingToken = xpathStack[index_2].token;
                                var tv = trailingToken.value;
                                var allowedToken = (tv === 'return' || tv === 'else' || tv === 'satisfies');
                                if (!allowedToken) {
                                    disallowedStackItem = trailingToken;
                                    break;
                                }
                            }
                            if (disallowedStackItem) {
                                disallowedStackItem['error'] = xpLexer_1.ErrorType.BracketNesting;
                                problemTokens.push(disallowedStackItem);
                            }
                        }
                        if (token.tokenType === xpLexer_1.TokenLevelState.string && !token.error) {
                            xpLexer_1.XPathLexer.checkStringLiteralEnd(token);
                            if (token.error) {
                                problemTokens.push(token);
                            }
                        }
                    }
                }
                prevToken = token.tokenType === xpLexer_1.TokenLevelState.comment ? prevToken : token;
                if (index === lastTokenIndex) {
                    // xml is not well-nested if items still on the stack at the end
                    // but report errors and try to keep some part of the tree:
                    if (token.tokenType === xpLexer_1.TokenLevelState.complexExpression) {
                        token['error'] = xpLexer_1.ErrorType.XPathAwaiting;
                        problemTokens.push(token);
                    }
                    if (elementStack.length > 0) {
                        var usedtoken = false;
                        while (elementStack.length > 0) {
                            var poppedData = elementStack.pop();
                            var endToken = void 0;
                            if (poppedData) {
                                if (usedtoken) {
                                    // use final token as we don't know what the end token is
                                    // but reduce lendth by one on each iteration - so its well nested
                                    endToken = token;
                                    endToken.length = endToken.length - 1;
                                }
                                else {
                                    endToken = token;
                                    usedtoken = true;
                                }
                                var errorToken = Object.assign({}, poppedData.identifierToken);
                                errorToken['error'] = xpLexer_1.ErrorType.ElementNesting;
                                problemTokens.push(errorToken);
                                var symbol = XsltTokenDiagnostics.createSymbolFromElementTokens(poppedData.symbolName, poppedData.symbolID, poppedData.identifierToken, endToken);
                                if (symbol !== null) {
                                    if (elementStack.length > 0) {
                                        elementStack[elementStack.length - 1].childSymbols.push(symbol);
                                    }
                                    else {
                                        topLevelSymbols.push(symbol);
                                    }
                                }
                            }
                        }
                    }
                }
            });
            var variableRefDiagnostics = XsltTokenDiagnostics.getDiagnosticsFromUnusedVariableTokens(document, xsltVariableDeclarations, unresolvedXsltVariableReferences, includeOrImport);
            var allDiagnostics = XsltTokenDiagnostics.appendDiagnosticsFromProblemTokens(variableRefDiagnostics, problemTokens);
            return allDiagnostics;
        };
        return XsltTokenDiagnostics;
    }());
    exports.XsltTokenDiagnostics = XsltTokenDiagnostics;
    var XMLPIState;
    (function (XMLPIState) {
        XMLPIState[XMLPIState["none"] = 0] = "none";
        XMLPIState[XMLPIState["invalid"] = 1] = "invalid";
        XMLPIState[XMLPIState["Name"] = 2] = "Name";
        XMLPIState[XMLPIState["Eq"] = 3] = "Eq";
        XMLPIState[XMLPIState["Start"] = 4] = "Start";
        XMLPIState[XMLPIState["End"] = 5] = "End";
    })(XMLPIState || (XMLPIState = {}));
    var XMLPIName;
    (function (XMLPIName) {
        XMLPIName[XMLPIName["none"] = 0] = "none";
        XMLPIName[XMLPIName["version"] = 1] = "version";
        XMLPIName[XMLPIName["encoding"] = 2] = "encoding";
        XMLPIName[XMLPIName["standalone"] = 3] = "standalone";
    })(XMLPIName || (XMLPIName = {}));
});
//# sourceMappingURL=xsltTokenDiagnostics.js.map