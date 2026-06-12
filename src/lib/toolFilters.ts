import type { EnrichedTool } from "../tools/auto-registry";
import { isToolRecent } from "../hooks/useAutoTools";

export type ToolTypeFilter = "all" | "react" | "html";
export type ToolSort = "newest" | "oldest" | "name-asc" | "name-desc";

export interface ToolFilterState {
  search: string;
  activeCategory: string;
  activeType: ToolTypeFilter;
  sortBy: ToolSort;
}

export function filterAndSortTools(tools: EnrichedTool[], filters: ToolFilterState) {
  const query = filters.search.trim().toLowerCase();

  const filtered = tools.filter((tool) => {
    const matchesSearch =
      query.length === 0 ||
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.tags?.some((tag) => tag.toLowerCase().includes(query));

    const matchesCategory =
      filters.activeCategory === "All" ||
      (filters.activeCategory === "__new__"
        ? Boolean(tool.autoDetected && isToolRecent(tool.date))
        : tool.category === filters.activeCategory);

    const matchesType = filters.activeType === "all" || tool.type === filters.activeType;

    return matchesSearch && matchesCategory && matchesType;
  });

  return filtered.sort((a, b) => {
    if (filters.sortBy === "newest") return (b.date ?? 0) - (a.date ?? 0);
    if (filters.sortBy === "oldest") return (a.date ?? 0) - (b.date ?? 0);
    if (filters.sortBy === "name-desc") return b.name.localeCompare(a.name);
    return a.name.localeCompare(b.name);
  });
}
