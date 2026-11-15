#!/bin/zsh
# Regenerates /sitemap.xml at the repo root from the user guide's pages - those in the nav in
# authoring/layout.xml, which createPages.xsl builds. Each page's <lastmod> is the date of the last git
# commit that touched it, so run this on master after the built pages have been committed, then commit
# the sitemap. all-pages.html isn't listed: it repeats every other page, and its head says noindex.
set -e

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
GUIDE_DIR="vscode-xslt-xpath"
BASE="https://deltaxml.github.io/$GUIDE_DIR"   # also $siteUrl in createPages.xsl
OUT="$REPO_ROOT/sitemap.xml"

cd "$REPO_ROOT"
pages=$(xmllint --xpath '//nav/ul/li/a/@href' "$GUIDE_DIR/authoring/layout.xml" | tr ' ' '\n' | sed -n 's/^href="\(.*\)"$/\1/p')
{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  for name in ${(f)pages}; do
    f="$GUIDE_DIR/$name"
    [[ -f "$f" ]] || { echo "warning: $f isn't built yet - not listed" >&2; continue; }
    d=$(git log -1 --format=%cs -- "$f")
    [[ -z "$d" ]] && d=$(date +%F)   # not yet committed: use today
    if [[ "$name" == "index.html" ]]; then loc="$BASE/"; else loc="$BASE/$name"; fi
    echo "  <url>"
    echo "    <loc>$loc</loc>"
    echo "    <lastmod>$d</lastmod>"
    echo "  </url>"
  done
  echo '</urlset>'
} > "$OUT"

echo "wrote $OUT"
