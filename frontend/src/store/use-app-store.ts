import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PropertyData } from "@/lib/property-generator";

interface AppState {
  watchlist: string[];
  savedSearches: { id: string; name: string; query: string }[];
  notifications: { id: string; title: string; message: string; read: boolean }[];
  timeRange: "1M" | "3M" | "6M" | "1Y" | "ALL";
  commandPaletteOpen: boolean;
  darkMode: boolean;
  aiCopilotOpen: boolean;
  addToWatchlist: (propertyId: string) => void;
  removeFromWatchlist: (propertyId: string) => void;
  addSavedSearch: (name: string, query: string) => void;
  addNotification: (title: string, message: string) => void;
  markNotificationRead: (id: string) => void;
  setTimeRange: (range: AppState["timeRange"]) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  setAiCopilotOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      watchlist: [],
      savedSearches: [],
      notifications: [
        {
          id: "1",
          title: "New undervalued property",
          message: "AI flagged 3 new opportunities in your tracked markets",
          read: false,
        },
      ],
      timeRange: "6M",
      commandPaletteOpen: false,
      darkMode: false,
      aiCopilotOpen: true,
      addToWatchlist: (propertyId) =>
        set((s) => ({
          watchlist: s.watchlist.includes(propertyId)
            ? s.watchlist
            : [...s.watchlist, propertyId],
        })),
      removeFromWatchlist: (propertyId) =>
        set((s) => ({
          watchlist: s.watchlist.filter((id) => id !== propertyId),
        })),
      addSavedSearch: (name, query) =>
        set((s) => ({
          savedSearches: [
            ...s.savedSearches,
            { id: Date.now().toString(), name, query },
          ],
        })),
      addNotification: (title, message) =>
        set((s) => ({
          notifications: [
            {
              id: Date.now().toString(),
              title,
              message,
              read: false,
            },
            ...s.notifications,
          ],
        })),
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      setTimeRange: (timeRange) => set({ timeRange }),
      setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setAiCopilotOpen: (aiCopilotOpen) => set({ aiCopilotOpen }),
    }),
    { name: "estate-ai-store" }
  )
);

export type { PropertyData };
