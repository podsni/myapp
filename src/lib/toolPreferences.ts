export interface ToolPreferences {
  bookmarkedIds: string[];
  pinnedIds: string[];
}

export const EMPTY_TOOL_PREFERENCES: ToolPreferences = {
  bookmarkedIds: [],
  pinnedIds: [],
};

function unique(ids: string[]) {
  return Array.from(new Set(ids.filter(Boolean)));
}

export function normalizeToolPreferences(value: Partial<ToolPreferences> | null | undefined): ToolPreferences {
  const bookmarkedIds = unique(value?.bookmarkedIds ?? []);
  const pinnedIds = unique(value?.pinnedIds ?? []).filter((id) => bookmarkedIds.includes(id));
  return { bookmarkedIds, pinnedIds };
}

export function toggleBookmark(preferences: ToolPreferences, id: string): ToolPreferences {
  const current = normalizeToolPreferences(preferences);
  const isBookmarked = current.bookmarkedIds.includes(id);

  if (isBookmarked) {
    return {
      bookmarkedIds: current.bookmarkedIds.filter((candidate) => candidate !== id),
      pinnedIds: current.pinnedIds.filter((candidate) => candidate !== id),
    };
  }

  return {
    bookmarkedIds: unique([id, ...current.bookmarkedIds]),
    pinnedIds: current.pinnedIds,
  };
}

export function togglePin(preferences: ToolPreferences, id: string): ToolPreferences {
  const current = normalizeToolPreferences(preferences);
  const isPinned = current.pinnedIds.includes(id);

  if (isPinned) {
    return {
      bookmarkedIds: current.bookmarkedIds,
      pinnedIds: current.pinnedIds.filter((candidate) => candidate !== id),
    };
  }

  return {
    bookmarkedIds: unique([id, ...current.bookmarkedIds]),
    pinnedIds: unique([id, ...current.pinnedIds]),
  };
}
