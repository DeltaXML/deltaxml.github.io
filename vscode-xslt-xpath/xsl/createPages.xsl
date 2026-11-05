<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:array="http://www.w3.org/2005/xpath-functions/array"
                xmlns:map="http://www.w3.org/2005/xpath-functions/map"
                xmlns:math="http://www.w3.org/2005/xpath-functions/math"
                xmlns:f="urn:local:functions"
                exclude-result-prefixes="#all"
                expand-text="yes"
                version="3.0">
  
  <xsl:output method="html" version="5.0" indent="no"/>
  <xsl:mode name="copyPage" on-no-match="shallow-copy"/>
  
  <!-- the source document is authoring/layout.xml: the page shell - its head, top bar and nav, which lists the pages -
       each page's content is authoring/<page>.xml, and the page is written to <page>.html in the site folder -->
  <xsl:variable name="siteDir" as="xs:string" select="resolve-uri('../', static-base-uri())"/>
  <xsl:variable name="indexTitle" as="xs:string" select="normalize-space(/html/head/title)"/>

  <xsl:template match="/">
    <xsl:apply-templates/>
    <xsl:call-template name="searchIndex"/>
    <xsl:call-template name="allPages"/>
  </xsl:template>

  <!-- all-pages.html: every page in the nav, in order, after a cover and contents - for printing the whole guide, and
       for the PDF that WeasyPrint makes from it (the createVSCodePDF task, in .vscode/tasks.json). Pages share some
       ids, so each id is prefixed with its page's name and a double hyphen, and links between pages are rewritten to
       point within this page -->
  <xsl:template name="allPages">
    <xsl:variable name="navItems" as="element(li)*" select="/html/body//nav/ul/li"/>
    <xsl:variable name="pages" as="xs:string*" select="$navItems/a/@href ! substring-before(., '.html')"/>
    <xsl:variable name="guideTitle" as="xs:string" select="'XSLT and XPath for Visual Studio Code'"/>
    <xsl:result-document href="{resolve-uri('all-pages.html', $siteDir)}">
      <html lang="en">
        <head>
          <meta charset="UTF-8"/>
          <title>{$guideTitle} - User Guide</title>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <xsl:copy-of select="/html/head/meta[@name = ('description', 'author')]"/>
          <xsl:copy-of select="/html/head/link[@rel = ('stylesheet', 'icon')]"/>
          <link rel="stylesheet" href="./resources/all-pages.css"/>
        </head>
        <body class="all-pages">
          <div class="all-pages-bar">
            <a href="index.html">Back to the guide</a>
            <a href="vscode-xslt-xpath-guide.pdf">Download PDF</a>
            <button type="button" onclick="window.print()">Print or save as PDF</button>
          </div>
          <section class="cover">
            <img src="../resources/tiny-white-logo.png" alt="DeltaXignia"/>
            <h1>XSLT and XPath<br/>for Visual Studio Code</h1>
            <p class="cover-subtitle">User Guide</p>
          </section>
          <nav class="contents">
            <h2>Contents</h2>
            <ul>
              <xsl:for-each select="$navItems">
                <xsl:choose>
                  <xsl:when test="contains-token(@class, 'nav-heading')">
                    <li class="contents-group">{normalize-space(.)}</li>
                  </xsl:when>
                  <xsl:when test="a">
                    <xsl:variable name="page" as="xs:string" select="substring-before(a/@href, '.html')"/>
                    <xsl:variable name="sections" as="element()*" select="f:page-content($page)//h3"/>
                    <li class="contents-page">
                      <a href="#{$page}">{normalize-space(a)}</a>
                      <xsl:if test="exists($sections)">
                        <ul>
                          <xsl:for-each select="$sections">
                            <li><a href="#{$page}--{f:heading-id(.)}">{normalize-space(.)}</a></li>
                          </xsl:for-each>
                        </ul>
                      </xsl:if>
                    </li>
                  </xsl:when>
                </xsl:choose>
              </xsl:for-each>
            </ul>
          </nav>
          <xsl:for-each select="$navItems/a">
            <xsl:variable name="page" as="xs:string" select="substring-before(@href, '.html')"/>
            <article class="main doc-page" id="{$page}">
              <h2 class="pageTitle">{normalize-space(.)}</h2>
              <xsl:apply-templates select="f:page-content($page)/node()" mode="combined">
                <xsl:with-param name="page" as="xs:string" select="$page" tunnel="yes"/>
                <xsl:with-param name="pages" as="xs:string*" select="$pages" tunnel="yes"/>
              </xsl:apply-templates>
            </article>
          </xsl:for-each>
        </body>
      </html>
    </xsl:result-document>
  </xsl:template>

  <!-- a page's content: the main div of authoring/<page>.xml -->
  <xsl:function name="f:page-content" as="element()?">
    <xsl:param name="page" as="xs:string"/>
    <xsl:sequence select="doc(resolve-uri('authoring/' || $page || '.xml', $siteDir))//div[@class eq 'main']"/>
  </xsl:function>

  <!-- a page's content in all-pages.html: ids prefixed with the page's name, and links between pages within it -->
  <xsl:mode name="combined" on-no-match="shallow-copy"/>

  <xsl:template match="h3 | h4 | h5" mode="combined">
    <xsl:param name="page" as="xs:string" tunnel="yes"/>
    <xsl:copy>
      <xsl:apply-templates select="@* except @id" mode="#current"/>
      <xsl:attribute name="id" select="$page || '--' || f:heading-id(.)"/>
      <xsl:apply-templates select="node()" mode="#current"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="@id" mode="combined">
    <xsl:param name="page" as="xs:string" tunnel="yes"/>
    <xsl:attribute name="id" select="$page || '--' || ."/>
  </xsl:template>

  <!-- a link to a section - e.g. debugger.html#xpath, or #xpath on the debugger page - goes to the section's prefixed
       id, and a link to a page - e.g. debugger.html - to #debugger; links to other sites, and to pages that aren't in
       the nav, are unchanged -->
  <xsl:template match="a/@href" mode="combined">
    <xsl:param name="page" as="xs:string" tunnel="yes"/>
    <xsl:param name="pages" as="xs:string*" tunnel="yes"/>
    <xsl:variable name="toPage" as="xs:boolean" select="matches(., '^[a-z0-9\-]+\.html(#.+)?$')"/>
    <xsl:variable name="toSection" as="xs:boolean" select="matches(., '^#.+$')"/>
    <xsl:variable name="target" as="xs:string" select="if ($toPage) then substring-before(., '.html') else $page"/>
    <xsl:variable name="fragment" as="xs:string?" select="substring-after(., '#')[. ne '']"/>
    <xsl:attribute name="href" select="
      if (($toPage or $toSection) and $target = $pages) then '#' || $target || ($fragment ! ('--' || .))
      else ."/>
  </xsl:template>

  <!-- resources/search-index.js, for search.js: an entry for each section of each page in the nav - the text before
       the first heading, and each h3, h4 and h5 with the content up to the next heading. It's a script, not JSON, so
       that it loads from file: URLs too -->
  <xsl:template name="searchIndex">
    <xsl:variable name="entries" as="map(*)*">
      <xsl:for-each select="/html/body//nav//li/a">
        <xsl:variable name="href" as="xs:string" select="string(@href)"/>
        <xsl:variable name="mainDiv" as="element()?" select="doc(resolve-uri('authoring/' || substring-before($href, '.') || '.xml', $siteDir))//div[@class eq 'main']"/>
        <xsl:variable name="column" as="element()?" select="($mainDiv/div[contains-token(@class, 'two-thirds')], $mainDiv)[1]"/>
        <xsl:variable name="page" as="xs:string" select="normalize-space(.)"/>
        <xsl:for-each-group select="f:section-flow($column/node())" group-starting-with="h3 | h4 | h5">
          <xsl:variable name="heading" as="element()?" select="current-group()[1][self::h3 | self::h4 | self::h5]"/>
          <xsl:variable name="text" as="xs:string"
                        select="normalize-space(string-join((current-group() except $heading) ! string(), ' '))"/>
          <xsl:if test="exists($heading) or $text ne ''">
            <xsl:sequence select="map {
              'page': $page,
              'section': string($heading ! normalize-space()),
              'url': $href || ($heading ! ('#' || f:heading-id(.))),
              'text': $text
            }"/>
          </xsl:if>
        </xsl:for-each-group>
      </xsl:for-each>
    </xsl:variable>
    <xsl:result-document href="{resolve-uri('resources/search-index.js', $siteDir)}" method="text" encoding="UTF-8">
      <xsl:text>// Generated by createPages.xsl - the documentation's sections, searched by search.js&#10;</xsl:text>
      <xsl:text>window.SEARCH_INDEX = </xsl:text>
      <xsl:value-of select="serialize(array { $entries }, map { 'method': 'json' })"/>
      <xsl:text>;&#10;</xsl:text>
    </xsl:result-document>
  </xsl:template>

  <!-- a column's content with the elements that only group its sections - e.g. the features page's cards - replaced by
       their contents, so that each heading is followed by the content up to the next one -->
  <xsl:function name="f:section-flow" as="node()*">
    <xsl:param name="nodes" as="node()*"/>
    <xsl:sequence select="$nodes ! (if (.//(h3 | h4 | h5)) then f:section-flow(node()) else .)"/>
  </xsl:function>

  <xsl:template match="nav//ul" mode="#default">
    <xsl:apply-templates select="li/a/@href"/>    
  </xsl:template>
  
  <xsl:template match="@href" mode="#default">
    <xsl:call-template name="makePage"/>
  </xsl:template>

  <xsl:template name="makePage">
    <xsl:variable name="filePart" as="xs:string" select="substring-before(., '.')"/>
    <xsl:variable name="outputFilename" as="xs:string" select="resolve-uri($filePart || '.html', $siteDir)"/>
    <xsl:variable name="inputFilename" as="xs:string" select="resolve-uri('authoring/' || $filePart || '.xml', $siteDir)"/>
    
    <xsl:result-document href="{$outputFilename }">
      <xsl:apply-templates select="/*" mode="copyPage">
        <xsl:with-param name="pageTitle" as="xs:string" select="./parent::a/text()" tunnel="yes"/>
        <xsl:with-param name="filePart" select="$filePart || '.html'" tunnel="yes"/>
        <xsl:with-param name="mainDiv" select="doc($inputFilename)//div[@class eq 'main']" tunnel="yes"/>
      </xsl:apply-templates>
    </xsl:result-document>
  </xsl:template>
  
  <!-- the home page (index.html) has the site's title alone -->
  <xsl:template match="title" mode="copyPage">
    <xsl:param name="pageTitle" as="xs:string" tunnel="yes"/>
    <xsl:param name="filePart" as="xs:string" tunnel="yes"/>
    <xsl:copy>
      <xsl:value-of select="if ($filePart eq 'index.html') then $indexTitle else $pageTitle || ' | ' || $indexTitle"/>
    </xsl:copy>
  </xsl:template>
  
  <xsl:template match="div[@class eq 'main']" mode="copyPage">
    <xsl:param name="pageTitle" as="xs:string" tunnel="yes"/>
    <xsl:param name="mainDiv" as="element()" tunnel="yes"/>

    <div class="main">
      <h2 class="pageTitle">{$pageTitle}</h2>
      <xsl:apply-templates select="$mainDiv/node()" mode="content"/>
    </div>
  </xsl:template>

  <!-- the page's content, with an id on each heading listed in 'On this page' -->
  <xsl:mode name="content" on-no-match="shallow-copy"/>

  <xsl:template match="h3 | h4 | h5" mode="content">
    <xsl:copy>
      <xsl:apply-templates select="@*" mode="#current"/>
      <xsl:attribute name="id" select="f:heading-id(.)"/>
      <xsl:apply-templates select="node()" mode="#current"/>
    </xsl:copy>
  </xsl:template>

  <!-- a heading's own id, or one made from its text, e.g. 'Pausing on errors' gives 'pausing-on-errors' -->
  <xsl:function name="f:heading-id" as="xs:string">
    <xsl:param name="heading" as="element()"/>
    <xsl:sequence select="($heading/@id, replace(lower-case(normalize-space($heading)), '[^a-z0-9]+', '-') => replace('^-|-$', ''))[1]"/>
  </xsl:function>

  <!-- the 'On this page' column, after the main div: each h3, with the h4 and h5 headings that follow it -->
  <xsl:template match="div[@class eq 'wrapper']" mode="copyPage">
    <xsl:param name="mainDiv" as="element()" tunnel="yes"/>
    <xsl:copy>
      <xsl:apply-templates select="@* | node()" mode="#current"/>
      <xsl:variable name="headings" as="element()*" select="$mainDiv//(h3 | h4 | h5)"/>
      <xsl:if test="count($headings[self::h3]) ge 2">
        <div class="page-toc">
          <p class="page-toc-title">On this page</p>
          <ul>
            <xsl:for-each-group select="$headings" group-starting-with="h3">
              <li>
                <a href="#{f:heading-id(.)}">{normalize-space(.)}</a>
                <xsl:if test="tail(current-group())">
                  <ul>
                    <xsl:for-each select="tail(current-group())">
                      <li><a href="#{f:heading-id(.)}">{normalize-space(.)}</a></li>
                    </xsl:for-each>
                  </ul>
                </xsl:if>
              </li>
            </xsl:for-each-group>
          </ul>
        </div>
        <script src="resources/page-toc.js" defer="defer"></script>
      </xsl:if>
    </xsl:copy>
  </xsl:template>
  
  <xsl:template match="nav//ul/li/a" mode="copyPage">
    <xsl:param name="filePart" as="xs:string" tunnel="yes"/>
    <xsl:copy>
      <xsl:apply-templates select="@* except @class" mode="#current"/>
      
      <xsl:if test="$filePart eq @href">
        <xsl:attribute name="class" select="'active'"/>
      </xsl:if>
      <xsl:apply-templates select="node()" mode="#current"/>
    </xsl:copy>
  </xsl:template>
  
</xsl:stylesheet>