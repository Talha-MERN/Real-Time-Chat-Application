import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create(
  persist(
    (set) => ({
      selectedChat: null,
      setSelectedChat: (resData) => {
        set({ selectedChat: resData });
      },

      chats: [],
      setChats: (resData) => {
        set({ chats: resData });
      },
    }),
    {
      name: "Chat Store",
      getStorage: () => localStorage,
      partialize: (state) => ({ chats: state.chats }), // Only persist "chats"
    }
  )
);
