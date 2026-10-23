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
  
  <xsl:variable name="indexTitle" as="xs:string" select="normalize-space(/html/head/title)"/>
  
  <xsl:template match="nav//ul" mode="#default">
    <xsl:apply-templates select="li/a/@href"/>    
  </xsl:template>
  
  <xsl:template match="@href" mode="#default">
    <xsl:if test="position() ne 1">      
      <xsl:call-template name="makePage"/>
    </xsl:if>
  </xsl:template>
  
  <xsl:template name="makePage">
    <xsl:variable name="filePart" as="xs:string" select="substring-before(., '.')"/>
    <xsl:variable name="outputFilename" as="xs:string" select="$filePart => resolve-uri(base-uri()) || '.html'"/>
    <xsl:variable name="inputFilename" as="xs:string" select="('authoring/' || $filePart) => resolve-uri(base-uri()) || '.xml'"/>
    
    <xsl:result-document href="{$outputFilename }">
      <xsl:apply-templates select="/*" mode="copyPage">
        <xsl:with-param name="pageTitle" as="xs:string" select="./parent::a/text()" tunnel="yes"/>
        <xsl:with-param name="filePart" select="$filePart || '.html'" tunnel="yes"/>
        <xsl:with-param name="mainDiv" select="doc($inputFilename)//div[@class eq 'main']" tunnel="yes"/>
      </xsl:apply-templates>
    </xsl:result-document>
  </xsl:template>
  
  <xsl:template match="title" mode="copyPage">
    <xsl:param name="pageTitle" as="xs:string" tunnel="yes"/>
    <xsl:copy>
      <xsl:value-of select="$pageTitle || ' | ' || $indexTitle"/>
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