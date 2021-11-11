define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XSLTSnippets = void 0;
    var XSLTSnippets = /** @class */ (function () {
        function XSLTSnippets() {
        }
        XSLTSnippets.xsltRootTags = [
            {
                name: 'xsl:stylesheet',
                description: 'xsl:stylesheet` snippet for identity transform ',
                body: "?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<xsl:stylesheet xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"\n                xmlns:xs=\"http://www.w3.org/2001/XMLSchema\"\n                xmlns:array=\"http://www.w3.org/2005/xpath-functions/array\"\n                xmlns:map=\"http://www.w3.org/2005/xpath-functions/map\"\n                xmlns:math=\"http://www.w3.org/2005/xpath-functions/math\"\n                exclude-result-prefixes=\"#all\"\n                expand-text=\"yes\"\n                version=\"3.0\">\n\n\t<xsl:output method=\"xml\" indent=\"yes\"/>\n\t<xsl:mode on-no-match=\"shallow-copy\"/>\n\n\t<xsl:template match=\"${1:/*}\" mode=\"#all\">\n\t\t<xsl:copy>\n\t\t\t<xsl:apply-templates select=\"${2:@*, node()}\" mode=\"#current\"/>\n\t\t</xsl:copy>\n\t</xsl:template>\n\n\t$0\n\n</xsl:stylesheet>"
            },
            {
                name: 'xsl:package',
                description: 'xsl:package` snippet - root element and required attributes',
                body: "?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<xsl:package xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"\n\t\t\t\t\t\t xmlns:xs=\"http://www.w3.org/2001/XMLSchema\"\n\t\t\t\t\t\t xmlns:array=\"http://www.w3.org/2005/xpath-functions/array\"\n\t\t\t\t\t\t xmlns:map=\"http://www.w3.org/2005/xpath-functions/map\"\n\t\t\t\t\t\t xmlns:math=\"http://www.w3.org/2005/xpath-functions/math\"\n\t\t\t\t\t\t name=\"${1:package-uri}\"\n\t\t\t\t\t\t package-version=\"1.0\"\n\t\t\t\t\t\t exclude-result-prefixes=\"#all\"\n\t\t\t\t\t\t expand-text=\"yes\"\n\t\t\t\t\t\t version=\"3.0\">\n\n\t<xsl:output method=\"xml\" indent=\"yes\"/>\n\t<xsl:mode name=\"${2:mode-name}\" streamable=\"false\" on-no-match=\"shallow-copy\" visibility=\"public\"/>\n\n\n\t<xsl:template match=\"${3:/*}\" mode=\"$2\">\n\t\t<xsl:copy>\n\t\t\t<xsl:apply-templates select=\"${4:@*, node()}\" mode=\"#current\"/>\n\t\t</xsl:copy>\n\t</xsl:template>\n\n\t$0\n\n</xsl:package>"
            },
        ];
        XSLTSnippets.xsltXMLNS = [
            {
                name: 'xmlns:xsl',
                description: 'W3C XSLT Namespace',
                body: "xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"$0",
            },
            {
                name: 'xmlns:xs',
                description: 'W3C XMLSchema Namespace',
                body: "xmlns:xs=\"http://www.w3.org/2001/XMLSchema\"$0"
            },
            {
                name: 'xmlns:array',
                description: 'W3C XPath Array Namespace',
                body: "xmlns:array=\"http://www.w3.org/2005/xpath-functions/array\"$0"
            },
            {
                name: 'xmlns:map',
                description: 'W3C XPath Map Namespace',
                body: "xmlns:map=\"http://www.w3.org/2005/xpath-functions/map\"$0"
            },
            {
                name: 'xmlns:math',
                description: 'W3C XPath Math Namespace',
                body: "xmlns:math=\"http://www.w3.org/2005/xpath-functions/math\"$0"
            },
            {
                name: 'xmlns:any',
                description: 'Generic namespace snippet',
                body: "xmlns:${1:prefix}=\"${2:namespace-uri}\"$0"
            },
            {
                name: 'xmlns:saxon',
                description: 'Saxonica Saxon XSLT Namespace',
                body: "xmlns:saxon=\"http://saxon.sf.net/\"$0"
            },
            {
                name: 'xmlns:sql',
                description: 'Saxonica Saxon SQL Namespace',
                body: "xmlns:sql=\"http://saxon.sf.net/sql\"$0"
            },
            {
                name: 'xmlns:ixsl',
                description: 'Saxonica Saxon-JS Interactive XSLT Namespace',
                body: "xmlns:ixsl=\"http://saxonica.com/ns/interactiveXSLT\"$0"
            },
            {
                name: 'xmlns:xhtml',
                description: 'W3C XHTML Namespace',
                body: "xmlns:xhtml=\"http://www.w3.org/1999/xhtml\"$0"
            },
            {
                name: 'xmlns:err',
                description: 'W3C XSLT Standard Error Namespace',
                body: "xmlns:err=\"http://www.w3.org/2005/xqt-errors\"$0"
            },
            {
                name: 'xmlns:xsi',
                description: 'W3C XML Schema Instance Namespace',
                body: "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"$0"
            },
            {
                name: 'xmlns:deltaxml',
                description: 'DeltaXML namespace',
                body: "xmlns:deltaxml=\"http://www.deltaxml.com/ns/well-formed-delta-v1\"$0"
            },
            {
                name: 'xmlns:dxa',
                description: 'DeltaXML non-namespaced attribute',
                body: "xmlns:dxa=\"http://www.deltaxml.com/ns/non-namespaced-attribute\"$0"
            },
            {
                name: 'xmlns:dxx',
                description: 'DeltaXML xml-namespaced attribute',
                body: "xmlns:dxx=\"http://www.deltaxml.com/ns/xml-namespaced-attribute\"$0"
            },
            {
                name: 'xmlns:preserve',
                description: 'DeltaXML preservation-item namespace',
                body: "xmlns:preserve=\"http://www.deltaxml.com/ns/preserve\"$0"
            },
            {
                name: 'xmlns:ignore',
                description: 'DeltaXML ignore-for-alignment namespace',
                body: "xmlns:ignore=\"http://www.deltaxml.com/ns/ignoreForAlignment\"$0"
            },
            {
                name: 'xmlns:pi',
                description: 'DeltaXML processing-instruction namespace',
                body: "xmlns:pi=\"http://www.deltaxml.com/ns/processing-instructions\"$0"
            },
            {
                name: 'xmlns:er',
                description: 'DeltaXML entity-references namespace',
                body: "xmlns:er=\"http://www.deltaxml.com/ns/entity-references\"$0"
            },
            {
                name: 'xmlns:docbook',
                description: 'Oasis DocBook namespace',
                body: "xmlns:docbook=\"http://docbook.org/ns/docbook\"$0"
            },
            {
                name: 'xmlns:xlink',
                description: 'W3C XLink namespace',
                body: "xmlns:xlink=\"http://www.w3.org/1999/xlink\"$0"
            },
            {
                name: 'xmlns:svg',
                description: 'W3C SVG namespace',
                body: "xmlns:svg=\"http://www.w3.org/2000/svg\"$0"
            },
        ];
        return XSLTSnippets;
    }());
    exports.XSLTSnippets = XSLTSnippets;
});
//# sourceMappingURL=xsltSnippets.js.map