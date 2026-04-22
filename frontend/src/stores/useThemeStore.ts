import type { ThemeState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware"; // lưu state trên local storage 


export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            isDark: false, // mặc định nền sáng

            toggleTheme: () => {
                const newValue = !get().isDark;  // đổi màu nền

                set({ isDark: newValue })

                if (newValue) {
                    document.documentElement.classList.add("dark")
                } else {
                    document.documentElement.classList.remove("dark")
                }
            },
            setTheme: (dark: boolean) => {
                set({ isDark: dark });
                if (dark) {
                    document.documentElement.classList.add("dark")
                } else {
                    document.documentElement.classList.remove("dark")
                }
            }
        }),
        {
            name: "theme-storage"
        }
    )
)