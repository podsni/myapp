import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Maximize2, Moon, Sun, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ToolViewer } from "../components/ToolViewer";
import { useAutoTools } from "../hooks/useAutoTools";
import { useTheme } from "../hooks/useTheme";

export function ToolPage() {
  const { id } = useParams<{ id: string }>();
  const { allTools } = useAutoTools();
  const [fullscreen, setFullscreen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const tool = allTools.find((candidate) => candidate.id === id);

  useEffect(() => {
    if (!fullscreen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setFullscreen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [fullscreen]);

  if (!tool) {
    return (
      <div className="tool-notfound">
        <div className="notfound-code">404</div>
        <div className="notfound-msg">Tool not found</div>
        <Link to="/" className="notfound-back">
          <ArrowLeft size={15} aria-hidden="true" />
          Back to gallery
        </Link>
      </div>
    );
  }

  const htmlSingleFile = tool.filePath?.endsWith(".html") && !tool.filePath.endsWith("index.html");
  const newTabUrl =
    tool.type === "html"
      ? htmlSingleFile
        ? `/src/tools/${tool.filePath}`
        : `/src/tools/${tool.path}/index.html`
      : window.location.href;

  if (fullscreen) {
    return (
      <div className="fullscreen-shell">
        <button type="button" className="fullscreen-exit" onClick={() => setFullscreen(false)}>
          <X size={15} aria-hidden="true" />
          Exit fullscreen
        </button>
        <ToolViewer tool={tool} fullscreen />
      </div>
    );
  }

  return (
    <div className="toolpage-shell">
      <nav className="toolpage-nav" aria-label="Tool navigation">
        <div className="nav-left">
          <Link to="/" className="nav-back">
            <ArrowLeft size={15} aria-hidden="true" />
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
              {tool.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="nav-tag-inline">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <span className="nav-badge" data-type={tool.type}>
            {tool.type === "react" ? "React" : "HTML"}
          </span>
          <span className="nav-badge nav-badge-category">{tool.category}</span>
          <button
            type="button"
            className="nav-btn"
            onClick={() => window.open(newTabUrl, "_blank", "noopener")}
            title="Open in new tab"
            aria-label="Open in new tab"
          >
            <ExternalLink size={14} aria-hidden="true" />
            <span className="nav-btn-text">New tab</span>
          </button>
          <button
            type="button"
            className="nav-btn nav-btn-primary"
            onClick={() => setFullscreen(true)}
            title="Open in fullscreen"
            aria-label="Open in fullscreen"
          >
            <Maximize2 size={14} aria-hidden="true" />
            <span className="nav-btn-text">Fullscreen</span>
          </button>
          <button
            type="button"
            className="nav-btn nav-btn-icon"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div className="toolpage-viewer">
        <ToolViewer tool={tool} />
      </div>
    </div>
  );
}
