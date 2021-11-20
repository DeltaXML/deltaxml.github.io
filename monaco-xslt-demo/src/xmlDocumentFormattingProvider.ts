/**
 *  Copyright (c) 2020 DeltaXML Ltd. and others.
 *
 *  Contributors:
 *  DeltaXML Ltd. - xmlDocumentFormattingProvider
 */
import { XslLexer, XMLCharState, XSLTokenLevelState, LanguageConfiguration, DocumentTypes } from './xslLexer';
import { CharLevelState, TokenLevelState, BaseToken, XPathLexer, ExitCondition, LexPosition } from './xpLexer';
import * as monaco from 'monaco-editor'


enum HasCharacteristic {
	unknown,
	yes,
	no
}

export class XMLDocumentFormattingProvider {

	public replaceIndendation = true;
	public minimiseXPathIndents = true;
	public indentMixedContent = false;
	private xslLexer: XslLexer;
	private xpLexer: XPathLexer;
	private docType: DocumentTypes;
	private onType = false;
	private onTypeLineEmpty = false;
	private static xsltStartTokenNumber = XslLexer.getXsltStartTokenNumber();
	private isCloseTag = false;
	private closeTagLine: string | null = null;
	private closeTagPos: monaco.Position | null = null;

	constructor(xsltConfiguration: LanguageConfiguration) {
		this.xslLexer = new XslLexer(xsltConfiguration);
		this.docType = xsltConfiguration.docType;
		this.xpLexer = new XPathLexer();
		this.xslLexer.provideCharLevelState = true;
	}

	private trimLeft(text: string) {
		return text.replace(/^\s+/,"");
	}

	public provideOnTypeFormattingEdits = (document: monaco.editor.ITextModel, pos: monaco.Position, ch: string, options: monaco.languages.FormattingOptions, token: monaco.CancellationToken): monaco.languages.TextEdit[] => {
		this.isCloseTag = ch.indexOf('/') > -1;
		if (this.isCloseTag && pos.column > 1) {
			let tLine = document.getLineContent(pos.column);
			this.closeTagLine = tLine;
			this.closeTagPos = pos;
			let chBefore = tLine.charAt(pos.column - 2);
			this.isCloseTag = chBefore === '<';
		}
		if (ch.indexOf('\n') > -1 || this.isCloseTag) {
			//const prevLine = document.lineAt(pos.line - 1);
			const newLine = document.getLineContent(pos.column);
			this.onTypeLineEmpty = newLine.trim().length === 0;
			const documentRange: monaco.Range = new monaco.Range(pos.lineNumber, 1, pos.lineNumber, pos.column);
			this.onType = true;
			let formatEdit = this.provideDocumentRangeFormattingEdits(document, documentRange, options, token);
			this.onType = false;
			return formatEdit;
		} else {
			return [];
		}
	}

	public provideDocumentFormattingEdits = (document: monaco.editor.ITextModel, options: monaco.languages.FormattingOptions, token: monaco.CancellationToken): monaco.languages.TextEdit[] => {

		return this.provideDocumentRangeFormattingEdits(document, document.getFullModelRange(), options, token);
	}

	public provideDocumentRangeFormattingEdits = (document: monaco.editor.ITextModel, range: monaco.Range, options: monaco.languages.FormattingOptions, token: monaco.CancellationToken): monaco.languages.TextEdit[] => {
		let result: monaco.languages.TextEdit[] = [];
		let indentString = '';
		let useTabs = !(options.insertSpaces);
		let newLineString = document.getEOL();
		// using non-whitespace for testing only!!
		if (useTabs) {
			indentString = '\t';
		} else {
			indentString = ' ';
		}
		let indentCharLength = useTabs ? 1 : options.tabSize;

		let currentLine = document.getLineContent(range.startLineNumber);
		if (range.startColumn >= XMLDocumentFormattingProvider.firstNonWhitespaceCharacterIndex(currentLine)) {
			// don't format pastes / range selections if they don't include the start non-ws char of the line
			return [];
		}

		let startFormattingLineNumber = range.startLineNumber;
		const firstLine = document.getLineContent(1);
		const adjustedStartRange = new monaco.Range(1, 1, range.startLineNumber, range.endLineNumber);

		let stringForTokens: string;
		if (this.onTypeLineEmpty) {
			// add extra char to make token on newline - so it can be indented
			stringForTokens = XMLDocumentFormattingProvider.getTextForModel(document, adjustedStartRange) + '< ';
		} else {
			stringForTokens = XMLDocumentFormattingProvider.getTextForModel(document, adjustedStartRange);
		}
		const lexPosition: LexPosition = { line: 0, startCharacter: 0, documentOffset: 0 };
		let allTokens = this.docType === DocumentTypes.XPath ?
			this.xpLexer.analyse(XMLDocumentFormattingProvider.getTextForModel(document), ExitCondition.None, lexPosition) :
			this.xslLexer.analyse(stringForTokens);

		let lineNumber = -1;
		let prevLineNumber = -1;
		let nestingLevel = 0;
		let xpathNestingLevel = 0;
		let newNestingLevel = 0;
		let tokenIndex = -1;
		let multiLineState = MultiLineState.None;

		let xmlSpacePreserveStack: boolean[] = [];
		let xmlelementStack: string[] = [];
		let xmlSpaceAttributeValue: boolean | null = null;
		let awaitingXmlSpaceAttributeValue = false;
		let attributeNameOffset = 0;
		let attributeValueOffset = 0;
		let attributeNameOnNewLine = false;
		let isPreserveSpaceElement = false;
		let withinCDATA = false;
		let complexStateStack: [number, number[], boolean][] = [];
		let elseLineNumber = -1;
		let isXSLTStartTag = false;
		let nameIndentRequired = false;
		let preThen = false;
		let documenthasNewLines: HasCharacteristic = HasCharacteristic.unknown;
		let awaitingSecondTag: HasCharacteristic = HasCharacteristic.unknown;
		let firstStartTagLineNumber = -1;
		let prevToken: BaseToken | null = null;
		let elementName = '';
		let closeTagWithinText = false;
		let closeTagName: string | null = null;
		let emptyStackIsElseBlock = false;

		if (this.docType === DocumentTypes.XPath) {
			complexStateStack = [[0, [], false]];
			this.xpLexer.reset();
		}

		allTokens.forEach((token) => {
			let newMultiLineState = MultiLineState.None;
			let stackLength = xmlSpacePreserveStack.length;
			let addNewLine = false;

			tokenIndex++;
			lineNumber = token.line;
			let lineNumberDiff = lineNumber - prevLineNumber;

			let isXMLToken = token.tokenType >= XMLDocumentFormattingProvider.xsltStartTokenNumber;
			let indent = 0;

			if (this.onType && result.length > 0) {
				// do nothing
			} else if (isXMLToken) {
				xpathNestingLevel = 0;
				let xmlCharType = <XMLCharState>token.charType;
				let xmlTokenType = <XSLTokenLevelState>(token.tokenType - XMLDocumentFormattingProvider.xsltStartTokenNumber);
				switch (xmlTokenType) {
					case XSLTokenLevelState.xslElementName:
						complexStateStack = [[0, [], false]];
						emptyStackIsElseBlock = false;
						isXSLTStartTag = true;
						elementName = XMLDocumentFormattingProvider.getTextForToken(lineNumber, token, document);
						isPreserveSpaceElement = elementName === 'xsl:text';
						break;
					case XSLTokenLevelState.elementName:
						complexStateStack = [[0, [], false]];
						emptyStackIsElseBlock = false;
						isXSLTStartTag = false;
						elementName = XMLDocumentFormattingProvider.getTextForToken(lineNumber, token, document);
						break;
					case XSLTokenLevelState.xmlPunctuation:
						switch (xmlCharType) {
							case XMLCharState.lSt:
								attributeNameOffset = 0;
								attributeValueOffset = 0;
								xmlSpaceAttributeValue = null;
								newNestingLevel++;
								if (awaitingSecondTag === HasCharacteristic.unknown) {
									firstStartTagLineNumber = lineNumber;
									awaitingSecondTag = HasCharacteristic.yes;
								} else if (awaitingSecondTag === HasCharacteristic.yes) {
									documenthasNewLines = lineNumber > firstStartTagLineNumber ? HasCharacteristic.yes : HasCharacteristic.no;
									awaitingSecondTag = HasCharacteristic.no;
								}
								addNewLine = this.shouldAddNewLine(documenthasNewLines, prevToken, token);
								break;
							case XMLCharState.rStNoAtt:
								let preserveSpace = stackLength > 0 ? xmlSpacePreserveStack[stackLength - 1] : false;
								xmlSpacePreserveStack.push(preserveSpace);
								if (this.isCloseTag) {
									xmlelementStack.push(elementName);
								}
								break;
							case XMLCharState.rSt:
								attributeNameOffset = 0;
								attributeValueOffset = 0;
								if (xmlSpaceAttributeValue === null) {
									let preserveSpace = stackLength > 0 ? xmlSpacePreserveStack[stackLength - 1] : false;
									xmlSpacePreserveStack.push(preserveSpace);
								} else {
									xmlSpacePreserveStack.push(xmlSpaceAttributeValue);
									xmlSpaceAttributeValue = null;
								}
								if (this.isCloseTag) {
									xmlelementStack.push(elementName);
								}
								break;
							case XMLCharState.lCt:
								// outdent:
								indent = -1;
								newNestingLevel--;
								addNewLine = this.shouldAddNewLine(documenthasNewLines, prevToken, token);
								if (this.isCloseTag) {
									closeTagWithinText = this.closeTagPos?.lineNumber - 1 === token.line &&
										this.closeTagPos.column - 1 >= token.startCharacter &&
										this.closeTagPos.column - 1 <= token.startCharacter + token.length;
									if (closeTagWithinText && xmlelementStack.length > 0) {
										closeTagName = xmlelementStack[xmlelementStack.length - 1];
									}
								}
								break;
							case XMLCharState.rSelfCtNoAtt:
							case XMLCharState.rSelfCt:
								attributeNameOffset = 0;
								attributeValueOffset = 0;
								isPreserveSpaceElement = false;
								newNestingLevel--;
								break;
							case XMLCharState.rCt:
								attributeNameOffset = 0;
								attributeValueOffset = 0;
								isPreserveSpaceElement = false;
								if (stackLength > 0) {
									xmlSpacePreserveStack.pop();
								}
								if (this.isCloseTag && xmlelementStack.length > 0) {
									xmlelementStack.pop();
								}
								break;
							case XMLCharState.lPi:
								// may be xml-declaration:
								if (awaitingSecondTag === HasCharacteristic.unknown) {
									firstStartTagLineNumber = lineNumber;
									awaitingSecondTag = HasCharacteristic.yes;
								}
								attributeNameOffset = 0;
								attributeValueOffset = 0;
								break;
							case XMLCharState.rPi:
								indent = 0;
								break;
							case XMLCharState.rCdataEnd:
								withinCDATA = true;
								break;
						}
						break;
					case XSLTokenLevelState.attributeName:
					case XSLTokenLevelState.xmlnsName:
						// test: xml:space
						attributeValueOffset = 0;
						attributeNameOnNewLine = lineNumberDiff > 0;
						nameIndentRequired = true;
						if (token.length === 9 || (isXSLTStartTag && this.minimiseXPathIndents)) {
							let valueText = XMLDocumentFormattingProvider.getTextForToken(lineNumber, token, document);
							awaitingXmlSpaceAttributeValue = (valueText === 'xml:space');
							nameIndentRequired = !(isXSLTStartTag && attributeNameOnNewLine && this.xslLexer.isExpressionAtt(valueText));
						}
						const attNameLine = document.getLineContent(lineNumber + 1);
						if (!nameIndentRequired) {
							attributeNameOffset = 0;
						} else if (!attributeNameOnNewLine && attributeNameOffset === 0) {
							attributeNameOffset = token.startCharacter - XMLDocumentFormattingProvider.firstNonWhitespaceCharacterIndex(attNameLine);
						}
						break;
					case XSLTokenLevelState.attributeValue:
						const attValueLine = document.getLineContent(lineNumber + 1);
						let attValueText = XMLDocumentFormattingProvider.getTextForToken(lineNumber, token, document);
						// token constains single/double quotes also
						let textOnFirstLine = token.length > 1 && attValueText.trim().length > 1;
						let indentRemainder = attributeNameOffset % indentCharLength;
						let adjustedIndentChars = attributeNameOffset + (indentCharLength - indentRemainder);

						let calcOffset = token.startCharacter - XMLDocumentFormattingProvider.firstNonWhitespaceCharacterIndex(attValueLine);
						calcOffset = attributeNameOnNewLine ? calcOffset + attributeNameOffset : calcOffset;

						let newValueOffset = textOnFirstLine ? 1 + calcOffset : adjustedIndentChars;
						attributeValueOffset = lineNumberDiff > 0 ? attributeValueOffset : newValueOffset;
						if (awaitingXmlSpaceAttributeValue) {
							// token includes surrounding quotes.
							xmlSpaceAttributeValue = attValueText === '\"preserve\"' || attValueText === '\'preserve\'';
							awaitingXmlSpaceAttributeValue = false;
						}
						break;
					case XSLTokenLevelState.processingInstrValue:
					case XSLTokenLevelState.processingInstrName:
						attributeNameOffset = 0;
						newMultiLineState = (multiLineState === MultiLineState.None) ? MultiLineState.Start : MultiLineState.Middle;
						// TODO: outdent ?> on separate line - when token value is only whitespace
						let piText = XMLDocumentFormattingProvider.getTextForToken(lineNumber, token, document);
						let trimPi = piText.trim();

						if (newMultiLineState === MultiLineState.Middle && trimPi.length > 0) {
							indent = 1;
						}
						break;
					case XSLTokenLevelState.xmlComment:
						newMultiLineState = (multiLineState === MultiLineState.None) ? MultiLineState.Start : MultiLineState.Middle;
						let commentLineText = XMLDocumentFormattingProvider.getTextForToken(lineNumber, token, document);
						let trimLine = this.trimLeft(commentLineText);

						let doIndent = newMultiLineState === MultiLineState.Middle
							&& token.length > 0 && !trimLine.startsWith('-->') && !trimLine.startsWith('<!--');
						indent = doIndent ? 1 : 0;
						attributeNameOffset = doIndent ? 5 : 0;
						break;
				}

			} else {
				let xpathCharType = <CharLevelState>token.charType;
				let xpathTokenType = <TokenLevelState>token.tokenType;
				let currentStateLevel: [number, number[], boolean] = complexStateStack.length > 0 ? complexStateStack[complexStateStack.length - 1] : [0, [], emptyStackIsElseBlock];
				let bracketNesting: number = currentStateLevel[0];
				let ifElseStack: number[] = currentStateLevel[1];
				let isElseBlock: boolean = currentStateLevel[2];

				let ifElseStackLength = ifElseStack.length;

				switch (xpathTokenType) {
					case TokenLevelState.complexExpression:
						let valueText = token.value;
						switch (valueText) {
							case 'if':
								if (lineNumber === elseLineNumber) {
									xpathNestingLevel--;
								}
								elseLineNumber = -1;
								preThen = true;
								break;
							case 'every':
							case 'for':
							case 'let':
							case 'some':
								indent = -1;
							// no-break;
							case 'then':
								preThen = false;
								xpathNestingLevel++;
								ifElseStack.push(xpathNestingLevel);
								break;
							case 'else':
								isElseBlock = true;
								if (complexStateStack.length === 0) {
									emptyStackIsElseBlock = true;
								} else {
									complexStateStack[complexStateStack.length - 1][2] = true;
								}
							case 'return':
							case 'satisfies':
								elseLineNumber = lineNumber;
								xpathNestingLevel = ifElseStackLength > 0 ? ifElseStack[ifElseStackLength - 1] : 0;
								if (ifElseStack.length > 0) {
									ifElseStack.pop();
								}
								indent = -1;
								break;
						}
						break;
					case TokenLevelState.operator:
						switch (xpathCharType) {
							case CharLevelState.lB:
							case CharLevelState.lPr:
							case CharLevelState.lBr:
								complexStateStack.push([xpathNestingLevel, [], false]);
								xpathNestingLevel++;
								indent = -1;
								break;
							case CharLevelState.rB:
							case CharLevelState.rPr:
							case CharLevelState.rBr:
								if (complexStateStack.length > 0) {
									xpathNestingLevel = bracketNesting;
									complexStateStack.pop();
								} else {
									xpathNestingLevel = 0;
								}
								break;
							case CharLevelState.dSep:
								let valueText = token.value;
								if (valueText === ':=') {
									indent = -1;
								}
								break;
							case CharLevelState.sep:
								if (token.value === ',') {
									if (isElseBlock) {
										xpathNestingLevel--;
										if (complexStateStack.length === 0) {
											emptyStackIsElseBlock = false;
										} else {
											complexStateStack[complexStateStack.length - 1][2] = false;
										}
									}
								}
								break;
						}
						break;
				}
			}

			if (addNewLine && lineNumberDiff === 0) {
				lineNumberDiff = 1;
			}
			if (this.onType && result.length > 0) {
			} else if (this.isCloseTag) {
				if (nestingLevel > 0 && closeTagName !== null && this.closeTagPos !== null) {
					let nonWsStart = this.closeTagLine ? XMLDocumentFormattingProvider.firstNonWhitespaceCharacterIndex(this.closeTagLine) : 0;
					let replacementString = '';
					let edit: monaco.languages.TextEdit;
					if ((nonWsStart + 2) === this.closeTagPos.column) {
						let requiredIndentLength = ((nestingLevel - 1) * indentCharLength);
						replacementString = indentString.repeat(requiredIndentLength);
						replacementString += '</' + closeTagName + '>';
						let startPos = new monaco.Position(this.closeTagPos.lineNumber, 1);
						let endPos = new monaco.Position(this.closeTagPos.lineNumber, token.startCharacter + 3);
						edit = { 
							text: replacementString, 
							range: { 
								startLineNumber: this.closeTagPos.lineNumber, 
								startColumn: 1, 
								endLineNumber: this.closeTagPos.lineNumber, 
								endColumn: token.startCharacter + 3
							}
						}

					} else {
						edit = { 
							text: '>', 
							range: { 
								startLineNumber: this.closeTagPos.lineNumber, 
								startColumn: this.closeTagPos.column, 
								endLineNumber: this.closeTagPos.lineNumber, 
								endColumn: this.closeTagPos.column
							}
						}
					}
					closeTagName = null;
					result.push(edit);

				}
			} else if (!withinCDATA && lineNumber >= startFormattingLineNumber && lineNumberDiff > 0) {
				// process any skipped lines (text not in tokens):
				for (let i = lineNumberDiff - 1; i > -1; i--) {
					let loopLineNumber = lineNumber - i;
					const currentLine = document.getLineContent(loopLineNumber);
					// token may not be at start of line
					let actualIndentLength = XMLDocumentFormattingProvider.firstNonWhitespaceCharacterIndex(currentLine);
					let preserveSpace = stackLength > 0 ? xmlSpacePreserveStack[stackLength - 1] : false;

					let totalAttributeOffset;
					if (!isXMLToken && this.minimiseXPathIndents) {
						totalAttributeOffset = 0;
					} else {
						totalAttributeOffset = attributeValueOffset > 0 ? attributeValueOffset : attributeNameOffset;
					}

					let indentExtraAsNoNameIndent = (!nameIndentRequired && !isXMLToken) && this.docType !== DocumentTypes.XPath ? 1 : 0;
					// guard against attempt to indent negative:
					let guardedNestingLevel = xpathNestingLevel > -1 ? xpathNestingLevel : 0;
					let requiredIndentLength = totalAttributeOffset + ((nestingLevel + guardedNestingLevel + indentExtraAsNoNameIndent) * indentCharLength);
					if (totalAttributeOffset > 0) {
						indent = -1 + indent;
					}
					if (i > 0) {
						// on a missed line, ignore outdent
					} else {
						requiredIndentLength += (indent * indentCharLength);
					}
					requiredIndentLength = requiredIndentLength < 0 ? 0 : requiredIndentLength;

					if (!(preserveSpace || isPreserveSpaceElement)) {
						if (this.replaceIndendation) {
							if (addNewLine) {
								let replacementString = newLineString + indentString.repeat(requiredIndentLength);

								const edit: monaco.languages.TextEdit = { 
									text: replacementString, 
									range: { 
										startLineNumber: loopLineNumber + 1, 
										startColumn: token.startCharacter + 1, 
										endLineNumber: loopLineNumber + 1, 
										endColumn: token.startCharacter + 1
									}
								}
								result.push(edit);
							} else {
								let replacementString = indentString.repeat(requiredIndentLength);
								result.push(this.getReplaceLineIndentTextEdit(loopLineNumber + 1, currentLine, replacementString));
							}
						} else if (actualIndentLength !== requiredIndentLength) {
							let indentLengthDiff = requiredIndentLength - actualIndentLength;
							if (indentLengthDiff > 0) {
								const replacementString = newLineString + indentString.repeat(indentLengthDiff);
								const edit: monaco.languages.TextEdit = { 
									text: replacementString, 
									range: { 
										startLineNumber: loopLineNumber + 1, 
										startColumn: 1, 
										endLineNumber: loopLineNumber + 1, 
										endColumn: 1
									}
								}
								result.push(edit);
							} else {
								const replacementString = '';
								const edit: monaco.languages.TextEdit = { 
									text: replacementString, 
									range: { 
										startLineNumber: loopLineNumber + 1, 
										startColumn: 1, 
										endLineNumber: loopLineNumber + 1, 
										endColumn: 1 - indentLengthDiff 
									}
								}
								result.push(edit);
							}
						}
					}
				}
			}
			withinCDATA = false;
			prevLineNumber = lineNumber;
			nestingLevel = newNestingLevel;
			multiLineState = newMultiLineState;
			prevToken = token;
		});
		this.isCloseTag = false;
		return result;
	}

	private shouldAddNewLine(documenthasNewLines: HasCharacteristic, prevToken: BaseToken | null, token: BaseToken): boolean {
		let addNewLine = false;

		if (documenthasNewLines === HasCharacteristic.no) {
			if (this.indentMixedContent) {
				addNewLine = true;
			} else {
				// TODO!!! check if prevtoken was a right-close-tag or a self-closing tag or comment????
				let pct = prevToken?.charType;
				addNewLine = pct === XMLCharState.rSelfCt || pct === XMLCharState.rSt || pct === XMLCharState.rCt ||
					pct === XMLCharState.rSelfCtNoAtt || pct === XMLCharState.rStNoAtt ||
					pct === XMLCharState.rComment || pct === XMLCharState.rPi;
			}
		} else if (this.indentMixedContent) {
      // add a new line if we're on the same line
			addNewLine = prevToken?.line === token.line;
		}
		return addNewLine;
	}

	private getReplaceLineIndentTextEdit = (lineNumber: number, currentLine: string, indentString: string): monaco.languages.TextEdit => {
		const nonWSPos = XMLDocumentFormattingProvider.firstNonWhitespaceCharacterIndex(currentLine);
		if (nonWSPos === 0) {
			const edit: monaco.languages.TextEdit = { 
				text: indentString, 
				range: { 
					startLineNumber: lineNumber, 
					startColumn: 1, 
					endLineNumber: lineNumber, 
					endColumn: 1
				}
			}
			return edit;
		} else {
			const edit: monaco.languages.TextEdit = { 
				text: indentString, 
				range: { 
					startLineNumber: lineNumber, 
					startColumn: 1, 
					endLineNumber: lineNumber, 
					endColumn: nonWSPos + 1
				}
			}
			return edit;
		}
	}

	static getTextForToken(lineNumber: number, token: BaseToken, document: monaco.editor.IModel) {
		let start = token.startCharacter;
		if (start < 0) {
			console.error("ERROR: Found illegal token for document: " + document.uri);
			console.error("token.startCharacter less than zero: " + token.startCharacter);
			console.error(token);
			start = 0;
		}

		const lineText = document.getLineContent(lineNumber);
		const startColumn = token.startCharacter + 1;
		const endColumn = token.startCharacter + token.length + 1;

		let valueText = lineText.substring(startColumn, endColumn);
		return valueText;
	}

	static firstNonWhitespaceCharacterIndex(text: string) { return text.search(/\S/)};

	static getTextForModel(doc: monaco.editor.ITextModel, range?: monaco.Range) {
		if (range) {
			const rangeStartLine = range.startLineNumber;
			const rangeEndLine = range.endLineNumber;
			if (rangeStartLine === rangeEndLine) {
				return doc.getLineContent(rangeStartLine).substring(range.startColumn -1, range.endColumn - 1);
			} else {
				const lines: string[] = [];
				for (let i = rangeStartLine; i <= range.endLineNumber; i++) {
					const lineText = doc.getLineContent(i);
					if (i === rangeStartLine) {
						lines.push(lineText.substring(range.startColumn - 1));
					} else if (i === rangeEndLine) {
						lines.push(lineText.substring(0, range.endColumn - 1));
					} else {
						lines.push(lineText);
					}
				}
				return lines.join('\n');
			}
		} else {
			const lines = doc.getLinesContent();
			return lines.join('\n');
		}
	}
}




enum MultiLineState {
	None,
	Start,
	Middle
}
