// Contexte pour la gestion de l'application
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { EntrepriseInfo, Exercice, AppSettings } from '../types';
import { storage } from '../services/storage';

interface AppContextType {
    entrepriseInfo: EntrepriseInfo | null;
    setEntrepriseInfo: (info: EntrepriseInfo) => Promise<void>;
    exercices: Exercice[];
    setExercices: (exercices: Exercice[]) => Promise<void>;
    exerciceCourant: Exercice | null;
    setExerciceCourant: (exercice: Exercice) => Promise<void>;
    firstLaunch: boolean;
    setFirstLaunch: (value: boolean) => Promise<void>;
    isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [entrepriseInfo, setEntrepriseInfoState] = useState<EntrepriseInfo | null>(null);
    const [exercices, setExercicesState] = useState<Exercice[]>([]);
    const [exerciceCourant, setExerciceCourantState] = useState<Exercice | null>(null);
    const [firstLaunch, setFirstLaunchState] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Charger les données au démarrage
        const loadData = async () => {
            try {
                const [info, exs, settings] = await Promise.all([
                    storage.get<EntrepriseInfo>('entreprise-info'),
                    storage.get<Exercice[]>('exercices'),
                    storage.get<AppSettings>('app-settings'),
                ]);

                if (info) setEntrepriseInfoState(info);
                if (exs) {
                    setExercicesState(exs);
                    // Trouver l'exercice courant
                    const currentId = settings?.exerciceCourantId;
                    const current = exs.find((ex) => ex.id === currentId) || exs[0];
                    if (current) setExerciceCourantState(current);
                }
                if (settings !== null) {
                    setFirstLaunchState(settings.firstLaunch ?? true);
                }
            } catch (error) {
                console.error('Error loading app data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const setEntrepriseInfo = async (info: EntrepriseInfo) => {
        await storage.set('entreprise-info', info);
        setEntrepriseInfoState(info);
    };

    const setExercices = async (exs: Exercice[]) => {
        await storage.set('exercices', exs);
        setExercicesState(exs);
    };

    const setExerciceCourant = async (exercice: Exercice) => {
        const settings = await storage.get<AppSettings>('app-settings') || {
            theme: 'light',
            exerciceCourantId: exercice.id,
            firstLaunch: false,
        };
        settings.exerciceCourantId = exercice.id;
        await storage.set('app-settings', settings);
        setExerciceCourantState(exercice);
    };

    const setFirstLaunch = async (value: boolean) => {
        const settings = await storage.get<AppSettings>('app-settings') || {
            theme: 'light',
            exerciceCourantId: exerciceCourant?.id || '',
            firstLaunch: value,
        };
        settings.firstLaunch = value;
        await storage.set('app-settings', settings);
        setFirstLaunchState(value);
    };

    return (
        <AppContext.Provider
            value={{
                entrepriseInfo,
                setEntrepriseInfo,
                exercices,
                setExercices,
                exerciceCourant,
                setExerciceCourant,
                firstLaunch,
                setFirstLaunch,
                isLoading,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
