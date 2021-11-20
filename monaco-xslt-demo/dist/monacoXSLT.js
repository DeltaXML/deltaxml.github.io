define(["require", "exports", "./languageConfigurations", "./xmlDocumentFormattingProvider", "./xslLexer", "./xslThemeData"], function (require, exports, languageConfigurations_1, xmlDocumentFormattingProvider_1, xslLexer_1, xslThemeData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XMLFormatter = exports.Themes = exports.MonacoXSLT = void 0;
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
        return MonacoXSLT;
    }());
    exports.MonacoXSLT = MonacoXSLT;
    var Themes = /** @class */ (function () {
        function Themes() {
        }
        Themes.vsDarkTokenColors = xslThemeData_1.xslThemeData.vsDark;
        return Themes;
    }());
    exports.Themes = Themes;
    var XMLFormatter = /** @class */ (function () {
        function XMLFormatter(langId) {
            switch (langId) {
                case 'xslt':
                    this.lc = languageConfigurations_1.XSLTConfiguration.configuration;
                    break;
                case 'xpath':
                    this.lc = languageConfigurations_1.XPathConfiguration.configuration;
                    break;
            }
            this.fc = new xmlDocumentFormattingProvider_1.XMLDocumentFormattingProvider(this.lc);
        }
        XMLFormatter.prototype.provideOnTypeFormattingEdits = function (model, position, ch, options, token) {
            var mTextEdit = this.fc.provideOnTypeFormattingEdits(model, position, ch, options, token);
            return mTextEdit;
        };
        return XMLFormatter;
    }());
    exports.XMLFormatter = XMLFormatter;
});
//# sourceMappingURL=monacoXSLT.js.map