import { describe, expect, test } from "bun:test";
import type { EnrichedTool } from "../tools/auto-registry";
import { filterAndSortTools } from "./toolFilters";

const tools = [
  {
    id: "json",
    name: "JSON Formatter",
    description: "Format raw JSON",
    type: "react",
    path: "react/json",
    category: "Developer",
    tags: ["json", "format"],
    date: 300,
  },
  {
    id: "gradient",
    name: "Gradient Maker",
    description: "Build CSS gradients",
    type: "html",
    path: "html/gradient",
    category: "Design",
    tags: ["css", "color"],
    autoDetected: true,
    date: Date.now(),
  },
  {
    id: "notes",
    name: "Notes",
    description: "Quick text scratchpad",
    type: "react",
    path: "react/notes",
    category: "Text",
    tags: ["text"],
    autoDetected: true,
    date: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
] satisfies EnrichedTool[];

describe("filterAndSortTools", () => {
  test("applies the new-tools filter before returning result counts", () => {
    const result = filterAndSortTools(tools, {
      search: "",
      activeCategory: "__new__",
      activeType: "all",
      sortBy: "newest",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("gradient");
  });

  test("searches names, descriptions, and tags case-insensitively", () => {
    const result = filterAndSortTools(tools, {
      search: "COLOR",
      activeCategory: "All",
      activeType: "html",
      sortBy: "name-asc",
    });

    expect(result.map((tool) => tool.id)).toEqual(["gradient"]);
  });

  test("sorts filtered tools by name descending", () => {
    const result = filterAndSortTools(tools, {
      search: "",
      activeCategory: "All",
      activeType: "react",
      sortBy: "name-desc",
    });

    expect(result.map((tool) => tool.name)).toEqual(["Notes", "JSON Formatter"]);
  });

  test("filters bookmarked tools", () => {
    const result = filterAndSortTools(tools, {
      search: "",
      activeCategory: "__bookmarked__",
      activeType: "all",
      sortBy: "name-asc",
      bookmarkedIds: ["json", "notes"],
      pinnedIds: [],
    });

    expect(result.map((tool) => tool.id)).toEqual(["json", "notes"]);
  });

  test("filters pinned tools", () => {
    const result = filterAndSortTools(tools, {
      search: "",
      activeCategory: "__pinned__",
      activeType: "all",
      sortBy: "name-asc",
      bookmarkedIds: [],
      pinnedIds: ["gradient"],
    });

    expect(result.map((tool) => tool.id)).toEqual(["gradient"]);
  });

  test("keeps pinned tools above the selected sort order", () => {
    const result = filterAndSortTools(tools, {
      search: "",
      activeCategory: "All",
      activeType: "all",
      sortBy: "name-asc",
      bookmarkedIds: [],
      pinnedIds: ["notes"],
    });

    expect(result.map((tool) => tool.id)).toEqual(["notes", "gradient", "json"]);
  });
});
