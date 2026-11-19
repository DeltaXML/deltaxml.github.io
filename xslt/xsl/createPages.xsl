<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:map="http://www.w3.org/2005/xpath-functions/map"
                xmlns:f="urn:local:functions"
                exclude-result-prefixes="#all"
                expand-text="yes"
                version="3.0">

  <xsl:output method="html" version="5.0" indent="no"/>
  <xsl:mode name="copyPage" on-no-match="shallow-copy"/>

  <!-- The source document is authoring/layout.xml: the page shell - its head, top bar and nav, which lists the pages.
       Each page's content is authoring/<page>.xml, and the page is written to <page>.html in this folder.
       This section is separate from the user guide (../vscode-xslt-xpath), but is built in the same way, and shares its
       styles and images. -->
  <xsl:variable name="siteDir" as="xs:string" select="resolve-uri('../', static-base-uri())"/>
  <xsl:variable name="siteTitle" as="xs:string" select="normalize-space(/html/head/title)"/>
  <!-- this section's public URL, for each page's canonical link and Open Graph tags - also the base URL in
       ../vscode-xslt-xpath/xsl/make-sitemap.sh -->
  <xsl:variable name="siteUrl" as="xs:string" select="'https://deltaxml.github.io/xslt/'"/>
  <xsl:variable name="guideUrl" as="xs:string" select="'https://deltaxml.github.io/vscode-xslt-xpath/'"/>
  <xsl:variable name="imageUrl" as="xs:string" select="$guideUrl || 'resources/og-image.png'"/>
  <xsl:variable name="marketplaceUrl" as="xs:string" select="'https://marketplace.visualstudio.com/items?itemName=deltaxml.xslt-xpath'"/>

  <xsl:template match="/">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="nav//ul" mode="#default">
    <xsl:apply-templates select="li/a/@href"/>
  </xsl:template>

  <xsl:template match="@href" mode="#default">
    <xsl:variable name="filePart" as="xs:string" select="substring-before(., '.')"/>
    <xsl:variable name="inputFilename" as="xs:string" select="resolve-uri('authoring/' || $filePart || '.xml', $siteDir)"/>
    <xsl:result-document href="{resolve-uri($filePart || '.html', $siteDir)}">
      <xsl:apply-templates select="/*" mode="copyPage">
        <xsl:with-param name="navLabel" as="xs:string" select="./parent::a/text()" tunnel="yes"/>
        <xsl:with-param name="filePart" select="$filePart || '.html'" tunnel="yes"/>
        <xsl:with-param name="mainDiv" select="doc($inputFilename)//div[@class eq 'main']" tunnel="yes"/>
      </xsl:apply-templates>
    </xsl:result-document>
  </xsl:template>

  <!-- the page's title: its own, if its authoring file has a <title> in its head - the words people search for -
       otherwise its nav label and the site's title -->
  <xsl:function name="f:page-title" as="xs:string">
    <xsl:param name="navLabel" as="xs:string"/>
    <xsl:param name="mainDiv" as="element()?"/>
    <xsl:sequence select="(root($mainDiv)//head/title ! normalize-space(), $navLabel || ' | ' || $siteTitle)[1]"/>
  </xsl:function>

  <!-- the page's heading: its own, if its head has an <h1>, otherwise its nav label -->
  <xsl:function name="f:page-heading" as="xs:string">
    <xsl:param name="navLabel" as="xs:string"/>
    <xsl:param name="mainDiv" as="element()?"/>
    <xsl:sequence select="(root($mainDiv)//head/h1 ! normalize-space(), $navLabel)[1]"/>
  </xsl:function>

  <xsl:template match="title" mode="copyPage">
    <xsl:param name="navLabel" as="xs:string" tunnel="yes"/>
    <xsl:param name="mainDiv" as="element()?" tunnel="yes"/>
    <xsl:copy>
      <xsl:value-of select="f:page-title($navLabel, $mainDiv)"/>
    </xsl:copy>
  </xsl:template>

  <!-- the page's description, from its authoring file's head, then its canonical URL and the Open Graph and Twitter tags
       that links to it are previewed with, and its structured data -->
  <xsl:template match="meta[@name eq 'description']" mode="copyPage">
    <xsl:param name="navLabel" as="xs:string" tunnel="yes"/>
    <xsl:param name="filePart" as="xs:string" tunnel="yes"/>
    <xsl:param name="mainDiv" as="element()?" tunnel="yes"/>
    <xsl:variable name="description" as="xs:string"
                  select="(root($mainDiv)//head/meta[@name eq 'description']/@content ! normalize-space(), string(@content))[1]"/>
    <xsl:variable name="title" as="xs:string" select="f:page-title($navLabel, $mainDiv)"/>
    <xsl:variable name="url" as="xs:string" select="$siteUrl || $filePart[. ne 'index.html']"/>
    <meta name="description" content="{$description}"/>
    <link rel="canonical" href="{$url}"/>
    <meta property="og:type" content="{if ($filePart eq 'index.html') then 'website' else 'article'}"/>
    <meta property="og:site_name" content="{$siteTitle}"/>
    <meta property="og:title" content="{$title}"/>
    <meta property="og:description" content="{$description}"/>
    <meta property="og:url" content="{$url}"/>
    <meta property="og:image" content="{$imageUrl}"/>
    <meta property="og:image:width" content="1200"/>
    <meta property="og:image:height" content="630"/>
    <meta property="og:image:alt" content="The XSLT debugger in Visual Studio Code, stopped at a breakpoint in a stylesheet"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <script type="application/ld+json">{f:json-ld($filePart, $title, $description, $url, $mainDiv)}</script>
  </xsl:template>

  <!-- the page's structured data, for search engines and AI assistants: the overview is a collection of the pages, each
       other page is an article about the extension - and a page with a FAQ (a div of class faq, with a heading for each
       question and the paragraphs that answer it) also says so -->
  <xsl:function name="f:json-ld" as="xs:string">
    <xsl:param name="filePart" as="xs:string"/>
    <xsl:param name="title" as="xs:string"/>
    <xsl:param name="description" as="xs:string"/>
    <xsl:param name="url" as="xs:string"/>
    <xsl:param name="mainDiv" as="element()?"/>
    <xsl:variable name="publisher" as="map(*)" select="map {
      '@type': 'Organization', 'name': 'DeltaXignia', 'url': 'https://www.deltaxml.com/' }"/>
    <xsl:variable name="about" as="map(*)" select="map {
      '@type': 'SoftwareApplication', 'name': 'XSLT/XPath for Visual Studio Code', 'url': $guideUrl,
      'installUrl': $marketplaceUrl, 'applicationCategory': 'DeveloperApplication' }"/>
    <xsl:variable name="page" as="map(*)" select="map {
      '@context': 'https://schema.org',
      '@type': if ($filePart eq 'index.html') then 'CollectionPage' else 'TechArticle',
      'headline': $title,
      'name': $title,
      'description': $description,
      'url': $url,
      'mainEntityOfPage': $url,
      'image': $imageUrl,
      'about': $about,
      'isPartOf': map { '@type': 'WebSite', 'name': $siteTitle, 'url': $siteUrl },
      'author': $publisher,
      'publisher': $publisher
    }"/>
    <xsl:variable name="questions" as="map(*)*">
      <xsl:for-each select="$mainDiv//div[contains-token(@class, 'faq')]/h3">
        <xsl:variable name="answer" as="xs:string" select="normalize-space(string-join(
          following-sibling::*[not(self::h3)][preceding-sibling::h3[1] is current()] ! string(), ' '))"/>
        <xsl:sequence select="map {
          '@type': 'Question',
          'name': normalize-space(.),
          'acceptedAnswer': map { '@type': 'Answer', 'text': $answer }
        }"/>
      </xsl:for-each>
    </xsl:variable>
    <xsl:variable name="faq" as="map(*)?" select="
      if (exists($questions)) then map { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': array { $questions } }
      else ()"/>
    <xsl:sequence select="serialize(array { $page, $faq }, map { 'method': 'json', 'indent': false(), 'escape-solidus': false() })"/>
  </xsl:function>

  <xsl:template match="div[@class eq 'main']" mode="copyPage">
    <xsl:param name="navLabel" as="xs:string" tunnel="yes"/>
    <xsl:param name="mainDiv" as="element()" tunnel="yes"/>
    <main class="main" id="main" tabindex="-1">
      <h1 class="pageTitle">{f:page-heading($navLabel, $mainDiv)}</h1>
      <xsl:apply-templates select="$mainDiv/node()" mode="copyPage"/>
    </main>
  </xsl:template>

  <xsl:template match="nav//ul/li/a" mode="copyPage">
    <xsl:param name="filePart" as="xs:string" tunnel="yes"/>
    <xsl:copy>
      <xsl:apply-templates select="@* except @class" mode="#current"/>
      <xsl:if test="$filePart eq @href">
        <xsl:attribute name="class" select="'active'"/>
        <xsl:attribute name="aria-current" select="'page'"/>
      </xsl:if>
      <xsl:apply-templates select="node()" mode="#current"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
