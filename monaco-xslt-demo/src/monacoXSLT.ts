import * as monaco from 'monaco-editor';
import { XSLTConfiguration } from './languageConfigurations';
import { BaseToken } from './xpLexer';
import { LanguageConfiguration, XslLexer } from './xslLexer';

export class MonacoXSLT {
	private xslLexer: XslLexer;

	constructor() {
		this.xslLexer = new XslLexer(XSLTConfiguration.configuration);
		this.xslLexer.provideCharLevelState = true;
	}

	public static getSemanticTokenLegend() {
		return XslLexer.getTextmateTypeLegend();
	}

	public static getLegend() {
		return {
			tokenTypes: MonacoXSLT.getSemanticTokenLegend(),
			tokenModifiers: []
		}
	}

	private getAdaptedXslType(tokenType: number) {
		return tokenType;;
	}

	public provideDocumentSemanticTokens(model, lastResultId, token) {
		const lines = model.getLinesContent();
		const text = lines.join('\n');
		const allTokens = this.xslLexer.analyse(text);
		const data: number[] = [];

		let prevLine = 0;
		let prevChar = 0;

		for (let i = 0; i < allTokens.length; i++) {
			const token: BaseToken = allTokens[i];
			let type = this.getAdaptedXslType(token.tokenType);
			let modifier = 0;
			let line = token.line;
			let char = token.startCharacter;
			data.push(
				// translate line to deltaLine
				line - prevLine,
				// for the same line, translate start to deltaStart
				prevLine === line ? char - prevChar : char,
				token.length,
				type,
				modifier
			);

			prevLine = line;
			prevChar = token.startCharacter;
		}

		return {
			data: new Uint32Array(data),
			resultId: null
		};
	}

	public static vsDarkTokenColors: monaco.editor.ITokenThemeRule[] = [
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
	]
}