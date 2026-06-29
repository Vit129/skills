#!/usr/bin/env bash
# Claude Code statusLine — cwd | model | ctx% (used/total) rem | 7d% rem reset
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

input=$(cat 2>/dev/null) || input=""

model_short="" cwd="" ctx="" ctx_rem="" ctx_used="" ctx_total=""
week_pct="" week_reset=""

if [ -n "$input" ]; then
  _vars=$(echo "$input" | jq -r '
    def parse_date:
      if type == "number" then
        (if . > 10000000000 then . / 1000 | floor else . | floor end)
      elif type == "string" then
        (try (sub("\\.[0-9]+Z$"; "Z") | fromdateiso8601) catch null)
      else null end;
    . as $root |
    "model_short=\((($root.model.display_name // "") | if startswith("Claude ") then sub("Claude "; "") elif startswith("Gemini ") then sub("Gemini "; "") else . end) | @sh)
cwd=\(($root.cwd // $root.workspace.current_dir // "") | @sh)
ctx=\(($root.context_window.used_percentage // "") | if type == "number" then round else "" end | @sh)
ctx_rem=\(($root.context_window.remaining_percentage // "") | if type == "number" then round else "" end | @sh)
ctx_used=\(($root.context_window.used_tokens // $root.context_window.used // 0) | @sh)
ctx_total=\(($root.context_window.total_tokens // $root.context_window.total // $root.context_window.max_tokens // 0) | @sh)
week_pct=\(($root.rate_limits.seven_day.used_percentage // "") | if type == "number" then round else "" end | @sh)
week_reset=\((($root.rate_limits.seven_day.resets_at // null) | parse_date // "") | @sh)"
  ' 2>/dev/null) && eval "$_vars" 2>/dev/null || true
fi

# --- CWD (~ abbreviated, max 2 trailing components if deep) ---
cwd_display=""
if [ -n "$cwd" ]; then
  if [[ "$cwd" == "$HOME" ]]; then
    cwd_display="~"
  elif [[ "$cwd" == "$HOME"/* ]]; then
    cwd_display="~${cwd#$HOME}"
  else
    cwd_display="$cwd"
  fi
  depth=$(echo "$cwd_display" | tr -cd '/' | wc -c | tr -d ' ')
  if [ "$depth" -gt 3 ]; then
    cwd_display="…/$(basename "$(dirname "$cwd_display")")/$(basename "$cwd_display")"
  fi
fi

# --- Build output ---
parts=()

# CWD (white/bold)
[ -n "$cwd_display" ] && parts+=("$(printf '\033[1;37m%s\033[0m' "$cwd_display")")

# Model (yellow)
[ -n "$model_short" ] && parts+=("$(printf '\033[0;33m%s\033[0m' "$model_short")")

# Context: percentage + (used/total) + remaining
if [ -n "$ctx" ]; then
  ctx_rem_int="${ctx_rem:-$(( 100 - ctx ))}"
  if [ "$ctx" -ge 80 ]; then c='\033[0;31m'
  elif [ "$ctx" -ge 50 ]; then c='\033[0;33m'
  else c='\033[0;32m'; fi

  tok_info=""
  if [ -n "$ctx_used" ] && [ "$ctx_used" -gt 0 ] && [ -n "$ctx_total" ] && [ "$ctx_total" -gt 0 ]; then
    used_k=$(awk "BEGIN {printf \"%.0fk\", $ctx_used/1000}")
    total_k=$(awk "BEGIN {printf \"%.0fk\", $ctx_total/1000}")
    rem_k=$(awk "BEGIN {printf \"%.0fk\", ($ctx_total - $ctx_used)/1000}")
    tok_info=" (${used_k}/${total_k}) rem:${rem_k}"
  fi

  parts+=("$(printf "${c}ctx:%d%%%s\033[0m" "$ctx" "$tok_info")")
else
  parts+=("$(printf '\033[0;90mctx:--%%\033[0m')")
fi

# 7d usage + weekly reset date
if [ -n "$week_pct" ]; then
  wreset=""
  if [ -n "$week_reset" ]; then
    now=$(date +%s)
    if [ "$week_reset" -gt "$now" ]; then
      wreset=" $(date -r "$week_reset" '+%a %-I%p' 2>/dev/null || date -d "@$week_reset" '+%a %-I%p' 2>/dev/null)"
    else
      wreset=" reset"
    fi
  fi
  if [ "$week_pct" -ge 80 ]; then c='\033[0;31m'
  elif [ "$week_pct" -ge 50 ]; then c='\033[0;33m'
  else c='\033[0;32m'; fi
  parts+=("$(printf "${c}7d:%d%% rem:%d%%%s\033[0m" "$week_pct" "$(( 100 - week_pct ))" "$wreset")")
else
  parts+=("$(printf '\033[0;90m7d:--%% rem:--%%\033[0m')")
fi

sep=" $(printf '\033[0;90m|\033[0m') "
result=""
for part in "${parts[@]}"; do
  [ -z "$result" ] && result="$part" || result="${result}${sep}${part}"
done

printf '%b\n' "$result"
exit 0
