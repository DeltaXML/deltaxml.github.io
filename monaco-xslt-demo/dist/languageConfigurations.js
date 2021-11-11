define(["require", "exports", "./xslLexer", "./xsltSchema", "./xsltSnippets", "./xmlSnippets"], function (require, exports, xslLexer_1, xsltSchema_1, xsltSnippets_1, xmlSnippets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XSLTLightConfiguration = exports.XMLConfiguration = exports.XPathConfiguration = exports.XSLTConfiguration = void 0;
    var XSLTConfiguration = /** @class */ (function () {
        function XSLTConfiguration() {
        }
        // Note: Non-standard 'else', 'then', 'on-duplicates' can be used in Saxon 10.0
        XSLTConfiguration.expressionAtts = ['context-item', 'count', 'else', 'from', 'group-adjacent', 'group-by', 'group-ending-with', 'group-starting-with', 'from', 'for-each-item', 'for-each-source', 'initial-value',
            'key', 'match', 'namespace-context', 'on-duplicates', 'select', 'test', 'then', 'use', 'use-when', 'value', 'with-params', 'xpath'];
        XSLTConfiguration.avtAtts = ['allow-duplicate-names', 'base-uri', 'build-tree', 'byte-order-mark', 'case-order', 'cdata-section-elements', 'collation', 'data-type', 'doctype-public', 'doctype-system', 'encoding', 'error-code',
            'escape-uri-attributes', 'flags', 'format', 'grouping-separator', 'grouping-size', 'href', 'html-version', 'include-context-type', 'indent', 'item-separator', 'json-node-output-method',
            'lang', 'letter-value', 'media-type', 'method', 'name', 'namespace', 'normalization-form', 'omit-xml-declaration', 'order', 'ordinal', 'ordinal-type', 'output-version',
            'parameter-document', 'regex', 'separator', 'schema-aware', 'stable', 'standalone', 'suppress-indentaion', 'terminate', 'undeclar-prefixes', 'start-at'];
        XSLTConfiguration.xsltPrefix = 'xsl';
        XSLTConfiguration.configuration = {
            expressionAtts: XSLTConfiguration.expressionAtts,
            variableElementNames: ['xsl:variable', 'xsl:param'],
            avtAtts: XSLTConfiguration.avtAtts,
            nativePrefix: XSLTConfiguration.xsltPrefix,
            tvtAttributes: ['expand-text'],
            nonNativeAvts: true,
            rootElementSnippets: xsltSnippets_1.XSLTSnippets.xsltRootTags,
            schemaData: new xsltSchema_1.XSLTSchema(),
            docType: xslLexer_1.DocumentTypes.XSLT
        };
        return XSLTConfiguration;
    }());
    exports.XSLTConfiguration = XSLTConfiguration;
    var XPathConfiguration = /** @class */ (function () {
        function XPathConfiguration() {
        }
        XPathConfiguration.configuration = {
            expressionAtts: [],
            variableElementNames: [],
            nativePrefix: '',
            tvtAttributes: [],
            nonNativeAvts: true,
            rootElementSnippets: [],
            docType: xslLexer_1.DocumentTypes.XPath
        };
        return XPathConfiguration;
    }());
    exports.XPathConfiguration = XPathConfiguration;
    var XMLConfiguration = /** @class */ (function () {
        function XMLConfiguration() {
        }
        XMLConfiguration.configuration = {
            expressionAtts: [],
            variableElementNames: [],
            nativePrefix: 'qz',
            tvtAttributes: [],
            nonNativeAvts: false,
            rootElementSnippets: xmlSnippets_1.XMLSnippets.xsltRootTags,
            elementSnippets: xmlSnippets_1.XMLSnippets.generalTags,
            docType: xslLexer_1.DocumentTypes.Other
        };
        return XMLConfiguration;
    }());
    exports.XMLConfiguration = XMLConfiguration;
    var XSLTLightConfiguration = /** @class */ (function () {
        function XSLTLightConfiguration() {
        }
        // used for global instruction processing only
        XSLTLightConfiguration.configuration = {
            expressionAtts: [],
            variableElementNames: [],
            nativePrefix: 'xsl',
            tvtAttributes: [],
            nonNativeAvts: false,
            docType: xslLexer_1.DocumentTypes.XSLT
        };
        return XSLTLightConfiguration;
    }());
    exports.XSLTLightConfiguration = XSLTLightConfiguration;
});
//# sourceMappingURL=languageConfigurations.js.map