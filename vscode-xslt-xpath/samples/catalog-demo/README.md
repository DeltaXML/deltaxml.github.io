# XML catalog demo

A sample folder for trying out XML catalogs with the XSLT/XPath extension for VS Code: a master catalog
(`catalog.xml`) that hands lookups on to a secondary catalog (`catalogs/libraries.xml`), which maps the URIs of two
XSLT libraries to their files - and a top-level stylesheet (`main.xsl`) that imports both libraries by those URIs.

Open this folder in VS Code: its `.vscode/settings.json` sets `"XSLT.resources.catalog": "catalog.xml"`.

For how it works, and things to try, see [XML Catalogs](https://deltaxml.github.io/vscode-xslt-xpath/xml-catalogs.html).
