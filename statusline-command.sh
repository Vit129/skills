#!/usr/bin/env bash
# Claude Code statusLine — matches Gemini/Codex format
# Shows: git branch | model (effort) | ctx% rem% | 5h% rem% timer | 7d% rem% reset
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

input=$(cat 2>/dev/null) || input=""

# Pre-initialize — prevents unbound-variable errors if eval fails or input is empty
model_short="" effort="" cwd="" ctx="" ctx_rem=""
five_pct="" five_reset="" week_pct="" week_reset=""

if [ -n "$input" ]; then
  _vars=$(echo "$input" | jq -r '
    def parse_date:
      if type == "number" then
        (if . > 10000000000 then . / 1000 | floor else . | floor end)
      elif type == "string" then
        (try (sub("\\.[0-9]+Z$"; "Z") | fromdateiso8601) catch null)
      else null end;
    . as $root |
    "model_short=\(($root.model.display_name // "") | @sh)
effort=\(($root.effort.level // "") | @sh)
cwd=\(($root.cwd // $root.workspace.current_dir // "") | @sh)
ctx=\(($root.context_window.used_percentage // "") | if type == "number" then round else "" end | @sh)
ctx_rem=\(($root.context_window.remaining_percentage // "") | if type == "number" then round else "" end | @sh)
five_pct=\(($root.rate_limits.five_hour.used_percentage // "") | if type == "number" then round else "" end | @sh)
five_reset=\((($root.rate_limits.five_hour.resets_at // null) | parse_date // "") | @sh)
week_pct=\(($root.rate_limits.seven_day.used_percentage // "") | if type == "number" then round else "" end | @sh)
week_reset=\((($root.rate_limits.seven_day.resets_at // null) | parse_date // "") | @sh)"
  ' 2>/dev/null) && eval "$_vars" 2>/dev/null || true
fi

# --- Git branch ---
branch=""
[ -n "$cwd" ] && branch=$(git -C "$cwd" --no-optional-locks branch --show-current 2>/dev/null) || true

# --- Build output ---
parts=()

# Git branch (cyan)
[ -n "$branch" ] && parts+=("$(printf '\033[0;36m %s\033[0m' "$branch")")

# Model + effort (yellow)
if [ -n "$model_short" ]; then
  label="$model_short"
  [ -n "$effort" ] && label="$label ($effort)"
  parts+=("$(printf '\033[0;33m%s\033[0m' "$label")")
fi

# Context usage + remaining
if [ -n "$ctx" ]; then
  ctx_rem_int="${ctx_rem:-$(( 100 - ctx ))}"
  if [ "$ctx" -gt 75 ]; then c='\033[0;31m'
  elif [ "$ctx" -gt 45 ]; then c='\033[0;33m'
  else c='\033[0;32m'; fi
  parts+=("$(printf "${c}ctx:%d%% rem:%d%%\033[0m" "$ctx" "$ctx_rem_int")")
else
  parts+=("$(printf '\033[0;90mctx:--%% rem:--%%\033[0m')")
fi

# 5h usage + reset countdown
if [ -n "$five_pct" ]; then
  timer=""
  if [ -n "$five_reset" ]; then
    now=$(date +%s)
    secs=$(( five_reset - now ))
    if [ "$secs" -gt 0 ]; then
      mins=$(( secs / 60 ))
      if [ "$mins" -ge 60 ]; then
        timer=" $(printf '%dh%02dm' $(( mins / 60 )) $(( mins % 60 )))"
      else
        timer=" ${mins}m"
      fi
    else
      timer=" reset"
    fi
  fi
  if [ "$five_pct" -gt 75 ]; then c='\033[0;31m'
  elif [ "$five_pct" -gt 45 ]; then c='\033[0;33m'
  else c='\033[0;32m'; fi
  parts+=("$(printf "${c}5h:%d%% rem:%d%%%s\033[0m" "$five_pct" "$(( 100 - five_pct ))" "$timer")")
else
  parts+=("$(printf '\033[0;90m5h:--%% rem:--%% --\033[0m')")
fi

# 7d usage + reset day
if [ -n "$week_pct" ]; then
  wtimer=""
  if [ -n "$week_reset" ]; then
    now=$(date +%s)
    if [ "$week_reset" -gt "$now" ]; then
      wtimer=" $(date -r "$week_reset" '+%a %-I %p' 2>/dev/null || date -d "@$week_reset" '+%a %-I %p' 2>/dev/null)"
    else
      wtimer=" reset"
    fi
  fi
  if [ "$week_pct" -gt 75 ]; then c='\033[0;31m'
  elif [ "$week_pct" -gt 45 ]; then c='\033[0;33m'
  else c='\033[0;32m'; fi
  parts+=("$(printf "${c}7d:%d%% rem:%d%%%s\033[0m" "$week_pct" "$(( 100 - week_pct ))" "$wtimer")")
else
  parts+=("$(printf '\033[0;90m7d:--%% rem:--%% --\033[0m')")
fi

# Join with separator
sep=" $(printf '\033[0;90m|\033[0m') "
result=""
for part in "${parts[@]}"; do
  [ -z "$result" ] && result="$part" || result="${result}${sep}${part}"
done

printf '%b\n' "$result"
exit 0
