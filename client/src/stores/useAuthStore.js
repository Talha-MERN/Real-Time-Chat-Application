import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      setIsAuthenticated: (resData) => {
        set({ isAuthenticated: resData });
      },
    }),
    {
      name: "Auth Store",
      getStorage: () => localStorage,
    }
  )
);
