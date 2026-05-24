#!/bin/bash
# sync-skills-to-hermes.sh — Convert Claude skills to Hermes SKILL.md format
#
# Source:  ~/.claude/skills/{category}/{skill}/SKILL.md
# Target:  ~/.hermes/skills/{category}/{skill}/SKILL.md
#
# Hermes skills are auto-loaded into the system prompt.
# Claude skills are invoked on-demand via the Skill tool.
# This script bridges the two by wrapping Claude SKILL.md bodies
# in Hermes-compatible YAML frontmatter.
#
# Usage:
#   bash ~/.claude/scripts/sync-skills-to-hermes.sh
#   bash ~/.claude/scripts/sync-skills-to-hermes.sh --dry-run

set -euo pipefail

# ── Config ───────────────────────────────────────────────────────────────────
CLAUDE_SKILLS="$HOME/.claude/skills"
HERMES_SKILLS="$HOME/.hermes/skills"

# Categories to port (source category → target category)
# Format: "source_category:target_category"
PORT_MAP=(
  "finance:finance"
  "dev:dev"
  "fitness:fitness"
  "thai-accountant:thai-accountant"
  "notebooklm:notebooklm"
  "governance:governance"
  "playwright-cli:dev/playwright"
)

# Skills already managed by Hermes (do NOT overwrite if target is newer)
# Pattern: "{target_category}/{skill_name}"
PROTECTED_SKILLS=(
  "finance/portfolio-holdings"
  "finance/investment-research"
  "finance/passive-income"
)

# ── Colors ───────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
DIM='\033[2m'
NC='\033[0m'

# ── Parse args ───────────────────────────────────────────────────────────────
DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

# ── Counters ─────────────────────────────────────────────────────────────────
COUNT_CREATED=0
COUNT_UPDATED=0
COUNT_SKIPPED=0

# ── Helpers ──────────────────────────────────────────────────────────────────

# kebab-case a string (lowercase, replace spaces/underscores/slashes with hyphens)
to_kebab() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | tr ' _/' '-' | tr -s '-'
}

# Extract first non-empty non-comment non-YAML-delimiter line from SKILL.md body
# (strip frontmatter if present, then find first content line ≤100 chars)
extract_description() {
  local file="$1"
  local in_frontmatter=0
  local frontmatter_done=0
  local line
  local delimiter_count=0

  while IFS= read -r line; do
    # Handle YAML frontmatter (--- delimiters)
    if [[ $frontmatter_done -eq 0 ]]; then
      if [[ "$line" == "---" ]]; then
        delimiter_count=$((delimiter_count + 1))
        if [[ $delimiter_count -eq 2 ]]; then
          frontmatter_done=1
        fi
        continue
      fi
      if [[ $delimiter_count -eq 0 && -n "$line" ]]; then
        # No frontmatter — this is a content line
        frontmatter_done=1
      elif [[ $delimiter_count -gt 0 && $delimiter_count -lt 2 ]]; then
        # Inside frontmatter — check for description field
        continue
      fi
    fi

    # Strip markdown heading markers and leading #/> characters
    local cleaned
    cleaned="${line#\#* }"
    cleaned="${cleaned#> }"
    cleaned="$(echo "$cleaned" | sed 's/^[#>* ]*//; s/[[:space:]]*$//')"

    # Skip empty, comment, or very short lines
    if [[ -z "$cleaned" || ${#cleaned} -lt 5 ]]; then
      continue
    fi

    # Truncate to 100 chars
    if [[ ${#cleaned} -gt 100 ]]; then
      cleaned="${cleaned:0:97}..."
    fi

    echo "$cleaned"
    return
  done < "$file"

  echo "Claude skill"
}

# Generate tags array from category, skill name, and description words
generate_tags() {
  local category="$1"
  local skill_name="$2"
  local description="$3"

  local tags=("$category" "$skill_name")

  # Add kebab-case words from description (skip short words and common stop words)
  local stop_words="the a an and or in of for to with is are was be this that"
  while IFS= read -r word; do
    word="$(to_kebab "$word")"
    word="${word//[^a-z0-9-]/}"
    if [[ ${#word} -ge 4 ]]; then
      local is_stop=0
      for sw in $stop_words; do
        [[ "$word" == "$sw" ]] && is_stop=1 && break
      done
      if [[ $is_stop -eq 0 ]]; then
        tags+=("$word")
      fi
    fi
  done < <(echo "$description" | tr ' ,.;:()[]{}' '\n' | grep -v '^$')

  # Deduplicate and join
  local seen=()
  local result=()
  for tag in "${tags[@]}"; do
    local already=0
    for s in "${seen[@]:-}"; do
      [[ "$s" == "$tag" ]] && already=1 && break
    done
    if [[ $already -eq 0 && -n "$tag" ]]; then
      seen+=("$tag")
      result+=("$tag")
    fi
  done

  # Format as YAML inline list, max 8 tags
  local yaml_tags="["
  local count=0
  for tag in "${result[@]}"; do
    [[ $count -ge 8 ]] && break
    [[ $count -gt 0 ]] && yaml_tags+=", "
    yaml_tags+="$tag"
    count=$((count + 1))
  done
  yaml_tags+="]"
  echo "$yaml_tags"
}

# Check if a skill is protected (already managed by Hermes)
is_protected() {
  local target_rel="$1"  # e.g. "finance/portfolio-holdings"
  for p in "${PROTECTED_SKILLS[@]}"; do
    [[ "$p" == "$target_rel" ]] && return 0
  done
  return 1
}

# Convert and write one skill
convert_skill() {
  local src_file="$1"       # full path to source SKILL.md
  local target_dir="$2"     # full path to target skill directory
  local category="$3"       # e.g. "finance"
  local skill_name="$4"     # e.g. "portfolio"
  local target_rel="$5"     # e.g. "finance/portfolio" (for protection check)

  local target_file="$target_dir/SKILL.md"

  # Check protection
  if is_protected "$target_rel"; then
    # Only skip if target is newer than source
    if [[ -f "$target_file" ]]; then
      local src_mtime dst_mtime
      src_mtime=$(stat -f '%m' "$src_file" 2>/dev/null || stat -c '%Y' "$src_file" 2>/dev/null)
      dst_mtime=$(stat -f '%m' "$target_file" 2>/dev/null || stat -c '%Y' "$target_file" 2>/dev/null)
      if [[ $dst_mtime -ge $src_mtime ]]; then
        echo -e "    ${DIM}⏭  Skipped (protected + newer): $target_rel${NC}"
        COUNT_SKIPPED=$((COUNT_SKIPPED + 1))
        return
      fi
    fi
  fi

  # Read body (strip existing YAML frontmatter if present)
  local body
  body="$(awk '
    BEGIN { in_fm=0; done=0; delim=0 }
    /^---$/ && done==0 {
      delim++
      if (delim==1) { in_fm=1; next }
      if (delim==2) { in_fm=0; done=1; next }
    }
    in_fm==0 && done==1 { print }
    in_fm==0 && done==0 && delim==0 { print }
  ' "$src_file")"

  # Extract description from the original file (before stripping)
  local description
  description="$(extract_description "$src_file")"

  # Escape quotes in description
  description="${description//\"/\'}"

  # Generate tags
  local tags
  tags="$(generate_tags "$category" "$skill_name" "$description")"

  # Determine if this is a create or update
  local action="created"
  if [[ -f "$target_file" ]]; then
    action="updated"
  fi

  if [[ $DRY_RUN -eq 1 ]]; then
    echo -e "    ${DIM}would $action: $target_rel/SKILL.md${NC}"
    if [[ "$action" == "created" ]]; then
      COUNT_CREATED=$((COUNT_CREATED + 1))
    else
      COUNT_UPDATED=$((COUNT_UPDATED + 1))
    fi
    return
  fi

  mkdir -p "$target_dir"

  # Write Hermes SKILL.md with frontmatter + body
  cat > "$target_file" << HERMES_SKILL
---
name: ${skill_name}
description: "${description}"
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: ${tags}
    related_skills: []
---

${body}
HERMES_SKILL

  if [[ "$action" == "created" ]]; then
    echo -e "    ${GREEN}✅ Created: $target_rel/SKILL.md${NC}"
    COUNT_CREATED=$((COUNT_CREATED + 1))
  else
    echo -e "    ${BLUE}🔄 Updated: $target_rel/SKILL.md${NC}"
    COUNT_UPDATED=$((COUNT_UPDATED + 1))
  fi
}

# ── Main ─────────────────────────────────────────────────────────────────────
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🔄 sync-skills-to-hermes — ~/.claude/skills/ → ~/.hermes/skills/${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
[[ $DRY_RUN -eq 1 ]] && echo -e "  ${YELLOW}⚠️  DRY RUN — no files will be written${NC}\n"

for mapping in "${PORT_MAP[@]}"; do
  src_category="${mapping%%:*}"
  dst_category="${mapping##*:}"

  src_dir="$CLAUDE_SKILLS/$src_category"

  if [[ ! -d "$src_dir" ]]; then
    echo -e "  ${YELLOW}⚠️  Source not found, skipping: $src_dir${NC}"
    continue
  fi

  echo -e "  ${BLUE}Category: $src_category → $dst_category${NC}"

  # Find all SKILL.md files under this category
  while IFS= read -r skill_file; do
    # Get the skill directory name (parent of SKILL.md)
    local_skill_dir="$(dirname "$skill_file")"
    skill_name="$(basename "$local_skill_dir")"

    # If the skill_file is directly at category root (e.g. fitness/SKILL.md),
    # use the category name as the skill name
    if [[ "$local_skill_dir" == "$src_dir" ]]; then
      skill_name="$src_category"
    fi

    # Compute relative target path
    # For sub-subcategories (e.g. finance/research/earnings-preview),
    # flatten to {dst_category}/{skill_name}
    target_rel="${dst_category}/${skill_name}"
    target_dir="$HERMES_SKILLS/${dst_category}/${skill_name}"

    # Special case: if skill_file is the category-root SKILL.md
    if [[ "$local_skill_dir" == "$src_dir" ]]; then
      target_rel="${dst_category}"
      target_dir="$HERMES_SKILLS/${dst_category}"
    fi

    convert_skill "$skill_file" "$target_dir" "$dst_category" "$skill_name" "$target_rel"

  done < <(find "$src_dir" -name "SKILL.md" | sort)

  echo ""
done

# ── Summary ───────────────────────────────────────────────────────────────────
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Done:${NC} $COUNT_CREATED created, $COUNT_UPDATED updated, $COUNT_SKIPPED skipped"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
