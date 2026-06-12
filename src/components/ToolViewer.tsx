import { Suspense } from "react";
import type { Tool } from "../tools/tools.index";
import { reactComponents } from "../tools/auto-registry";

interface ToolViewerProps {
  tool: Tool & { filePath?: string };
  fullscreen?: boolean;
}

function ReactToolViewer({ path }: { path: string }) {
  const Component = reactComponents[path];

  if (!Component) {
    return (
      <div className="viewer-state viewer-error">
        <span>No component registered for</span>
        <code className="inline-code">{path}</code>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingState />}>
      <Component />
    </Suspense>
  );
}

function HtmlToolViewer({ tool, fullscreen }: { tool: Tool & { filePath?: string }; fullscreen: boolean }) {
  const isSingleFile = tool.filePath?.endsWith(".html") && !tool.filePath.endsWith("index.html");
  const src = isSingleFile ? `/src/tools/${tool.filePath}` : `/src/tools/${tool.path}/index.html`;

  return (
    <iframe
      src={src}
      title={tool.name}
      sandbox="allow-scripts allow-forms allow-modals allow-same-origin"
      className="html-tool-frame"
      data-fullscreen={fullscreen ? "true" : "false"}
    />
  );
}

function LoadingState() {
  return (
    <div className="viewer-state viewer-loading" role="status">
      <span className="loading-block" />
      <span>Loading tool</span>
    </div>
  );
}

export function ToolViewer({ tool, fullscreen = false }: ToolViewerProps) {
  return (
    <div className="tool-viewer" data-type={tool.type}>
      {tool.type === "react" ? (
        <ReactToolViewer path={tool.path} />
      ) : (
        <HtmlToolViewer tool={tool} fullscreen={fullscreen} />
      )}
    </div>
  );
}
