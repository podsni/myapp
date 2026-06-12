import { useMemo, useState } from "react";
import { AlertTriangle, Hexagon, Moon, Search, Sparkles, Sun, X } from "lucide-react";
import { ToolCard } from "../components/ToolCard";
import { useAutoTools } from "../hooks/useAutoTools";
import { useTheme } from "../hooks/useTheme";
import { filterAndSortTools, type ToolSort, type ToolTypeFilter } from "../lib/toolFilters";

export function HomePage() {
  const { allTools, scanning, newCount, error } = useAutoTools();
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState<ToolTypeFilter>("all");
  const [sortBy, setSortBy] = useState<ToolSort>("newest");

  const allCategories = useMemo(() => {
    const categories = Array.from(new Set(allTools.map((tool) => tool.category)));
    return ["All", ...categories];
  }, [allTools]);

  const visibleTools = useMemo(
    () => filterAndSortTools(allTools, { search, activeCategory, activeType, sortBy }),
    [allTools, search, activeCategory, activeType, sortBy],
  );

  const hasActiveFilters = search.length > 0 || activeCategory !== "All" || activeType !== "all";
  const resultLabel = `${visibleTools.length} tool${visibleTools.length === 1 ? "" : "s"}${
    scanning ? " (scanning for more)" : ""
  }${activeCategory !== "All" && activeCategory !== "__new__" ? ` in ${activeCategory}` : ""}${
    activeCategory === "__new__" ? " recently detected" : ""
  }${search ? ` matching "${search}"` : ""}`;

  function resetFilters() {
    setSearch("");
    setActiveCategory("All");
    setActiveType("all");
  }

  return (
    <div className="home-shell">
      <header className="home-header">
        <div className="home-logo-row">
          <div className="logo-section">
            <div className="home-logo" aria-label="Toolsx">
              <Hexagon className="logo-mark" aria-hidden="true" />
              <span className="logo-text">Toolsx</span>
            </div>

            {scanning ? (
              <span className="scan-badge scanning" aria-live="polite">
                <span className="scan-dot" /> Scanning
              </span>
            ) : newCount > 0 ? (
              <button
                type="button"
                className="scan-badge has-new"
                onClick={() => setActiveCategory(activeCategory === "__new__" ? "All" : "__new__")}
                aria-pressed={activeCategory === "__new__"}
              >
                <Sparkles size={13} aria-hidden="true" />
                {newCount} new
              </button>
            ) : null}
          </div>

          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
          </button>
        </div>
        <p className="home-tagline">Your personal tool gallery. Drop a file, ship a tool.</p>
      </header>

      <section className="toolbar" aria-label="Tool filters">
        <div className="search-wrap">
          <Search className="search-icon" size={17} aria-hidden="true" />
          <input
            id="search-tools"
            type="search"
            placeholder="Search tools"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="search-input"
            autoComplete="off"
          />
          {search && (
            <button type="button" className="search-clear" onClick={() => setSearch("")} aria-label="Clear search">
              <X size={15} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="toolbar-filters">
          <div className="type-filters" aria-label="Tool type">
            {(["all", "react", "html"] as const).map((type) => (
              <button
                type="button"
                key={type}
                className={`type-filter-btn ${activeType === type ? "active" : ""}`}
                onClick={() => setActiveType(type)}
                aria-pressed={activeType === type}
              >
                {type === "all" ? "All" : type === "react" ? "React" : "HTML"}
              </button>
            ))}
          </div>

          <label className="sort-wrap">
            <span className="sort-label">Sort</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as ToolSort)}
              className="sort-select"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </label>

          <div className="filter-chips" aria-label="Tool categories">
            {allCategories.map((category) => (
              <button
                type="button"
                key={category}
                className={`filter-chip ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
            {newCount > 0 && (
              <button
                type="button"
                className={`filter-chip filter-chip-new ${activeCategory === "__new__" ? "active" : ""}`}
                onClick={() => setActiveCategory(activeCategory === "__new__" ? "All" : "__new__")}
                aria-pressed={activeCategory === "__new__"}
              >
                New
              </button>
            )}
          </div>
        </div>
      </section>

      {error && (
        <div className="scan-error" role="status">
          <AlertTriangle size={15} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div className="results-meta">
        <span className="results-count">{resultLabel}</span>
      </div>

      {visibleTools.length > 0 ? (
        <div className="tools-grid">
          {visibleTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">No matches</div>
          <div className="empty-title">Nothing fits the current filters</div>
          <div className="empty-hint">
            Try a broader search, clear filters, or drop a file into{" "}
            <code className="inline-code">src/tools/html/</code> or{" "}
            <code className="inline-code">src/tools/react/</code>.
          </div>
          {hasActiveFilters && (
            <button type="button" className="empty-action" onClick={resetFilters}>
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
