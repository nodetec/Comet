import { Note, Tag } from "~/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface State {
  filter: "all" | "trashed" | "archived";
  setFilter: (filter: "all" | "trashed" | "archived") => void;

  activeTag: Tag | undefined;
  setActiveTag: (activeTag: Tag | undefined) => void;

  currentNote: Note | undefined;
  setCurrentNote: (currentNote: Note | undefined) => void;

  currentTrashedNote: Note | undefined;
  setCurrentTrashedNote: (currentTrashedNote: Note | undefined) => void;

  noteSearch: string | undefined;
  setNoteSearch: (noteSearch: string | undefined) => void;
}

export const useAppContext = create<State>()(
  persist(
    (set) => ({
      filter: "all",
      setFilter: (filter) => set({ filter }),

      activeTag: undefined,
      setActiveTag: (activeTag) => set({ activeTag }),

      currentNote: undefined,
      setCurrentNote: (currentNote) => set({ currentNote }),

      currentTrashedNote: undefined,
      setCurrentTrashedNote: (currentTrashedNote) => set({ currentTrashedNote }),

      noteSearch: undefined,
      setNoteSearch: (noteSearch) => set({ noteSearch: noteSearch }),
    }),
    {
      name: "captains-log-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
