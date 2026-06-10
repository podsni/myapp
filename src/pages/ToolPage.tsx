import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useAutoTools } from "../hooks/useAutoTools";
import { ToolViewer } from "../components/ToolViewer";
import { useTheme } from "../hooks/useTheme";

export function ToolPage() {
  const { id } = useParams<{ id: string }>();
  const { allTools } = useAutoTools();
  const [fullscreen, setFullscreen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const tool = allTools.find((t) => t.id === id);

  if (!tool) {
    return (
      <div className="tool-notfound">
        <div className="notfound-code">404</div>
        <div className="notfound-msg">Tool not found</div>
        <Link to="/" className="notfound-back">← Back to gallery</Link>
        <style>{`
          .tool-notfound {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: 12px;
            font-family: 'JetBrains Mono', monospace;
          }
          .notfound-code { font-size: 4rem; font-weight: 700; color: var(--border-2); letter-spacing: -0.05em; }
          .notfound-msg { font-size: 1rem; color: var(--muted); }
          .notfound-back { margin-top: 8px; color: var(--primary); font-size: 0.85rem; }
          .notfound-back:hover { text-decoration: underline; text-underline-offset: 3px; }
        `}</style>
      </div>
    );
  }

  if (fullscreen) {
    return (
      <div className="fullscreen-shell">
        <button className="fullscreen-exit" onClick={() => setFullscreen(false)}>
          ✕ Exit fullscreen
        </button>
        <ToolViewer tool={tool} fullscreen />
        <style>{`
          .fullscreen-shell {
            position: fixed;
            inset: 0;
            background: var(--bg);
            z-index: var(--z-modal);
            display: flex;
            flex-direction: column;
          }
          .fullscreen-exit {
            position: absolute;
            top: 12px;
            right: 16px;
            z-index: var(--z-toast);
            background: oklch(from var(--surface-2) l c h / 0.9);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            color: var(--ink-2);
            font-size: 0.78rem;
            padding: 6px 12px;
            backdrop-filter: blur(8px);
          }
          .fullscreen-exit:hover { color: var(--ink); border-color: var(--primary); }
        `}</style>
      </div>
    );
  }

  return (
    <div className="toolpage-shell">
      <nav className="toolpage-nav">
        <div className="nav-left">
          <Link to="/" className="nav-back">
            <span>←</span>
            <span className="nav-brand">Toolsx</span>
          </Link>
          <span className="nav-sep">/</span>
          <div className="nav-title-group">
            <span className="nav-tool-name">{tool.name}</span>
            {tool.description && (
              <span className="nav-tool-desc" title={tool.description}>
                {tool.description}
              </span>
            )}
          </div>
        </div>

        <div className="nav-right">
          {tool.tags && tool.tags.length > 0 && (
            <div className="nav-tags-inline">
              {tool.tags.slice(0, 2).map((t) => (
                <span key={t} className="nav-tag-inline">#{t}</span>
              ))}
            </div>
          )}
          <span className="nav-badge" data-type={tool.type}>
            {tool.type === "react" ? "React" : "HTML"}
          </span>
          <span className="nav-badge" data-cat={tool.category}>
            {tool.category}
          </span>
          {/* Open in new tab */}
          <button
            className="nav-btn"
            onClick={() => {
              let url: string;
              if (tool.type === "html") {
                const fp = (tool as any).filePath as string | undefined;
                const isSingle = fp && fp.endsWith(".html") && !fp.endsWith("index.html");
                url = isSingle
                  ? `/src/tools/${fp}`
                  : `/src/tools/${tool.path}/index.html`;
              } else {
                url = window.location.href;
              }
              window.open(url, "_blank", "noopener");
            }}
            title="Open in new tab"
          >
            <span>↗</span> <span className="nav-btn-text">New tab</span>
          </button>
          <button
            className="nav-btn nav-btn-primary"
            onClick={() => setFullscreen(true)}
            title="Open in fullscreen"
          >
            <span>⤢</span> <span className="nav-btn-text">Fullscreen</span>
          </button>
          {/* Theme Toggle */}
          <button
            className="nav-btn theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      {/* Tool render area */}
      <div className="toolpage-viewer">
        <ToolViewer tool={tool} />
      </div>

      <style>{`
        .toolpage-shell {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          overflow: hidden;
        }
        .toolpage-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 20px;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
          position: sticky;
          top: 0;
          z-index: var(--z-sticky);
          gap: 12px;
          flex-wrap: wrap;
          flex-shrink: 0;
        }
        .nav-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .nav-back {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--muted);
          font-size: 0.85rem;
          transition: color 0.15s;
          flex-shrink: 0;
        }
        .nav-back:hover { color: var(--primary); }
        .nav-brand {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--primary);
        }
        .nav-sep { color: var(--border-2); flex-shrink: 0; }
        .nav-title-group {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }
        .nav-tool-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--ink);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 220px;
          line-height: 1.2;
        }
        .nav-tool-desc {
          font-size: 0.72rem;
          color: var(--muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 380px;
          line-height: 1.2;
        }
        .nav-tags-inline {
          display: flex;
          gap: 6px;
          margin-right: 4px;
        }
        .nav-tag-inline {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          color: var(--muted);
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          background: oklch(from var(--primary) l c h / 0.12);
          color: var(--primary);
        }
        .nav-badge[data-type="html"] {
          background: oklch(from var(--accent) l c h / 0.12);
          color: var(--accent);
        }
        .nav-btn {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--ink-2);
          font-size: 0.78rem;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s;
        }
        .nav-btn:hover { border-color: var(--primary); color: var(--primary); }
        .nav-btn-primary {
          background: oklch(from var(--primary) l c h / 0.12);
          border-color: oklch(from var(--primary) l c h / 0.4);
          color: var(--primary);
        }
        .nav-btn-primary:hover {
          background: oklch(from var(--primary) l c h / 0.20);
          border-color: var(--primary);
          color: var(--primary);
        }
        .theme-toggle-btn {
          width: 30px;
          height: 30px;
          padding: 0;
          justify-content: center;
          font-size: 0.95rem;
          flex-shrink: 0;
        }
        .toolpage-viewer {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* ── Responsive & Mobile Adjustments ── */
        @media (max-width: 768px) {
          .nav-tags-inline {
            display: none;
          }
          .nav-tool-desc {
            max-width: 200px;
          }
        }
        @media (max-width: 640px) {
          .toolpage-nav {
            padding: 8px 12px;
            gap: 6px;
          }
          .nav-tool-name {
            max-width: 100px;
          }
          .nav-tool-desc {
            max-width: 120px;
            font-size: 0.68rem;
          }
          .nav-badge[data-cat] {
            display: none;
          }
          .nav-btn {
            padding: 6px 8px;
          }
          .nav-btn-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
