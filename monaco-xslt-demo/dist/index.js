// this code is not used but demonstrates use
// of the API in a TypeScript environment
define(["require", "exports", "monaco-editor", "./monacoXSLT", "./index.css"], function (require, exports, monaco, monacoXSLT_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // @ts-ignore
    self.MonacoEnvironment = {
        getWorkerUrl: function (moduleId, label) {
            if (label === 'json') {
                return './json.worker.bundle.js';
            }
            if (label === 'css' || label === 'scss' || label === 'less') {
                return './css.worker.bundle.js';
            }
            if (label === 'html' || label === 'handlebars' || label === 'razor') {
                return './html.worker.bundle.js';
            }
            if (label === 'typescript' || label === 'javascript') {
                return './ts.worker.bundle.js';
            }
            return './editor.worker.bundle.js';
        }
    };
    // unsure how to use these yet - related to 'encodedTokensColors' property
    // of IStandaloneThemeData interfac that takes a string[] type?
    var themeColors = { 'mygreen': '#0000ff' };
    var themeData = {
        base: 'vs-dark',
        inherit: true,
        rules: monacoXSLT_1.MonacoXSLT.vsDarkTokenColors,
        colors: themeColors
    };
    monaco.editor.defineTheme('xslDarkTheme', themeData);
    var mXSLT = new monacoXSLT_1.MonacoXSLT();
    var _XSLT = 'xslt';
    monaco.languages.register({
        id: _XSLT
    });
    monaco.languages.registerDocumentSemanticTokensProvider(_XSLT, {
        getLegend: function () {
            return monacoXSLT_1.MonacoXSLT.getLegend();
        },
        provideDocumentSemanticTokens: function (model, lastResultId, token) {
            return mXSLT.provideDocumentSemanticTokens(model, lastResultId, token);
        },
        releaseDocumentSemanticTokens: function (resultId) { }
    });
    var mEditor = monaco.editor.create(document.body, {
        value: "<xsl:stylesheet xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"\n\t\txmlns:xs=\"http://www.w3.org/2001/XMLSchema\"\n\t\texclude-result-prefixes=\"#all\"\n\t\texpand-text=\"yes\"\n\t\tversion=\"3.0\">\n\n<xsl:variable select=\"@*, /abc/def/node()\"/>\n</xsl:stylesheet>",
        language: _XSLT,
        theme: 'xslDarkTheme',
        'semanticHighlighting.enabled': true
    });
});
//# sourceMappingURL=index.js.map