<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:array="http://www.w3.org/2005/xpath-functions/array"
                xmlns:map="http://www.w3.org/2005/xpath-functions/map"
                xmlns:math="http://www.w3.org/2005/xpath-functions/math"
                exclude-result-prefixes="#all"
                expand-text="yes"
                version="3.0">
  
  <xsl:output method="xml" indent="yes"/>
  <xsl:mode on-no-match="shallow-copy"/>
  
  <xsl:include href="test2.xsl"/>
  
  <xsl:template match="div" mode="#all">
    <new>
      <name class="class"></name>
    </new>

      name="
      abc
      def
      ghi
      hij"
      new="test"/>
    <xsl:sequence 
      select="
        1,
        2,
        3,
        4"/>
    <xsl:sequence select="$var1"/>
    <xsl:copy>
      <xsl:apply-templates select="@*, node()" mode="#current"/>
      <p>added by me and updated</p>
    </xsl:copy>
  </xsl:template>
  
  
  
</xsl:stylesheet>