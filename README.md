# deltaxml.github.io

The `master` branch is what's published at https://deltaxml.github.io by GitHub Pages. Changes for the next
release of the XSLT/XPath extension are made on a release branch (e.g. `release2.1`) and merged to `master`
when the extension is released.

## Authoring notes for the vscode-xslt-xpath extension documentation

Each page of the user guide, `vscode-xslt-xpath/<page>.html`, is generated from `vscode-xslt-xpath/authoring/<page>.xml`,
which holds just the page's content. The page shell - the head, top bar and nav that lists the pages - is
[authoring/layout.xml](vscode-xslt-xpath/authoring/layout.xml).

To generate the HTML from VS Code, with the XSLT extension installed, run the build task `createVSCodePages`
(the default build task). This runs [createPages.xsl](vscode-xslt-xpath/xsl/createPages.xsl), which writes:

- a page for each entry in the nav in `layout.xml`, with its title, a description for search results, its
  canonical URL and Open Graph tags in the head, and the 'On this page' contents
- JSON-LD structured data in each page's head: `SoftwareApplication` on the home page and `TechArticle` on the rest
- `/llms.txt` at the site's root: the guide's pages, with their titles and descriptions, for AI assistants
- `all-pages.html`, the whole guide as one page, for printing and for the PDF
- `resources/search-index.js`, for the guide's search box

A page's description is its first paragraph, cut to 160 characters. If the first paragraph doesn't describe the
page - it's a cross-reference, say - give the page its own description in a `<head>` in its authoring file:

```xml
<html lang="en">
	<head>
		<meta name="description" content="..."/>
	</head>
	<div class="main">
```

The same `<head>` can also hold a `<title>`, which is the page's title in search results and link previews - use the
words people search for, e.g. `XSLT Testing with XSpec in VS Code`, rather than the nav's label - and an `<h1>`, if the
page's heading should differ from its nav label (only the home page does). Without a `<title>`, the page is titled
`<nav label> | VS Code XSLT/XPath`.

The other tasks in [.vscode/tasks.json](.vscode/tasks.json):

- `createVSCodePDF` - the guide as a PDF, from `all-pages.html`. Needs WeasyPrint (`brew install weasyprint`).
- `createSitemap` - `/sitemap.xml`, for Google Search Console. See the release checklist below.

### Adding a page

1. Add `authoring/<page>.xml` with the content in a `<div class="main">`.
2. Add it to the nav in `authoring/layout.xml`. Pages that aren't in the nav aren't generated, searched, or listed in
   the sitemap.
3. Run `createVSCodePages`.

## Release checklist: merging the release branch to master

1. On the release branch, run `createVSCodePages` and `createVSCodePDF`, and commit the generated pages and PDF.
2. Merge the release branch to `master` and push. GitHub Pages deploys within a few minutes.
3. On `master`, run the `createSitemap` task and commit and push `sitemap.xml`. It lists the pages in the nav,
   each with the date of the last commit that touched it, which is why it's generated after the merge: Google uses
   those dates to decide what to recrawl. Don't push a sitemap that lists pages `master` doesn't have yet - Google
   would fetch URLs that 404.
4. In [Google Search Console](https://search.google.com/search-console), the sitemap at
   https://deltaxml.github.io/sitemap.xml is already submitted, so Google picks the new one up on its own:
   there's no need to resubmit it. Its status may show 'Couldn't fetch' for a day or two after a change -
   that's Google's processing queue, not a problem with the site.
5. Ask Google to crawl the pages you want in search results soon - new pages, and ones with substantial
   changes. Google finds the rest from the nav links and the sitemap on its own schedule, which can take
   weeks. For each page:
   1. Paste the page's URL, e.g. `https://deltaxml.github.io/vscode-xslt-xpath/schematron.html`, into the
      search box at the top of Search Console (URL Inspection).
   2. Click 'Test live URL' and wait for the test to finish. The 'Live test' tab should say the page is
      available. ('URL is not on Google' on the 'Google Index' tab just means it isn't indexed yet.)
   3. Click 'Request indexing'. 'Added to a priority crawl queue' means it worked. Requesting the same URL
      again doesn't move it up the queue, and there's a quota of roughly a dozen requests a day, so choose the
      pages that matter.
6. A few days later, check with a Google search for `site:deltaxml.github.io/vscode-xslt-xpath`, or inspect
   a URL again and look at the 'Google Index' tab.

`robots.txt` at the root allows all crawlers, including the AI ones, and points at the sitemap.

---

## Rationale

The HTML is generated with XSLT so that the page shell maintained in `layout.xml` - the head, top bar and
nav - is copied into every page, and the pages' descriptions, contents, search index and the all-pages version
come from the same source as the content.
