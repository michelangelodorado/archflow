"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLibraryStore, ViewMode, SortField } from "@/lib/store/library-store";

export function LibraryToolbar() {
  const {
    viewMode, setViewMode,
    searchQuery, setSearchQuery,
    sortField, setSortField,
    sortDirection, setSortDirection,
    filterTags, toggleFilterTag,
    allTags,
    clearFilters,
  } = useLibraryStore();

  const tags = allTags();

  return (
    <div className="space-y-3">
      {/* Top row: search + view toggle + sort */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Input
            placeholder="Search diagrams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Sort */}
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="updatedAt">Updated</option>
          <option value="createdAt">Created</option>
          <option value="title">Title</option>
        </select>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          title={sortDirection === "asc" ? "Ascending" : "Descending"}
        >
          {sortDirection === "asc" ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
          )}
        </Button>

        {/* View toggle */}
        <div className="flex border border-border rounded-md">
          <ViewToggle mode="grid" current={viewMode} onClick={setViewMode} />
          <ViewToggle mode="list" current={viewMode} onClick={setViewMode} />
        </div>
      </div>

      {/* Tag filters */}
      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Filter:</span>
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant={filterTags.includes(tag) ? "default" : "outline"}
              onClick={() => toggleFilterTag(tag)}
            >
              {tag}
            </Badge>
          ))}
          {filterTags.length > 0 && (
            <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground">
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ViewToggle({ mode, current, onClick }: { mode: ViewMode; current: ViewMode; onClick: (m: ViewMode) => void }) {
  const isActive = mode === current;
  return (
    <button
      onClick={() => onClick(mode)}
      className={`p-2 ${isActive ? "bg-muted" : "hover:bg-muted/50"} ${mode === "grid" ? "rounded-l-md" : "rounded-r-md"}`}
    >
      {mode === "grid" ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      )}
    </button>
  );
}
