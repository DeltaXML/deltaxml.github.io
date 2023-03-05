<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:array="http://www.w3.org/2005/xpath-functions/array"
                xmlns:map="http://www.w3.org/2005/xpath-functions/map"
                xmlns:math="http://www.w3.org/2005/xpath-functions/math"
                exclude-result-prefixes="#all"
                expand-text="yes"
                version="3.0">
  
  <xsl:output method="html" version="5.0" indent="no"/>
  <xsl:mode name="copyPage" on-no-match="shallow-copy"/>
  
  <xsl:variable name="indexTitle" as="xs:string" select="normalize-space(/html/head/title)"/>
  
  <xsl:template match="nav//ul" mode="#default">
    <xsl:message select="'debug message'"/>
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
    <xsl:message expand-text="yes">
      ==== Watch Variables ====
      pageTitle:     {$pageTitle}
    </xsl:message>
    <div class="main">
      <h2 class="pageTitle">{$pageTitle}</h2>     
      <xsl:copy-of select="$mainDiv/node()"/>
    </div>
  </xsl:template>
  
  <xsl:template match="nav//ul/li/a" mode="copyPage">
    <xsl:param name="filePart" as="xs:string" tunnel="yes"/>
    <xsl:copy>
      <xsl:apply-templates select="@* except @class" mode="#current"/>
      
      <xsl:if test="$filePart eq @href">
        <xsl:message select="'class added'"/>
        <xsl:attribute name="class" select="'active'"/>
      </xsl:if>
      <xsl:apply-templates select="node()" mode="#current"/>
    </xsl:copy>
  </xsl:template>
  
</xsl:stylesheet>