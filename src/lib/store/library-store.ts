import { create } from "zustand";
import type { DiagramSummary } from "@/lib/types/canonical";

export type ViewMode = "grid" | "list";
export type SortField = "updatedAt" | "title" | "createdAt";
export type SortDirection = "asc" | "desc";

interface LibraryState {
  diagrams: DiagramSummary[];
  viewMode: ViewMode;
  searchQuery: string;
  sortField: SortField;
  sortDirection: SortDirection;
  filterTags: string[];
  isLoading: boolean;

  setDiagrams: (diagrams: DiagramSummary[]) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setSortField: (field: SortField) => void;
  setSortDirection: (direction: SortDirection) => void;
  toggleFilterTag: (tag: string) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  removeDiagram: (id: string) => void;
  addDiagram: (diagram: DiagramSummary) => void;

  // Computed
  filteredDiagrams: () => DiagramSummary[];
  allTags: () => string[];
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  diagrams: [],
  viewMode: "grid",
  searchQuery: "",
  sortField: "updatedAt",
  sortDirection: "desc",
  filterTags: [],
  isLoading: false,

  setDiagrams: (diagrams) => set({ diagrams }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortField: (sortField) => set({ sortField }),
  setSortDirection: (sortDirection) => set({ sortDirection }),
  toggleFilterTag: (tag) =>
    set((state) => ({
      filterTags: state.filterTags.includes(tag)
        ? state.filterTags.filter((t) => t !== tag)
        : [...state.filterTags, tag],
    })),
  clearFilters: () => set({ filterTags: [], searchQuery: "" }),
  setLoading: (isLoading) => set({ isLoading }),
  removeDiagram: (id) =>
    set((state) => ({ diagrams: state.diagrams.filter((d) => d.id !== id) })),
  addDiagram: (diagram) =>
    set((state) => ({ diagrams: [diagram, ...state.diagrams] })),

  filteredDiagrams: () => {
    const { diagrams, searchQuery, filterTags, sortField, sortDirection } = get();
    let result = [...diagrams];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // Filter by tags
    if (filterTags.length > 0) {
      result = result.filter((d) =>
        filterTags.every((tag) => d.tags.includes(tag)),
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp: number;
      if (sortField === "title") {
        cmp = a.title.localeCompare(b.title);
      } else {
        cmp = new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime();
      }
      return sortDirection === "desc" ? -cmp : cmp;
    });

    return result;
  },

  allTags: () => {
    const { diagrams } = get();
    const tagSet = new Set<string>();
    diagrams.forEach((d) => d.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  },
}));
