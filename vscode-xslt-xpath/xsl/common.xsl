<?xml version="1.0" encoding="UTF-8"?>
<!-- what createPages.xsl (the user guide) and create-blog.xsl (the blog) share: the site's addresses, the release the
     guide describes, and the details of a blog post - included by both -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:map="http://www.w3.org/2005/xpath-functions/map"
                xmlns:f="urn:local:functions"
                exclude-result-prefixes="#all"
                expand-text="yes"
                version="3.0">

  <!-- the guide's public URL, for each page's canonical link and Open Graph tags - also the base URL in xsl/make-sitemap.sh -->
  <xsl:variable name="siteUrl" as="xs:string" select="'https://deltaxml.github.io/vscode-xslt-xpath/'"/>
  <!-- the blog's, within the guide's folder -->
  <xsl:variable name="blogUrl" as="xs:string" select="$siteUrl || 'blog/'"/>
  <xsl:variable name="blogTitle" as="xs:string" select="'The XSLT/XPath Blog'"/>

  <!-- the extension release the guide describes (as package.json's version, without the patch number): shown in each
       page's top bar and on the all-pages cover, and given in the structured data and llms.txt - the one place to
       change for a new release -->
  <xsl:variable name="releaseVersion" as="xs:string" select="'2.2'"/>

  <xsl:function name="f:publisher" as="map(*)">
    <xsl:sequence select="map { '@type': 'Organization', 'name': 'DeltaXignia', 'url': 'https://www.deltaxml.com/' }"/>
  </xsl:function>

  <!-- a blog post - authoring/blog/<post>.xml - has, in its head, the words people search for as its <title>, a
       <meta name="description">, the date it was published as <meta name="date" content="2026-11-24">, and optionally the
       date it was last changed as <meta name="modified">, and its own <h1> - otherwise its title -->
  <xsl:function name="f:post-title" as="xs:string">
    <xsl:param name="post" as="document-node()"/>
    <xsl:sequence select="normalize-space($post//head/title)"/>
  </xsl:function>

  <xsl:function name="f:post-heading" as="xs:string">
    <xsl:param name="post" as="document-node()"/>
    <xsl:sequence select="(($post//head/h1) ! normalize-space(), f:post-title($post))[1]"/>
  </xsl:function>

  <xsl:function name="f:post-description" as="xs:string">
    <xsl:param name="post" as="document-node()"/>
    <xsl:sequence select="normalize-space($post//head/meta[@name eq 'description']/@content)"/>
  </xsl:function>

  <xsl:function name="f:post-date" as="xs:date?">
    <xsl:param name="post" as="document-node()"/>
    <xsl:sequence select="$post//head/meta[@name eq 'date']/@content ! xs:date(.)"/>
  </xsl:function>

  <xsl:function name="f:post-modified" as="xs:date?">
    <xsl:param name="post" as="document-node()"/>
    <xsl:sequence select="$post//head/meta[@name eq 'modified']/@content ! xs:date(.)"/>
  </xsl:function>

  <!-- 24 November 2026 -->
  <xsl:function name="f:display-date" as="xs:string">
    <xsl:param name="date" as="xs:date"/>
    <xsl:sequence select="format-date($date, '[D] [MNn] [Y]', 'en', (), ())"/>
  </xsl:function>
</xsl:stylesheet>
