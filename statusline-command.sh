#!/usr/bin/env bash
# Claude Code statusLine — mirrors ~/.config/starship.toml layout
# Segment order: directory | on  branch [git_status] | model (effort) | ctx% | 5h% | 7d%
# starship mapping:
#   [directory]  style="bold cyan"  truncation_length=3  truncate_to_repo=true
#   [git_branch] symbol=" "  format="on [$symbol$branch](bold text) "
#   [git_status] style="bold red"  symbols: = ⇡ ⇣ ⇕ ? ! + » ✘
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

input=$(cat)

eval "$(echo "$input" | jq -r '
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
')"

# --- [directory] bold cyan, repo-relative when in git, truncate to last 3 components ---
dir_display=""
if [ -n "$cwd" ]; then
  git_root=$(git -C "$cwd" --no-optional-locks rev-parse --show-toplevel 2>/dev/null)
  if [ -n "$git_root" ]; then
    display_path="$(basename "$git_root")${cwd#$git_root}"
  else
    display_path="${cwd/#$HOME/~}"
  fi
  IFS='/' read -ra _parts <<< "$display_path"
  _n="${#_parts[@]}"
  if [ "$_n" -gt 3 ]; then
    display_path="…/${_parts[$((_n-3))]}/${_parts[$((_n-2))]}/${_parts[$((_n-1))]}"
  fi
  dir_display="$(printf '\033[1;36m%s\033[0m' "$display_path")"
fi

# --- [git_branch] "on  branch" in bold (format="on [$symbol$branch](bold text) ") ---
branch=""
branch_display=""
if [ -n "$cwd" ]; then
  branch=$(git -C "$cwd" --no-optional-locks branch --show-current 2>/dev/null)
  [ -n "$branch" ] && branch_display="$(printf 'on \033[1m %s\033[0m' "$branch")"
fi

# --- [git_status] bold red symbols matching starship config ---
# order: conflicted= staged+ renamed» deleted✘ modified! untracked? ahead⇡/behind⇣/diverged⇕
git_status_display=""
if [ -n "$branch" ]; then
  _porcelain=$(git -C "$cwd" --no-optional-locks status --porcelain=v1 2>/dev/null)
  _ab=$(git -C "$cwd" --no-optional-locks rev-list --count --left-right "@{upstream}...HEAD" 2>/dev/null)

  _conflict=0 _staged=0 _renamed=0 _deleted=0 _modified=0 _untracked=0
  while IFS= read -r _line; do
    [ -z "$_line" ] && continue
    _x="${_line:0:1}"; _y="${_line:1:1}"
    [[ "$_x$_y" == "??" ]] && _untracked=1 && continue
    [[ "$_x$_y" =~ ^(DD|AU|UD|UA|DU|AA|UU)$ ]] && _conflict=1 && continue
    [[ "$_x" =~ [MADRCT] ]] && _staged=1
    [[ "$_x" == "R" ]] && _renamed=1
    [[ "$_y" == "M" ]] && _modified=1
    [[ "$_y" == "D" && "$_x" != "D" ]] && _deleted=1
  done <<< "$_porcelain"

  _ahead=0; _behind=0
  if [ -n "$_ab" ]; then
    _behind=$(awk '{print $1}' <<< "$_ab")
    _ahead=$(awk '{print $2}' <<< "$_ab")
  fi

  _sym=""
  [ "$_conflict"  -eq 1 ] && _sym="${_sym}="
  [ "$_staged"    -eq 1 ] && _sym="${_sym}+"
  [ "$_renamed"   -eq 1 ] && _sym="${_sym}»"
  [ "$_deleted"   -eq 1 ] && _sym="${_sym}✘"
  [ "$_modified"  -eq 1 ] && _sym="${_sym}!"
  [ "$_untracked" -eq 1 ] && _sym="${_sym}?"
  if   [ "$_ahead" -gt 0 ] && [ "$_behind" -gt 0 ]; then _sym="${_sym}⇕"
  elif [ "$_ahead" -gt 0 ];  then _sym="${_sym}⇡"
  elif [ "$_behind" -gt 0 ]; then _sym="${_sym}⇣"
  fi

  [ -n "$_sym" ] && git_status_display="$(printf '\033[1;31m[%s]\033[0m' "$_sym")"
fi

# --- Build output ---
sep=" $(printf '\033[0;90m|\033[0m') "

# 1. Directory (bold cyan) — starship [directory]
dir_part="$dir_display"

# 2. Branch + status inline — starship [git_branch][git_status]
git_part=""
[ -n "$branch_display" ]     && git_part="$branch_display"
[ -n "$git_status_display" ] && git_part="${git_part} ${git_status_display}"

# 3. Model + effort — Claude-specific (yellow)
model_part=""
if [ -n "$model_short" ]; then
  label="$model_short"
  [ -n "$effort" ] && label="$label ($effort)"
  model_part="$(printf '\033[0;33m%s\033[0m' "$label")"
fi

# 4. Context usage — Claude-specific (green/yellow/red by threshold)
if [ -n "$ctx" ]; then
  ctx_rem_int="${ctx_rem:-$(( 100 - ctx ))}"
  if   [ "$ctx" -gt 75 ]; then c='\033[0;31m'
  elif [ "$ctx" -gt 45 ]; then c='\033[0;33m'
  else c='\033[0;32m'; fi
  ctx_part="$(printf "${c}ctx:%d%% rem:%d%%\033[0m" "$ctx" "$ctx_rem_int")"
else
  ctx_part="$(printf '\033[0;90mctx:--%% rem:--%%\033[0m')"
fi

# 5. 5h rate limit + countdown — Claude-specific
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
      timer="${timer} $(date -r "$five_reset" '+%a %-I:%M %p' 2>/dev/null || date -d "@$five_reset" '+%a %-I:%M %p' 2>/dev/null)"
    else
      timer=" reset"
    fi
  fi
  if   [ "$five_pct" -gt 75 ]; then c='\033[0;31m'
  elif [ "$five_pct" -gt 45 ]; then c='\033[0;33m'
  else c='\033[0;32m'; fi
  five_part="$(printf "${c}5h:%d%% rem:%d%%%s\033[0m" "$five_pct" "$(( 100 - five_pct ))" "$timer")"
else
  five_part="$(printf '\033[0;90m5h:--%% rem:--%% --\033[0m')"
fi

# 6. 7d rate limit + reset day — Claude-specific
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
  if   [ "$week_pct" -gt 75 ]; then c='\033[0;31m'
  elif [ "$week_pct" -gt 45 ]; then c='\033[0;33m'
  else c='\033[0;32m'; fi
  week_part="$(printf "${c}7d:%d%% rem:%d%%%s\033[0m" "$week_pct" "$(( 100 - week_pct ))" "$wtimer")"
else
  week_part="$(printf '\033[0;90m7d:--%% rem:--%% --\033[0m')"
fi

# Join helper — skips empty segments, joins the rest with sep
join_parts() {
  local out=""
  for p in "$@"; do
    [ -z "$p" ] && continue
    [ -z "$out" ] && out="$p" || out="${out}${sep}${p}"
  done
  printf '%s' "$out"
}

# Narrow pane (split v/h) -> wrap onto 2 lines: dir+git | model+ctx+5h+7d.
# Claude Code sets $COLUMNS to the pane width (v2.1.153+); 0/unset means unknown, stay single-line.
if [ -n "$COLUMNS" ] && [ "$COLUMNS" -gt 0 ] && [ "$COLUMNS" -lt 100 ]; then
  line1=$(join_parts "$dir_part" "$git_part")
  line2=$(join_parts "$model_part" "$ctx_part" "$five_part" "$week_part")
  printf '%b\n%b\n' "$line1" "$line2"
else
  result=$(join_parts "$dir_part" "$git_part" "$model_part" "$ctx_part" "$five_part" "$week_part")
  printf '%b\n' "$result"
fi
