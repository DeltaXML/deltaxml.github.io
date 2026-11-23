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
       newest first. Each post is authoring/blog/<post>.xml, and is written to blog/<post>.html; blog/index.html lists
       them. The user guide is made by createPages.xsl, which shares common.xsl with this -->
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
      <xsl:result-document href="{resolve-uri($file, $blogDir)}">
        <xsl:apply-templates select="$layout/*" mode="copyPage">
          <xsl:with-param name="file" select="$file" tunnel="yes"/>
          <xsl:with-param name="post" select="if ($file eq 'index.html') then () else f:post($file)" as="document-node()?" tunnel="yes"/>
        </xsl:apply-templates>
      </xsl:result-document>
    </xsl:for-each>
  </xsl:template>

  <xsl:function name="f:page-title" as="xs:string">
    <xsl:param name="post" as="document-node()?"/>
    <xsl:sequence select="if (exists($post)) then f:post-title($post) || ' - ' || $blogTitle else $blogTitle"/>
  </xsl:function>

  <xsl:template match="title" mode="copyPage">
    <xsl:param name="post" as="document-node()?" tunnel="yes"/>
    <xsl:copy>{f:page-title($post)}</xsl:copy>
  </xsl:template>

  <!-- the page's description, canonical URL, Open Graph and Twitter tags, and structured data -->
  <xsl:template match="meta[@name eq 'description']" mode="copyPage">
    <xsl:param name="file" as="xs:string" tunnel="yes"/>
    <xsl:param name="post" as="document-node()?" tunnel="yes"/>
    <xsl:variable name="description" as="xs:string" select="if (exists($post)) then f:post-description($post) else $blogDescription"/>
    <xsl:variable name="title" as="xs:string" select="f:page-title($post)"/>
    <xsl:variable name="url" as="xs:string" select="$blogUrl || $file[. ne 'index.html']"/>
    <meta name="description" content="{$description}"/>
    <link rel="canonical" href="{$url}"/>
    <meta property="og:type" content="{if (exists($post)) then 'article' else 'website'}"/>
    <meta property="og:site_name" content="{$blogTitle}"/>
    <meta property="og:title" content="{$title}"/>
    <meta property="og:description" content="{$description}"/>
    <meta property="og:url" content="{$url}"/>
    <xsl:if test="exists($post) and exists(f:post-date($post))">
      <meta property="article:published_time" content="{f:post-date($post)}"/>
    </xsl:if>
    <meta property="og:image" content="{$siteUrl}resources/og-image.png"/>
    <meta property="og:image:width" content="1200"/>
    <meta property="og:image:height" content="630"/>
    <meta property="og:image:alt" content="The XSLT debugger in Visual Studio Code, stopped at a breakpoint in a stylesheet"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <script type="application/ld+json">{f:json-ld($post, $title, $description, $url)}</script>
  </xsl:template>

  <!-- the listing is a Blog, and each post a BlogPosting that's part of it -->
  <xsl:function name="f:json-ld" as="xs:string">
    <xsl:param name="post" as="document-node()?"/>
    <xsl:param name="title" as="xs:string"/>
    <xsl:param name="description" as="xs:string"/>
    <xsl:param name="url" as="xs:string"/>
    <xsl:variable name="blog" as="map(*)" select="map {
      '@type': 'Blog', 'name': $blogTitle, 'url': $blogUrl, 'description': $blogDescription, 'publisher': f:publisher() }"/>
    <xsl:variable name="data" as="map(*)" select="
      if (empty($post)) then map:merge((map { '@context': 'https://schema.org' }, $blog))
      else map:merge((
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

  <!-- the post: its heading, the date it was published, and its content - or the list of posts -->
  <xsl:template match="div[@class eq 'main']" mode="copyPage">
    <xsl:param name="post" as="document-node()?" tunnel="yes"/>
    <main class="main" id="main" tabindex="-1">
      <xsl:choose>
        <xsl:when test="exists($post)">
          <article>
            <h1 class="pageTitle">{f:post-heading($post)}</h1>
            <xsl:sequence select="f:post-byline($post)"/>
            <xsl:copy-of select="$post//div[@class eq 'main']/node()"/>
            <div class="two-thirds column">
              <p class="post-footer"><a href="index.html">All posts</a> | <a href="../index.html">The user guide</a></p>
            </div>
          </article>
        </xsl:when>
        <xsl:otherwise>
          <h1 class="pageTitle">{$blogTitle}</h1>
          <div class="two-thirds column">
            <p class="blog-tagline">Writing, testing, debugging and profiling XSLT and XPath</p>
            <xsl:for-each select="$layout/html/body//nav//li/a[@href ne 'index.html']">
              <xsl:variable name="summary" as="document-node()" select="f:post(@href)"/>
              <article class="post-summary">
                <h3><a href="{@href}">{f:post-heading($summary)}</a></h3>
                <xsl:sequence select="f:post-byline($summary)"/>
                <p>{f:post-description($summary)}</p>
              </article>
            </xsl:for-each>
          </div>
        </xsl:otherwise>
      </xsl:choose>
    </main>
  </xsl:template>

  <xsl:function name="f:post-byline" as="element(p)?">
    <xsl:param name="post" as="document-node()"/>
    <xsl:for-each select="f:post-date($post)">
      <p class="post-date"><time datetime="{.}">{f:display-date(.)}</time></p>
    </xsl:for-each>
  </xsl:function>
</xsl:stylesheet>
