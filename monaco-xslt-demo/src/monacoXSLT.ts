import * as monaco from 'monaco-editor';
import { XSLTConfiguration } from './languageConfigurations';
import { BaseToken } from './xpLexer';
import { LanguageConfiguration, XslLexer } from './xslLexer';
import { xslThemeData } from './xslThemeData';

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
}

export class Themes {
	public static vsDarkTokenColors: monaco.editor.ITokenThemeRule[] = xslThemeData.vsDark;
}