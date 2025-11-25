// Hook personnalisé pour gérer les transactions
import { useState, useEffect } from 'react';
import type { Transaction } from '../types';
import { storage } from '../services/storage';
import { useApp } from '../contexts/AppContext';

export function useTransactions() {
    const { exerciceCourant } = useApp();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTransactions();
    }, [exerciceCourant]);

    const loadTransactions = async () => {
        try {
            setIsLoading(true);
            const allTransactions = await storage.get<Transaction[]>('transactions') || [];

            // Filtrer par exercice courant
            const filtered = exerciceCourant
                ? allTransactions.filter((t) => t.exerciceId === exerciceCourant.id)
                : allTransactions;

            setTransactions(filtered);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        const allTransactions = await storage.get<Transaction[]>('transactions') || [];
        const updated = [...allTransactions, newTransaction];
        await storage.set('transactions', updated);
        await loadTransactions();
        return newTransaction;
    };

    const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
        const allTransactions = await storage.get<Transaction[]>('transactions') || [];
        const updated = allTransactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
        );
        await storage.set('transactions', updated);
        await loadTransactions();
    };

    const deleteTransaction = async (id: string) => {
        const allTransactions = await storage.get<Transaction[]>('transactions') || [];
        const updated = allTransactions.filter((t) => t.id !== id);
        await storage.set('transactions', updated);
        await loadTransactions();
    };

    // Calculs
    const getRecettes = () => transactions.filter((t) => t.type === 'recette');
    const getDepenses = () => transactions.filter((t) => t.type === 'depense');

    const getTotalRecettes = () =>
        getRecettes().reduce((sum, t) => sum + t.montant, 0);

    const getTotalDepenses = () =>
        getDepenses().reduce((sum, t) => sum + t.montant, 0);

    const getSoldeCaisse = () => {
        const recettesCaisse = transactions
            .filter((t) => t.type === 'recette' && t.moyenPaiement === 'especes')
            .reduce((sum, t) => sum + t.montant, 0);
        const depensesCaisse = transactions
            .filter((t) => t.type === 'depense' && t.moyenPaiement === 'especes')
            .reduce((sum, t) => sum + t.montant, 0);
        return recettesCaisse - depensesCaisse;
    };

    const getSoldeBanque = () => {
        const soldeInitial = exerciceCourant?.soldeOuvertureBanque || 0;
        const recettesBanque = transactions
            .filter((t) => t.type === 'recette' && t.moyenPaiement === 'banque')
            .reduce((sum, t) => sum + t.montant, 0);
        const depensesBanque = transactions
            .filter((t) => t.type === 'depense' && t.moyenPaiement === 'banque')
            .reduce((sum, t) => sum + t.montant, 0);
        return soldeInitial + recettesBanque - depensesBanque;
    };

    return {
        transactions,
        isLoading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getRecettes,
        getDepenses,
        getTotalRecettes,
        getTotalDepenses,
        getSoldeCaisse,
        getSoldeBanque,
        reload: loadTransactions,
    };
}
