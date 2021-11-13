import * as monaco from 'monaco-editor';
import { TextEdit, Position, Range, CancellationToken } from 'vscode';
import { XPathConfiguration, XSLTConfiguration } from './languageConfigurations';
import { VSCodeFormattingOptions, VSCodeTextDocument } from './vscodeTextDocument';
import { XMLDocumentFormattingProvider } from './xmlDocumentFormattingProvider';
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


export class XMLFormatter {

	private lc: LanguageConfiguration;
	private fc: XMLDocumentFormattingProvider;
	constructor(langId: string) {
		switch (langId) {
			case 'xslt':
				this.lc = XSLTConfiguration.configuration;
				break;
			case 'xpath':
				this.lc = XPathConfiguration.configuration;
				break;
		}
		this.fc = new XMLDocumentFormattingProvider(this.lc);
	}

	provideOnTypeFormattingEdits(model: monaco.editor.ITextModel,
		position: monaco.Position, ch: string, options: monaco.languages.FormattingOptions, token: monaco.CancellationToken):
		monaco.languages.ProviderResult<monaco.languages.TextEdit[]> {

		const vsDoc = new VSCodeTextDocument(model);
		const vsPos = MonacoToVSCode.toPosition(position);
		const vsOptions = new VSCodeFormattingOptions(options);
		const vsToken = <CancellationToken>token;
		const vsTextEdit = this.fc.provideOnTypeFormattingEdits(
			vsDoc, vsPos, ch, vsOptions, vsToken
		);

		const mnTextEdit = vsTextEdit.map((value) => VScodeToMonaco.toTextEdit(value));
		return mnTextEdit;
	}
}

export class VScodeToMonaco {
	pos = new Position(0, 0);
	te = TextEdit.insert(this.pos, 'text');
	rng = new Range(this.pos, this.pos);

	public static toRange(range: Range): monaco.IRange {
		return {
			startLineNumber: range.start.line,
			startColumn: range.start.character,
			endLineNumber: range.end.line,
			endColumn: range.end.character
		}
	}

	public static toTextEdit(textEdit: TextEdit): monaco.languages.TextEdit {
		return {
			range: VScodeToMonaco.toRange(textEdit.range),
			text: textEdit.newText
		}
	};
}

export class MonacoToVSCode {
	public static toPosition(pos: monaco.Position): Position {
		return new Position(pos.lineNumber, pos.column)
	} 
}

