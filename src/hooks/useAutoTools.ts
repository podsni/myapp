import { useEffect, useState } from "react";
import { tools as initialTools } from "../tools/auto-registry";
import type { EnrichedTool } from "../tools/auto-registry";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
export const isToolRecent = (date?: number) => {
  if (!date) return false;
  return (Date.now() - date) < SEVEN_DAYS_MS;
};

export function useAutoTools() {
  const [allTools, setAllTools] = useState<EnrichedTool[]>(initialTools);
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCount, setNewCount] = useState(
    initialTools.filter((t) => t.autoDetected && isToolRecent(t.date)).length
  );

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function scan() {
      setScanning(true);
      setError(null);
      try {
        const res = await fetch("/api/tools/scan", { signal: controller.signal });
        if (!res.ok) throw new Error(`scan failed (${res.status})`);
        const entries: EnrichedTool[] = await res.json();

        if (cancelled) return;

        setNewCount(entries.filter((t) => t.autoDetected && isToolRecent(t.date)).length);
        setAllTools(entries);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.warn("[Toolsx] Auto-scan failed:", e);
        if (!cancelled) setError("Auto-scan failed. Showing the last generated registry.");
      } finally {
        if (!cancelled) setScanning(false);
      }
    }

    scan();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return { allTools, scanning, newCount, error };
}
