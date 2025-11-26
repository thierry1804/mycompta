// Contexte pour la gestion de l'application
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { EntrepriseInfo, Exercice } from '../types';
import { firestoreService } from '../services/firestore';

interface AppContextType {
    entrepriseInfo: EntrepriseInfo | null;
    setEntrepriseInfo: (info: EntrepriseInfo) => Promise<void>;
    exercices: Exercice[];
    setExercices: (exercices: Exercice[]) => Promise<void>;
    addExercice: (exercice: Exercice) => Promise<void>;
    updateExercice: (exercice: Exercice) => Promise<void>;
    deleteExercice: (exerciceId: string) => Promise<void>;
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
        // Charger les données au démarrage depuis Firestore
        const loadData = async () => {
            try {
                const [info, exs, settings] = await Promise.all([
                    firestoreService.getEntrepriseInfo(),
                    firestoreService.getExercices(),
                    firestoreService.getSettings(),
                ]);

                if (info) setEntrepriseInfoState(info);
                if (exs && exs.length > 0) {
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
        await firestoreService.setEntrepriseInfo(info);
        setEntrepriseInfoState(info);
    };

    const setExercices = async (exs: Exercice[]) => {
        // Sauvegarder chaque exercice individuellement dans Firestore
        // Mettre à jour les exercices existants et ajouter les nouveaux
        await Promise.all(exs.map(ex => firestoreService.addExercice(ex)));
        setExercicesState(exs);
    };

    const addExercice = async (exercice: Exercice) => {
        await firestoreService.addExercice(exercice);
        const updated = [...exercices, exercice];
        setExercicesState(updated);
    };

    const updateExercice = async (exercice: Exercice) => {
        await firestoreService.updateExercice(exercice);
        const updated = exercices.map(ex => ex.id === exercice.id ? exercice : ex);
        setExercicesState(updated);
    };

    const deleteExercice = async (exerciceId: string) => {
        await firestoreService.deleteExercice(exerciceId);
        const updated = exercices.filter(ex => ex.id !== exerciceId);
        setExercicesState(updated);
        // Si l'exercice supprimé était l'exercice courant, sélectionner le premier disponible
        if (exerciceCourant?.id === exerciceId) {
            const newCurrent = updated[0] || null;
            if (newCurrent) {
                await setExerciceCourant(newCurrent);
            } else {
                setExerciceCourantState(null);
            }
        }
    };

    const setExerciceCourant = async (exercice: Exercice) => {
        const settings = await firestoreService.getSettings() || {
            theme: 'light',
            exerciceCourantId: exercice.id,
            firstLaunch: false,
        };
        settings.exerciceCourantId = exercice.id;
        await firestoreService.setSettings(settings);
        setExerciceCourantState(exercice);
    };

    const setFirstLaunch = async (value: boolean) => {
        const settings = await firestoreService.getSettings() || {
            theme: 'light',
            exerciceCourantId: exerciceCourant?.id || '',
            firstLaunch: value,
        };
        settings.firstLaunch = value;
        await firestoreService.setSettings(settings);
        setFirstLaunchState(value);
    };

    return (
        <AppContext.Provider
            value={{
                entrepriseInfo,
                setEntrepriseInfo,
                exercices,
                setExercices,
                addExercice,
                updateExercice,
                deleteExercice,
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
