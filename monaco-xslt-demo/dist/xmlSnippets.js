define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XMLSnippets = void 0;
    var XMLSnippets = /** @class */ (function () {
        function XMLSnippets() {
        }
        XMLSnippets.xsltRootTags = [
            {
                name: 'XML Root Element Snippet',
                description: 'Basic XML Template',
                body: "?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<${1:element} ${2:attribute}=\"${3:value}\">\n\t\t\t \n\t<${4:childElement}>\n\t\t$0\n\t</${4:childElement}>\n\t\t\t \n</${1:element}>"
            }
        ];
        XMLSnippets.generalTags = [
            {
                name: 'block-start-end-tag-with',
                description: 'with attribute',
                body: "${1:element} ${2:attribute}=\"${3:value}\">\t\t\t \n\t$0\t\t\t\t\t\t \n</${1:element}>"
            },
            {
                name: 'inline-start-end-tag-with',
                description: 'with attribute',
                body: "${1:element} ${2:attribute}=\"${3:value}\">${4:text}</${1:element}>$0"
            },
            {
                name: 'self-closed-tag-with',
                description: 'with attribute',
                body: "${1:element} ${2:attribute}=\"${3:value}\"$0/>"
            },
            {
                name: 'block-start-end-tag',
                description: 'no attribute',
                body: "${1:element}>\t\t\t \n\t$0\t\t\t\t\t\t \n</${1:element}>"
            },
            {
                name: 'inline-start-end-tag',
                description: 'no attribute',
                body: "${1:element}>${2:text}</${1:element}>$0"
            },
            {
                name: 'self-closed-tag',
                description: 'no attribute',
                body: "${1:element}$0/>"
            }
        ];
        XMLSnippets.generalAttributes = [
            {
                name: 'attribute',
                description: 'attribute name="value"',
                body: "${1:name}=\"${2:value}\"$0"
            }
        ];
        return XMLSnippets;
    }());
    exports.XMLSnippets = XMLSnippets;
});
//# sourceMappingURL=xmlSnippets.js.map