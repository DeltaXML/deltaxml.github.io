define(["require", "exports", "./languageConfigurations", "./xslLexer"], function (require, exports, languageConfigurations_1, xslLexer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MonacoXSLT = void 0;
    var MonacoXSLT = /** @class */ (function () {
        function MonacoXSLT() {
            this.xslLexer = new xslLexer_1.XslLexer(languageConfigurations_1.XSLTConfiguration.configuration);
            this.xslLexer.provideCharLevelState = true;
        }
        MonacoXSLT.getSemanticTokenLegend = function () {
            return xslLexer_1.XslLexer.getTextmateTypeLegend();
        };
        MonacoXSLT.getLegend = function () {
            return {
                tokenTypes: MonacoXSLT.getSemanticTokenLegend(),
                tokenModifiers: []
            };
        };
        MonacoXSLT.prototype.getAdaptedXslType = function (tokenType) {
            return tokenType;
            ;
        };
        MonacoXSLT.prototype.provideDocumentSemanticTokens = function (model, lastResultId, token) {
            var lines = model.getLinesContent();
            var text = lines.join('\n');
            var allTokens = this.xslLexer.analyse(text);
            var data = [];
            var prevLine = 0;
            var prevChar = 0;
            for (var i = 0; i < allTokens.length; i++) {
                var token_1 = allTokens[i];
                var type = this.getAdaptedXslType(token_1.tokenType);
                var modifier = 0;
                var line = token_1.line;
                var char = token_1.startCharacter;
                data.push(
                // translate line to deltaLine
                line - prevLine, 
                // for the same line, translate start to deltaStart
                prevLine === line ? char - prevChar : char, token_1.length, type, modifier);
                prevLine = line;
                prevChar = token_1.startCharacter;
            }
            return {
                data: new Uint32Array(data),
                resultId: null
            };
        };
        MonacoXSLT.vsDarkTokenColors = [
            {
                token: 'attributeName',
                foreground: '#9CDCFE'
            },
            {
                token: 'attributeEquals',
                foreground: '#808080'
            },
            {
                token: 'attributeValue',
                foreground: '#ce9178'
            },
            {
                token: 'xmlnsName',
                foreground: '#6A9955'
            },
            {
                token: 'dtd',
                foreground: '#808080'
            },
            {
                token: 'dtdEnd',
                foreground: '#808080'
            },
            {
                token: 'elementName',
                foreground: '#4EC9B0'
            },
            {
                token: 'elementValue',
                foreground: '#b5cea8'
            },
            {
                token: 'processingInstrName',
                foreground: '#569cd6'
            },
            {
                token: 'processingInstrValue',
                foreground: '#9CDCFE'
            },
            {
                token: 'entityRef',
                foreground: '#DCDCAA'
            },
            {
                token: 'xmlComment',
                foreground: '#6A9955'
            },
            {
                token: 'xmlPunctuation',
                foreground: '#808080'
            },
            {
                token: 'xslElementName',
                foreground: '#569cd6'
            },
            {
                token: 'xmlText',
                foreground: '#b5cea8'
            },
            // XPath tokens:
            {
                token: 'attributeNameTest',
                foreground: '#9CDCFE'
            },
            {
                token: 'comment',
                foreground: '#6A9955'
            },
            {
                token: 'number',
                foreground: '#b5cea8'
            },
            {
                token: 'Unset',
                foreground: '#808080'
            },
            {
                token: 'operator',
                foreground: '#d4d4d4'
            },
            {
                token: 'variable',
                foreground: '#9CDCFE'
            },
            {
                token: 'string',
                foreground: '#ce9178'
            },
            {
                token: 'uriLiteral',
                foreground: '#569cd6'
            },
            {
                token: 'nodeType',
                foreground: '#9CDCFE'
            },
            {
                token: 'simpleType',
                foreground: '#9CDCFE'
            },
            {
                token: 'axisName',
                foreground: '#d4d4d4'
            },
            {
                token: 'nodeNameTest',
                foreground: '#4EC9B0'
            },
            {
                token: 'functionNameTest',
                foreground: '#4EC9B0'
            },
            {
                token: 'complexExpression',
                foreground: '#C586C0'
            },
            {
                token: 'function',
                foreground: '#DCDCAA'
            },
            {
                token: 'anonymousFunction',
                foreground: '#4FC1FF'
            },
            {
                token: 'mapKey',
                foreground: '#C586C0'
            }
        ];
        return MonacoXSLT;
    }());
    exports.MonacoXSLT = MonacoXSLT;
});
//# sourceMappingURL=monacoXSLT.js.map