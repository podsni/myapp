import { useEffect, useMemo, useState } from "react";
import {
  EMPTY_TOOL_PREFERENCES,
  normalizeToolPreferences,
  toggleBookmark,
  togglePin,
  type ToolPreferences,
} from "../lib/toolPreferences";

const STORAGE_KEY = "toolsx.toolPreferences.v1";

function readPreferences(): ToolPreferences {
  if (typeof window === "undefined") return EMPTY_TOOL_PREFERENCES;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_TOOL_PREFERENCES;
    return normalizeToolPreferences(JSON.parse(raw));
  } catch {
    return EMPTY_TOOL_PREFERENCES;
  }
}

export function useToolPreferences() {
  const [preferences, setPreferences] = useState<ToolPreferences>(readPreferences);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  return useMemo(
    () => ({
      preferences,
      bookmarkedIds: preferences.bookmarkedIds,
      pinnedIds: preferences.pinnedIds,
      isBookmarked: (id: string) => preferences.bookmarkedIds.includes(id),
      isPinned: (id: string) => preferences.pinnedIds.includes(id),
      toggleBookmark: (id: string) => setPreferences((current) => toggleBookmark(current, id)),
      togglePin: (id: string) => setPreferences((current) => togglePin(current, id)),
    }),
    [preferences],
  );
}
