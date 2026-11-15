#!/bin/zsh
# Regenerates /sitemap.xml at the repo root from the user guide pages in
# vscode-xslt-xpath/. Each page's <lastmod> is the date of the last git commit
# that touched it, so run this on master after the pages have been built and
# committed. all-pages.html is skipped because it duplicates every other page.
set -e

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
GUIDE_DIR="vscode-xslt-xpath"
BASE="https://deltaxml.github.io/$GUIDE_DIR"
OUT="$REPO_ROOT/sitemap.xml"

cd "$REPO_ROOT"
{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  for f in $(ls "$GUIDE_DIR"/*.html | sort); do
    name=$(basename "$f")
    [[ "$name" == "all-pages.html" ]] && continue
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
