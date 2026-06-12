import { describe, expect, test } from "bun:test";
import { toggleBookmark, togglePin } from "./toolPreferences";

describe("tool preferences", () => {
  test("toggleBookmark adds and removes a bookmark id", () => {
    const added = toggleBookmark({ bookmarkedIds: [], pinnedIds: [] }, "json");
    expect(added).toEqual({ bookmarkedIds: ["json"], pinnedIds: [] });

    const removed = toggleBookmark(added, "json");
    expect(removed).toEqual({ bookmarkedIds: [], pinnedIds: [] });
  });

  test("removing a bookmark also removes its pin", () => {
    const result = toggleBookmark({ bookmarkedIds: ["json"], pinnedIds: ["json"] }, "json");

    expect(result).toEqual({ bookmarkedIds: [], pinnedIds: [] });
  });

  test("togglePin pins a tool and keeps it bookmarked", () => {
    const added = togglePin({ bookmarkedIds: [], pinnedIds: [] }, "json");
    expect(added).toEqual({ bookmarkedIds: ["json"], pinnedIds: ["json"] });

    const removed = togglePin(added, "json");
    expect(removed).toEqual({ bookmarkedIds: ["json"], pinnedIds: [] });
  });
});
