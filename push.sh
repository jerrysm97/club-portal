#!/bin/bash
# push.sh — Auto-format, commit, and push to GitHub
# Usage: ./push.sh (make executable first with: chmod +x push.sh)

echo "🚀 Pushing to GitHub..."

# Step 1: Auto-format code with Prettier
npx prettier --write . --log-level silent 2>/dev/null

# Step 2: Stage all changes
git add .

# Step 3: Generate commit message with timestamp
TIMESTAMP=$(date "+%d %b %Y — %H:%M")
COMMIT_MSG="Update: $TIMESTAMP"

# Step 4: Commit — exit cleanly if nothing to commit
git diff --cached --quiet
if [ $? -eq 0 ]; then
    echo "Nothing new to commit."
    exit 0
fi
git commit -m "$COMMIT_MSG"

# Step 5: Push to GitHub
git push origin main
if [ $? -ne 0 ]; then
    echo "❌ Push failed. Check internet or GitHub credentials."
    exit 1
fi

echo "✅ Done! Changes live on GitHub."
