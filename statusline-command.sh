#!/usr/bin/env bash
# Claude Code statusLine — atomic theme colors | cwd | git | model | ctx% | 5h | 7d | time
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

input=$(cat 2>/dev/null) || input=""

model_short="" cwd="" ctx="" ctx_rem="" ctx_used="" ctx_total=""
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
    "model_short=\((($root.model.display_name // "") | if startswith("Claude ") then sub("Claude "; "") elif startswith("Gemini ") then sub("Gemini "; "") else . end) | @sh)
cwd=\(($root.cwd // $root.workspace.current_dir // "") | @sh)
ctx=\(($root.context_window.used_percentage // "") | if type == "number" then round else "" end | @sh)
ctx_rem=\(($root.context_window.remaining_percentage // "") | if type == "number" then round else "" end | @sh)
ctx_used=\(($root.context_window.total_input_tokens // 0) | @sh)
ctx_total=\(($root.context_window.context_window_size // 0) | @sh)
five_pct=\(($root.rate_limits.five_hour.used_percentage // "") | if type == "number" then round else "" end | @sh)
five_reset=\((($root.rate_limits.five_hour.resets_at // null) | parse_date // "") | @sh)
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

# --- Git branch (fast — name only, no fetch) ---
git_branch=""
if [ -n "$cwd" ]; then
  git_branch=$(git --no-optional-locks -C "$cwd" branch --show-current 2>/dev/null)
fi

# --- Git status (starship symbols: + staged, ! modified, ? untracked, ⇡ ahead, ⇣ behind) ---
git_status_str=""
if [ -n "$cwd" ] && [ -n "$git_branch" ]; then
  _gs=$(git --no-optional-locks -C "$cwd" status --porcelain 2>/dev/null)
  _staged=0; _modified=0; _untracked=0
  while IFS= read -r _line; do
    [[ -z "$_line" ]] && continue
    _x="${_line:0:1}"; _y="${_line:1:1}"
    if [[ "$_x" == "?" && "$_y" == "?" ]]; then _untracked=$((_untracked+1)); continue; fi
    [[ "$_x" != " " ]] && _staged=$((_staged+1))
    [[ "$_y" == "M" || "$_y" == "D" ]] && _modified=$((_modified+1))
  done <<< "$_gs"
  _ab=$(git --no-optional-locks -C "$cwd" rev-list --left-right --count '@{upstream}...HEAD' 2>/dev/null)
  _ahead=0; _behind=0
  if [ -n "$_ab" ]; then
    _behind=$(echo "$_ab" | awk '{print $1}')
    _ahead=$(echo "$_ab" | awk '{print $2}')
  fi
  s=""
  [ "$_staged" -gt 0 ] && s="${s}+"
  [ "$_modified" -gt 0 ] && s="${s}!"
  [ "$_untracked" -gt 0 ] && s="${s}?"
  [ "$_ahead" -gt 0 ] && s="${s}⇡"
  [ "$_behind" -gt 0 ] && s="${s}⇣"
  git_status_str="$s"
fi

# --- Build output ---
parts=()

# CWD (atomic orange)
[ -n "$cwd_display" ] && parts+=("$(printf '\033[38;5;208m%s\033[0m' "$cwd_display")")

# Git branch (atomic green) + status (bold red, starship-style)
if [ -n "$git_branch" ]; then
  _b="$(printf '\033[38;5;79m%s\033[0m' "$git_branch")"
  [ -n "$git_status_str" ] && _b="${_b}$(printf ' \033[0;31m[%s]\033[0m' "$git_status_str")"
  parts+=("$_b")
fi

# Model (atomic yellow)
[ -n "$model_short" ] && parts+=("$(printf '\033[38;5;220m%s\033[0m' "$model_short")")

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

# 5h usage + reset time
if [ -n "$five_pct" ]; then
  freset=""
  if [ -n "$five_reset" ]; then
    now=$(date +%s)
    if [ "$five_reset" -gt "$now" ]; then
      freset=" $(date -r "$five_reset" '+%a %-I%p' 2>/dev/null || date -d "@$five_reset" '+%a %-I%p' 2>/dev/null)"
    else
      freset=" reset"
    fi
  fi
  if [ "$five_pct" -ge 80 ]; then c='\033[0;31m'
  elif [ "$five_pct" -ge 50 ]; then c='\033[0;33m'
  else c='\033[0;32m'; fi
  parts+=("$(printf "${c}5h:%d%% rem:%d%%%s\033[0m" "$five_pct" "$(( 100 - five_pct ))" "$freset")")
else
  parts+=("$(printf '\033[0;90m5h:--%% rem:--%%\033[0m')")
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

# Time (atomic blue, HH:MM)
parts+=("$(printf '\033[38;5;75m%s\033[0m' "$(date '+%H:%M')")")

sep=" $(printf '\033[0;90m|\033[0m') "
result=""
for part in "${parts[@]}"; do
  [ -z "$result" ] && result="$part" || result="${result}${sep}${part}"
done

printf '%b\n' "$result"
exit 0
