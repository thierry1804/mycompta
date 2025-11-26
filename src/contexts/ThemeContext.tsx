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
    // Initialiser avec la préférence système ou 'light' par défaut
    const getInitialTheme = (): Theme => {
        // Vérifier d'abord le localStorage de manière synchrone
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme === 'dark' || savedTheme === 'light') {
            return savedTheme;
        }
        // Sinon, détecter la préférence système
        if (typeof window !== 'undefined') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light';
        }
        return 'light';
    };

    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        // Appliquer le thème immédiatement au chargement
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Charger le thème depuis le stockage asynchrone (pour la persistance)
        const loadTheme = async () => {
            const savedTheme = await storage.get<Theme>('theme');
            if (savedTheme && savedTheme !== theme) {
                setTheme(savedTheme);
            }
        };
        loadTheme();
    }, []);

    useEffect(() => {
        // Appliquer le thème au document à chaque changement
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Sauvegarder le thème
        storage.set('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

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
