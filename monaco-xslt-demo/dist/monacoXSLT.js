define(["require", "exports", "./languageConfigurations", "./xslLexer", "./xslThemeData"], function (require, exports, languageConfigurations_1, xslLexer_1, xslThemeData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Themes = exports.MonacoXSLT = void 0;
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
});
//# sourceMappingURL=monacoXSLT.js.map