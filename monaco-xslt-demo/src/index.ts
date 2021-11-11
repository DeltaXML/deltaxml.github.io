// this code is not used but demonstrates use
// of the API in a TypeScript environment

import * as monaco from 'monaco-editor';
import './index.css';
import { MonacoXSLT } from './monacoXSLT';

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
const themeColors: monaco.editor.IColors = {'mygreen': '#0000ff'};

const themeData: monaco.editor.IStandaloneThemeData = {
    base: 'vs-dark',
    inherit: true,
	rules: MonacoXSLT.vsDarkTokenColors,
	colors: themeColors
}

monaco.editor.defineTheme('xslDarkTheme', themeData);
const mXSLT = new MonacoXSLT();
const _XSLT = 'xslt';

monaco.languages.register({
	id: _XSLT
});
monaco.languages.registerDocumentSemanticTokensProvider(_XSLT, {
	getLegend: function () {
			return MonacoXSLT.getLegend();
	},
	provideDocumentSemanticTokens: function (model, lastResultId, token) {
			return mXSLT.provideDocumentSemanticTokens(model, lastResultId, token);
	},
	releaseDocumentSemanticTokens: function (resultId) { }
});

const mEditor = monaco.editor.create(document.body, {
    value:
        `<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns:xs="http://www.w3.org/2001/XMLSchema"
		exclude-result-prefixes="#all"
		expand-text="yes"
		version="3.0">

<xsl:variable select="@*, /abc/def/node()"/>
</xsl:stylesheet>`,
	language: _XSLT,
	theme: 'xslDarkTheme',
	'semanticHighlighting.enabled': true
});
