// Contexte pour le thème (Dark/Light mode)
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Theme } from '../types';
import { storage } from '../services/storage';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Charger le thème depuis le stockage
        const loadTheme = async () => {
            const savedTheme = await storage.get<Theme>('theme');
            if (savedTheme) {
                setTheme(savedTheme);
            } else {
                // Détecter la préférence système
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setTheme(prefersDark ? 'dark' : 'light');
            }
            setMounted(true);
        };
        loadTheme();
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Appliquer le thème au document
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Sauvegarder le thème
        storage.set('theme', theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
