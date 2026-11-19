#!/bin/zsh
# Regenerates /sitemap.xml at the repo root from the user guide's pages, and those of the XSLT overview section
# (/xslt/) - those in the nav in each one's authoring/layout.xml, which its createPages.xsl builds. Each page's <lastmod> is the date of the last git
# commit that touched it, so run this on master after the built pages have been committed, then commit
# the sitemap. all-pages.html isn't listed: it repeats every other page, and its head says noindex.
set -e

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
GUIDE_DIR="vscode-xslt-xpath"
BASE="https://deltaxml.github.io/$GUIDE_DIR"   # also $siteUrl in createPages.xsl
XSLT_DIR="xslt"                                 # the XSLT overview section, built by xslt/xsl/createPages.xsl
XSLT_BASE="https://deltaxml.github.io/$XSLT_DIR" # also $siteUrl in xslt/xsl/createPages.xsl
OUT="$REPO_ROOT/sitemap.xml"

cd "$REPO_ROOT"

# the <url> entries for a section's pages: its folder, its public URL, and the nav in its authoring/layout.xml
section_urls() {
  local dir="$1" base="$2" pages name f d loc
  pages=$(xmllint --xpath '//nav/ul/li/a/@href' "$dir/authoring/layout.xml" | tr ' ' '\n' | sed -n 's/^href="\(.*\)"$/\1/p')
  for name in ${(f)pages}; do
    f="$dir/$name"
    [[ -f "$f" ]] || { echo "warning: $f isn't built yet - not listed" >&2; continue; }
    d=$(git log -1 --format=%cs -- "$f")
    [[ -z "$d" ]] && d=$(date +%F)   # not yet committed: use today
    if [[ "$name" == "index.html" ]]; then loc="$base/"; else loc="$base/$name"; fi
    echo "  <url>"
    echo "    <loc>$loc</loc>"
    echo "    <lastmod>$d</lastmod>"
    echo "  </url>"
  done
}

{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  section_urls "$GUIDE_DIR" "$BASE"
  section_urls "$XSLT_DIR" "$XSLT_BASE"
  echo '</urlset>'
} > "$OUT"

echo "wrote $OUT"
