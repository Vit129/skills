#!/usr/bin/env python3
"""Local HTTP server for the learning journey — the real-delete/edit version.

The published claude.ai Artifact is browser-sandboxed and can't touch local
files, so it's scrub/playback only. This is the other half: a stdlib-only
HTTP server bound to 127.0.0.1, meant to be opened in a Kouen browser pane
(a local process, same trust level as any other local dev server on this
machine) — where delete/edit actually mutate the real source files, closer
to what `hermes journey` does as a local CLI process.

Security: binds 127.0.0.1 only (not reachable off this machine). Delete/edit
targets are validated against the same 3 known source roots
journey_timeline.py reads from, with a resolved-path containment check —
rejects any path outside those roots or that escapes via `..`. No auth
beyond "request came from localhost", same trust boundary as any other local
tool on this machine (kouen MCP itself, etc.) — not exposed to a network.

Usage: python3 journey_server.py [--port 8765]
Then open http://127.0.0.1:8765/ in a Kouen browser pane (or any browser).
"""
from __future__ import annotations

import json
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import urlparse

sys.path.insert(0, str(Path(__file__).parent))
from journey_timeline import build_timeline, CC_MEMORY_DIR, KNOWLEDGE_DIR, CANDIDATES_DIR  # noqa: E402

ALLOWED_ROOTS = [CC_MEMORY_DIR.resolve(), KNOWLEDGE_DIR.resolve(), CANDIDATES_DIR.resolve()]


def resolve_and_validate(rel_path: str) -> Path:
    """rel_path is home-relative (as journey_timeline.py emits it, e.g.
    '.claude/agent-memory/knowledge/foo.md'). Reject anything that resolves
    outside the 3 known source roots — this is the only thing standing
    between a fetch() call and deleting an arbitrary file on disk."""
    candidate = (Path.home() / rel_path).resolve()
    if not any(candidate == root or root in candidate.parents for root in ALLOWED_ROOTS):
        raise ValueError(f"path outside allowed roots: {candidate}")
    if not candidate.is_file():
        raise ValueError(f"not a file: {candidate}")
    return candidate


PAGE_TEMPLATE = r"""<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Learning Journey — local</title>
<style>
  :root {
    --bg: #F1F3EE; --surface: #FFFFFF; --surface-inset: #EAEEE6;
    --ink: #1C2621; --ink-muted: #5B6B62; --ink-faint: #8A988E; --border: #DAE1D6;
    --accent: #B87A1F; --accent-soft: #F1E3CC;
    --type-memory: #2F6E68; --type-memory-soft: #DCEBE9;
    --type-knowledge: #6B4E71; --type-knowledge-soft: #EBE1EC;
    --type-candidate: #B87A1F; --type-candidate-soft: #F1E3CC;
    --danger: #B3432F; --danger-soft: #F5DCD6;
    --shadow: 0 1px 2px rgba(28,38,33,.06), 0 4px 14px rgba(28,38,33,.05);
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.5; }
  .wrap { max-width: 900px; margin: 0 auto; padding: 40px 24px 96px; }
  .eyebrow { font-family: ui-monospace, Menlo, monospace; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-faint); }
  h1 { font-family: Georgia, serif; font-weight: 500; font-size: 32px; margin: 4px 0 6px; }
  .sub { color: var(--ink-muted); font-size: 14px; max-width: 65ch; margin-bottom: 24px; }
  .node { position: relative; background: var(--surface); border: 1px solid var(--border); border-left: 3px solid var(--node-color, var(--ink-faint)); border-radius: 8px; padding: 13px 16px; margin-bottom: 10px; box-shadow: var(--shadow); }
  .node-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .node-name { font-family: Georgia, serif; font-size: 16.5px; font-weight: 500; }
  .node-meta { display: flex; align-items: center; gap: 8px; font-family: ui-monospace, Menlo, monospace; font-size: 11.5px; color: var(--ink-faint); }
  .type-tag { font-size: 10.5px; text-transform: uppercase; padding: 2px 7px; border-radius: 5px; font-weight: 600; }
  .node-desc { margin-top: 5px; color: var(--ink-muted); font-size: 13.5px; }
  .node-path { margin-top: 7px; font-family: ui-monospace, Menlo, monospace; font-size: 11px; color: var(--ink-faint); overflow-x: auto; white-space: nowrap; }
  .node-actions { margin-top: 10px; display: flex; gap: 8px; }
  button.act { font-family: ui-monospace, Menlo, monospace; font-size: 11.5px; padding: 5px 10px; border-radius: 6px; border: 1px solid var(--border); background: var(--surface-inset); color: var(--ink); cursor: pointer; }
  button.act:hover { background: var(--accent-soft); border-color: var(--accent); }
  button.act.danger:hover { background: var(--danger-soft); border-color: var(--danger); color: var(--danger); }
  .editbox { margin-top: 10px; }
  .editbox textarea { width: 100%; min-height: 180px; font-family: ui-monospace, Menlo, monospace; font-size: 12px; padding: 10px; border-radius: 6px; border: 1px solid var(--border); background: var(--surface-inset); color: var(--ink); }
  .editbox .row { display: flex; gap: 8px; margin-top: 6px; }
  .status { font-family: ui-monospace, Menlo, monospace; font-size: 12px; color: var(--ink-muted); margin-bottom: 16px; }
</style>
</head>
<body>
<div class="wrap">
  <div class="eyebrow">~/.claude · learning journey · local, real delete/edit</div>
  <h1>What this agent has learned</h1>
  <div class="sub">Served from a local process (127.0.0.1 only) — Delete and Edit here mutate the real source file on disk, unlike the read-only claude.ai Artifact version.</div>
  <div class="status" id="status"></div>
  <div id="list"></div>
</div>
<script>
const TYPE_LABEL = { memory: "Memory", knowledge: "Knowledge", "skill-candidate": "Skill candidate" };

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function loadNodes() {
  const res = await fetch("/api/nodes");
  const nodes = await res.json();
  render(nodes);
}

function render(nodes) {
  const listEl = document.getElementById("list");
  document.getElementById("status").textContent = `${nodes.length} nodes`;
  listEl.innerHTML = "";
  nodes.forEach(n => {
    const typeKey = n.type === "skill-candidate" ? "candidate" : n.type;
    const el = document.createElement("div");
    el.className = "node";
    el.style.setProperty("--node-color", `var(--type-${typeKey})`);
    el.innerHTML = `
      <div class="node-head">
        <span class="node-name">${escapeHtml(n.name)}</span>
        <span class="node-meta">
          <span class="type-tag" style="background:var(--type-${typeKey}-soft); color:var(--type-${typeKey})">${TYPE_LABEL[n.type] || n.type}</span>
          ${n.timestamp.slice(0, 10)}
        </span>
      </div>
      <div class="node-desc">${escapeHtml(n.description)}</div>
      <div class="node-path">${escapeHtml(n.path)}</div>
      <div class="node-actions">
        <button class="act" data-act="edit">Edit</button>
        <button class="act danger" data-act="delete">Delete</button>
      </div>
    `;
    el.querySelector('[data-act="delete"]').addEventListener("click", () => onDelete(n.path, el));
    el.querySelector('[data-act="edit"]').addEventListener("click", () => onEdit(n.path, el));
    listEl.appendChild(el);
  });
}

async function onDelete(path, el) {
  if (!confirm(`Delete ${path}?\n\nThis removes the real file — not reversible from here.`)) return;
  const res = await fetch("/api/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Requested-By": "journey" },
    body: JSON.stringify({ path }),
  });
  if (res.ok) {
    el.remove();
  } else {
    alert("Delete failed: " + (await res.text()));
  }
}

async function onEdit(path, el) {
  const existing = el.querySelector(".editbox");
  if (existing) { existing.remove(); return; }
  const res = await fetch("/api/content?path=" + encodeURIComponent(path));
  if (!res.ok) { alert("Read failed: " + (await res.text())); return; }
  const content = await res.text();
  const box = document.createElement("div");
  box.className = "editbox";
  box.innerHTML = `
    <textarea>${escapeHtml(content)}</textarea>
    <div class="row">
      <button class="act" data-act="save">Save</button>
      <button class="act" data-act="cancel">Cancel</button>
    </div>
  `;
  box.querySelector('[data-act="cancel"]').addEventListener("click", () => box.remove());
  box.querySelector('[data-act="save"]').addEventListener("click", async () => {
    const newContent = box.querySelector("textarea").value;
    const saveRes = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Requested-By": "journey" },
      body: JSON.stringify({ path, content: newContent }),
    });
    if (saveRes.ok) { box.remove(); } else { alert("Save failed: " + (await saveRes.text())); }
  });
  el.appendChild(box);
}

loadNodes();
</script>
</body>
</html>
"""


class Handler(BaseHTTPRequestHandler):
    # Set by main() before serve_forever() — used for the Host-header allowlist.
    port = None

    def log_message(self, format, *args):
        pass  # quiet by default; errors still raise/print via send_error

    def _host_ok(self) -> bool:
        # DNS-rebinding defense: a page from evil.com can be tricked into
        # resolving to 127.0.0.1 mid-session, letting its same-origin JS talk
        # to this server without any cross-origin restriction. The Host
        # header a real browser sends still reads "evil.com", not
        # "127.0.0.1:<port>" — so an exact allowlist here rejects it even
        # though the underlying TCP connection did land on localhost.
        host = self.headers.get("Host", "")
        return host in (f"127.0.0.1:{self.port}", f"localhost:{self.port}")

    def _json(self, obj, status=200):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _text(self, text, status=200, content_type="text/plain; charset=utf-8"):
        body = text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if not self._host_ok():
            self._text("forbidden: bad Host header", status=403)
            return
        parsed = urlparse(self.path)
        if parsed.path == "/":
            self._text(PAGE_TEMPLATE, content_type="text/html; charset=utf-8")
        elif parsed.path == "/api/nodes":
            self._json(build_timeline())
        elif parsed.path == "/api/content":
            from urllib.parse import parse_qs
            qs = parse_qs(parsed.query)
            rel = qs.get("path", [""])[0]
            try:
                f = resolve_and_validate(rel)
                self._text(f.read_text(errors="ignore"))
            except ValueError as e:
                self._text(str(e), status=400)
        else:
            self._text("not found", status=404)

    def do_POST(self):
        if not self._host_ok():
            self._text("forbidden: bad Host header", status=403)
            return
        # CSRF defense: a plain cross-origin <form> POST (the vector that
        # actually works here — text/plain or urlencoded bodies are "simple
        # requests", no CORS preflight, no way for us to block them by
        # inspecting Origin alone since forms don't reliably send one) CANNOT
        # set a custom header. Requiring one forces the browser to preflight
        # with OPTIONS, which this server doesn't implement (falls through
        # to the 404 branch) — so the preflight fails and the real POST is
        # never sent, from any origin, including one that DNS-rebinding
        # already got past the Host check above.
        if self.headers.get("X-Requested-By") != "journey":
            self._text("forbidden: missing X-Requested-By header", status=403)
            return
        if self.headers.get("Content-Type", "").split(";")[0].strip() != "application/json":
            self._text("expected Content-Type: application/json", status=400)
            return

        parsed = urlparse(self.path)
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b"{}"
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            self._text("bad json", status=400)
            return

        if parsed.path == "/api/delete":
            try:
                f = resolve_and_validate(data.get("path", ""))
                f.unlink()
                self._json({"ok": True})
            except ValueError as e:
                self._text(str(e), status=400)
        elif parsed.path == "/api/content":
            try:
                f = resolve_and_validate(data.get("path", ""))
                f.write_text(data.get("content", ""))
                self._json({"ok": True})
            except ValueError as e:
                self._text(str(e), status=400)
        else:
            self._text("not found", status=404)


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()

    Handler.port = args.port
    server = HTTPServer(("127.0.0.1", args.port), Handler)
    print(f"Learning journey (local, real delete/edit) at http://127.0.0.1:{args.port}/")
    print("Ctrl-C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
