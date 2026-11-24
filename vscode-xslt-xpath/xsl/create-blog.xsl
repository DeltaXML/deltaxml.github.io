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

  <!-- the blog: the source document is authoring/blog/blog-layout.xml - the page shell, with a nav that lists the posts,
       newest first. Each post is authoring/blog/<post>.xml, and is written to blog/<post>.html; the newest, the first in
       the nav, is also written as blog/index.html - the blog's address - with a canonical link to its own page, so that
       search engines count it once. The user guide is made by createPages.xsl, which shares common.xsl with this -->
  <xsl:include href="common.xsl"/>

  <xsl:variable name="siteDir" as="xs:string" select="resolve-uri('../', static-base-uri())"/>
  <xsl:variable name="blogDir" as="xs:string" select="resolve-uri('blog/', $siteDir)"/>
  <xsl:variable name="layout" as="document-node()" select="/"/>
  <xsl:variable name="blogDescription" as="xs:string"
                select="'Writing, testing, debugging and profiling XSLT and XPath: articles on editing, the debugger, the profiler, XSpec, Schematron and AI assistants, from DeltaXignia.'"/>

  <xsl:function name="f:post" as="document-node()">
    <xsl:param name="file" as="xs:string"/>
    <xsl:sequence select="doc(resolve-uri('authoring/blog/' || substring-before($file, '.html') || '.xml', $siteDir))"/>
  </xsl:function>

  <xsl:template match="/">
    <xsl:for-each select="html/body//nav//li/a/@href">
      <xsl:variable name="file" as="xs:string" select="string(.)"/>
      <xsl:call-template name="makePage">
        <xsl:with-param name="file" select="$file"/>
        <xsl:with-param name="output" select="$file"/>
      </xsl:call-template>
      <xsl:if test="position() eq 1">
        <xsl:call-template name="makePage">
          <xsl:with-param name="file" select="$file"/>
          <xsl:with-param name="output" select="'index.html'"/>
        </xsl:call-template>
      </xsl:if>
    </xsl:for-each>
  </xsl:template>

  <xsl:template name="makePage">
    <xsl:param name="file" as="xs:string"/>
    <xsl:param name="output" as="xs:string"/>
    <xsl:result-document href="{resolve-uri($output, $blogDir)}">
      <xsl:apply-templates select="$layout/*" mode="copyPage">
        <xsl:with-param name="file" select="$file" tunnel="yes"/>
        <xsl:with-param name="post" select="f:post($file)" as="document-node()" tunnel="yes"/>
      </xsl:apply-templates>
    </xsl:result-document>
  </xsl:template>

  <xsl:function name="f:page-title" as="xs:string">
    <xsl:param name="post" as="document-node()"/>
    <xsl:sequence select="f:post-title($post) || ' - ' || $blogTitle"/>
  </xsl:function>

  <xsl:template match="title" mode="copyPage">
    <xsl:param name="post" as="document-node()" tunnel="yes"/>
    <xsl:copy>{f:page-title($post)}</xsl:copy>
  </xsl:template>

  <!-- the page's description, canonical URL, Open Graph and Twitter tags, and structured data -->
  <xsl:template match="meta[@name eq 'description']" mode="copyPage">
    <xsl:param name="file" as="xs:string" tunnel="yes"/>
    <xsl:param name="post" as="document-node()" tunnel="yes"/>
    <xsl:variable name="description" as="xs:string" select="f:post-description($post)"/>
    <xsl:variable name="title" as="xs:string" select="f:page-title($post)"/>
    <xsl:variable name="url" as="xs:string" select="$blogUrl || $file"/>
    <meta name="description" content="{$description}"/>
    <link rel="canonical" href="{$url}"/>
    <meta property="og:type" content="article"/>
    <meta property="og:site_name" content="{$blogTitle}"/>
    <meta property="og:title" content="{$title}"/>
    <meta property="og:description" content="{$description}"/>
    <meta property="og:url" content="{$url}"/>
    <xsl:if test="exists(f:post-date($post))">
      <meta property="article:published_time" content="{f:post-date($post)}"/>
    </xsl:if>
    <meta property="og:image" content="{$siteUrl}resources/og-image.png"/>
    <meta property="og:image:width" content="1200"/>
    <meta property="og:image:height" content="630"/>
    <meta property="og:image:alt" content="The XSLT debugger in Visual Studio Code, stopped at a breakpoint in a stylesheet"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <script type="application/ld+json">{f:json-ld($post, $title, $description, $url)}</script>
  </xsl:template>

  <!-- each post is a BlogPosting that's part of the Blog -->
  <xsl:function name="f:json-ld" as="xs:string">
    <xsl:param name="post" as="document-node()"/>
    <xsl:param name="title" as="xs:string"/>
    <xsl:param name="description" as="xs:string"/>
    <xsl:param name="url" as="xs:string"/>
    <xsl:variable name="blog" as="map(*)" select="map {
      '@type': 'Blog', 'name': $blogTitle, 'url': $blogUrl, 'description': $blogDescription, 'publisher': f:publisher() }"/>
    <xsl:variable name="data" as="map(*)" select="
      map:merge((
        map {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': f:post-heading($post),
          'description': $description,
          'url': $url,
          'mainEntityOfPage': $url,
          'image': $siteUrl || 'resources/og-image.png',
          'about': map { '@type': 'SoftwareApplication', 'name': 'XSLT/XPath for Visual Studio Code', 'url': $siteUrl,
                         'softwareVersion': $releaseVersion },
          'isPartOf': $blog,
          'author': f:publisher(),
          'publisher': f:publisher()
        },
        f:post-date($post) ! map { 'datePublished': string(.) },
        (f:post-modified($post), f:post-date($post))[1] ! map { 'dateModified': string(.) }
      ))"/>
    <xsl:sequence select="serialize($data, map { 'method': 'json', 'indent': false(), 'escape-solidus': false() })"/>
  </xsl:function>

  <xsl:template match="nav//li/a" mode="copyPage">
    <xsl:param name="file" as="xs:string" tunnel="yes"/>
    <xsl:copy>
      <xsl:apply-templates select="@* except @class" mode="#current"/>
      <xsl:if test="$file eq @href">
        <xsl:attribute name="class" select="'active'"/>
        <xsl:attribute name="aria-current" select="'page'"/>
      </xsl:if>
      <xsl:apply-templates select="node()" mode="#current"/>
    </xsl:copy>
  </xsl:template>

  <!-- the post: its heading, the date it was published, and its content -->
  <xsl:template match="div[@class eq 'main']" mode="copyPage">
    <xsl:param name="post" as="document-node()" tunnel="yes"/>
    <main class="main" id="main" tabindex="-1">
      <article>
        <h1 class="pageTitle">{f:post-heading($post)}</h1>
        <xsl:sequence select="f:post-byline($post)"/>
        <xsl:copy-of select="$post//div[@class eq 'main']/node()"/>
        <div class="two-thirds column">
          <p class="post-footer"><a href="../index.html">The user guide</a></p>
        </div>
      </article>
    </main>
  </xsl:template>

  <xsl:function name="f:post-byline" as="element(p)?">
    <xsl:param name="post" as="document-node()"/>
    <xsl:for-each select="f:post-date($post)">
      <p class="post-date"><time datetime="{.}">{f:display-date(.)}</time></p>
    </xsl:for-each>
  </xsl:function>
</xsl:stylesheet>
