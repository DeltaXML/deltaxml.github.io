require.config({ paths: { vs: '../node_modules/monaco-editor/min/vs', dist: '../dist' } });

require(['vs/editor/editor.main', 'dist/monacoXSLT', 'dist/xslThemeData'], function (monaco, xslPlugin) {
    const _XSLT_Language_Id = 'xslt';
    const _XslDarkTheme = 'xslDarkTheme';
    const _FontSize = 16;
    const mXSLT = new xslPlugin.MonacoXSLT();

    // Setup theme with colors defined for XSLT tokens
    const defaultXslDarkTheme = {
        base: 'vs-dark',
        inherit: true,
        rules: xslPlugin.MonacoXSLT.vsDarkTokenColors
    };
    monaco.editor.defineTheme(_XslDarkTheme, defaultXslDarkTheme);

    monaco.languages.register({ id: _XSLT_Language_Id });
    monaco.languages.registerDocumentSemanticTokensProvider(_XSLT_Language_Id, {
        getLegend: function () {
            return xslPlugin.MonacoXSLT.getLegend();
        },
        provideDocumentSemanticTokens: function (model, lastResultId, token) {
            return mXSLT.provideDocumentSemanticTokens(model, lastResultId, token);
        },
        releaseDocumentSemanticTokens: function (resultId) { }
    });

    const xsltInit = `<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"\t\t
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                exclude-result-prefixes="#all"
                expand-text="yes"
                version="3.0">

    <xsl:variable select="for $a in (@*, parent::*/node()) 
                          return count($a)"/>

</xsl:stylesheet>`;

    const editor = monaco.editor.create(document.getElementById('xslt-editor'), {
        value: xsltInit,
        language: _XSLT_Language_Id,
        theme: _XslDarkTheme,
        fontSize: _FontSize,
        minimap: { enabled: false },
        'semanticHighlighting.enabled': true
    });
});
