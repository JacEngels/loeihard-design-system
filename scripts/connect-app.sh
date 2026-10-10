#!/usr/bin/env bash
# Connect an app repo to the LOEI design system.
# Run from the app's root, after: git submodule add https://github.com/JacEngels/loeihard-design-system.git loei
#   bash loei/scripts/connect-app.sh "My App Name"
# Creates AGENTS.md and CLAUDE.md in the app root from loei/templates/app/. Never overwrites existing files.
set -euo pipefail

APP_NAME="${1:-$(basename "$PWD")}"
DS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TPL="$DS_DIR/templates/app"

if [ ! -f "$DS_DIR/AGENTS.md" ]; then
  echo "Design system not found at $DS_DIR. Run: git submodule update --init" >&2
  exit 1
fi

write_template() {
  local name="$1"
  if [ -e "$name" ]; then
    echo "• $name already exists. Left untouched. Make sure it points agents to loei/AGENTS.md (see $TPL/$name)."
  else
    sed "s/{{APP_NAME}}/${APP_NAME//\//\\/}/g" "$TPL/$name" > "$name"
    echo "✓ created $name"
  fi
}

write_template AGENTS.md
write_template CLAUDE.md

cat <<EOF

Next steps:
  1. Fill in the "About this app" section in AGENTS.md (shell, pages, users).
  2. Commit:   git add .gitmodules loei AGENTS.md CLAUDE.md && git commit -m "Connect LOEI design system"
  3. New project? Ask your agent: "Set up this project following loei/AGENTS.md section 3."
EOF
