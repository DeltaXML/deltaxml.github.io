# deltaxml.github.io

## Authoring notes for the vscode-xslt-xpath extension documentation

All html files except index.html are generated from similarly named XML files that are maintained in the [vscode-xslt-xpath\authoring](https://github.com/DeltaXML/deltaxml.github.io/tree/master/vscode-xslt-xpath/authoring) directory.

To generate the HTML from VS Code, with the XSLT extension installed, you can run the VS Code task labelled `createVSCodePages`. This runs the very basic XSLT maintained at [createPages.xsl](https://github.com/DeltaXML/deltaxml.github.io/blob/master/vscode-xslt-xpath/xsl/createPages.xsl)

---

## Rationale

The rationale for generating the HTML with XSLT is so that the header and navigation maintained in `index.html` can be copied from this file to the HTML files when they are generated from their XML source.
