"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { siteConfig } from "@/config/weddingConfig";

interface ThemeContextType {
    mode: "light" | "dark";
    toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    // Initialize state with the default mode from config
    const [mode, setMode] = useState<"light" | "dark">(siteConfig.theme.mode);

    useEffect(() => {
        const root = document.documentElement;

        // Inject brand colors into CSS variables
        root.style.setProperty("--primary", siteConfig.theme.primaryColor);
        root.style.setProperty("--secondary", siteConfig.theme.secondaryColor);

        // Handle Light/Dark Mode for Tailwind
        if (mode === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [mode]);

    const toggleMode = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ mode, toggleMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Custom hook to easily grab the theme toggle anywhere in the app
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}