#!/usr/bin/env python3
"""Router Calibration Scheduler.

Same check-and-report shape as candidate-scheduler.sh/eval-scheduler.sh, but
gated on NEW LOGGED OUTCOMES (from router_log_outcome.py), not calendar
days -- there's nothing to calibrate from until real confirm/reject data
exists. Runs daily via launchd like the others; usually a cheap no-op.

STATE file tracks how many log lines were already processed. When enough
new ones have accumulated, recompute thresholds from the FULL log history
(not just the new lines -- more data is always better for this) and write
them to project_router.py's THRESHOLDS_PATH.

Algorithm (conservative on purpose -- worst case is a suboptimal threshold,
never a wrong auto-file, since the router only ever prints a candidate
guess):
  - Need >=3 confirmed outcomes before touching anything (too little
    true-positive signal otherwise).
  - min_abs_score: if rejected outcomes exist AND their scores are cleanly
    below all confirmed scores, set it to the midpoint. If they overlap
    (can't cleanly separate), stay conservative -- use 95% of the weakest
    confirmed score rather than guessing. If no rejections logged yet, use
    85% of the weakest confirmed score (headroom for score variance).
  - min_margin: 70% of the weakest observed successful margin
    (top_score - second_score among confirmed outcomes), floored at 0.01.

Usage: ./router-calibration-scheduler.py [--force]
Returns exit 0 + report if calibration ran, exit 1 if not due.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

CLAUDE_DIR = Path.home() / ".claude"
LOG_PATH = CLAUDE_DIR / "agent-memory" / "router-calibration-log.jsonl"
STATE_PATH = CLAUDE_DIR / "agent-memory" / "ROUTER-CALIBRATION-STATE.md"
THRESHOLDS_PATH = CLAUDE_DIR / "agent-memory" / ".state" / "router-thresholds.json"
LOG_DIR = CLAUDE_DIR / "agent-memory" / "router-calibration-checks"
MIN_NEW_SAMPLES = 8
MIN_CONFIRMED = 3


def read_log() -> list[dict]:
    if not LOG_PATH.exists():
        return []
    entries = []
    for line in LOG_PATH.read_text().splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            entries.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return entries


def read_state() -> dict:
    if not STATE_PATH.exists():
        return {"last_calibrated_count": 0}
    for line in STATE_PATH.read_text().splitlines():
        if line.startswith("last_calibrated_count:"):
            try:
                return {"last_calibrated_count": int(line.split(":", 1)[1].strip())}
            except ValueError:
                pass
    return {"last_calibrated_count": 0}


def write_state(count: int) -> None:
    STATE_PATH.write_text(f"last_calibrated_count: {count}\n")


def calibrate(entries: list[dict]) -> tuple[float, float, str] | None:
    confirmed = [e for e in entries if e.get("outcome") == "confirmed"]
    rejected = [e for e in entries if e.get("outcome") == "rejected"]

    if len(confirmed) < MIN_CONFIRMED:
        return None

    tp_scores = sorted(e["top_score"] for e in confirmed)
    tp_margins = sorted(e["top_score"] - e["second_score"] for e in confirmed)

    if rejected:
        fp_scores = sorted(e["top_score"] for e in rejected)
        if tp_scores[0] > fp_scores[-1]:
            min_abs_score = (tp_scores[0] + fp_scores[-1]) / 2
            note = f"clean separation: {len(confirmed)} confirmed, {len(rejected)} rejected, midpoint threshold"
        else:
            min_abs_score = tp_scores[0] * 0.95
            note = (
                f"overlapping distributions ({len(confirmed)} confirmed, {len(rejected)} rejected, "
                "lowest confirmed <= highest rejected) -- staying conservative, 95% of weakest confirmed"
            )
    else:
        min_abs_score = tp_scores[0] * 0.85
        note = f"{len(confirmed)} confirmed, 0 rejected logged yet -- 85% of weakest confirmed (headroom)"

    min_margin = max(0.01, tp_margins[0] * 0.7)

    return round(min_abs_score, 4), round(min_margin, 4), note


def main() -> None:
    force = "--force" in sys.argv
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    entries = read_log()
    state = read_state()
    new_count = len(entries) - state["last_calibrated_count"]

    if not force and new_count < MIN_NEW_SAMPLES:
        print(f"NOT_DUE ({len(entries)} total logged, {new_count} new since last calibration, need {MIN_NEW_SAMPLES})")
        sys.exit(1)

    result = calibrate(entries)
    from datetime import date
    today = date.today().isoformat()
    log_file = LOG_DIR / f"{today}.md"

    lines = [f"## Router Calibration Check ({today})", ""]
    if result is None:
        lines.append(
            f"{new_count} new outcome(s) logged ({len(entries)} total), but fewer than "
            f"{MIN_CONFIRMED} confirmed outcomes exist -- not enough true-positive signal "
            "to calibrate yet. Thresholds unchanged."
        )
    else:
        min_abs_score, min_margin, note = result
        THRESHOLDS_PATH.parent.mkdir(parents=True, exist_ok=True)
        THRESHOLDS_PATH.write_text(json.dumps({
            "min_abs_score": min_abs_score,
            "min_margin": min_margin,
            "calibrated_at": today,
            "sample_count": len(entries),
        }))
        lines.append(f"Recalibrated from {len(entries)} logged outcome(s) ({new_count} new). {note}")
        lines.append(f"- min_abs_score: {min_abs_score}")
        lines.append(f"- min_margin: {min_margin}")
        lines.append(f"Written to {THRESHOLDS_PATH.relative_to(CLAUDE_DIR)}")

    report = "\n".join(lines)
    print(report)
    log_file.write_text(report + "\n")
    write_state(len(entries))


if __name__ == "__main__":
    main()
