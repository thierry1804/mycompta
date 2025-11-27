// Hook personnalisé pour gérer les transactions
import { useState, useEffect } from 'react';
import type { Transaction } from '../types';
import { firestoreService } from '../services/firestore';
import { useApp } from '../contexts/AppContext';

export function useTransactions() {
    const { exerciceCourant } = useApp();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Utiliser la souscription en temps réel de Firestore
        setIsLoading(true);
        const unsubscribe = firestoreService.subscribeToTransactions(
            exerciceCourant?.id,
            (transactions) => {
                setTransactions(transactions);
                setIsLoading(false);
            }
        );

        return () => {
            unsubscribe();
        };
    }, [exerciceCourant]);

    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        await firestoreService.addTransaction(newTransaction);
        // La mise à jour se fera automatiquement via la souscription
        return newTransaction;
    };

    const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
        await firestoreService.updateTransaction(id, updates);
        // La mise à jour se fera automatiquement via la souscription
    };

    const deleteTransaction = async (id: string) => {
        await firestoreService.deleteTransaction(id);
        // La mise à jour se fera automatiquement via la souscription
    };

    const stornoTransaction = async (id: string) => {
        await firestoreService.stornoTransaction(id);
        // La mise à jour se fera automatiquement via la souscription
    };

    // Helper: vérifier si une transaction a été annulée par un STORNO
    const estAnnuleeParStorno = (transactionId: string) => {
        return transactions.some(
            (t) => t.estStorno && t.transactionIdOrigine === transactionId
        );
    };

    // Fonction helper exportée pour utilisation dans d'autres composants
    const isTransactionCancelled = (transactionId: string) => estAnnuleeParStorno(transactionId);

    // Calculs - Exclure les transactions STORNO et les transactions annulées par un STORNO
    const getRecettes = () => transactions.filter((t) => 
        t.type === 'recette' && !t.estStorno && !estAnnuleeParStorno(t.id)
    );
    const getDepenses = () => transactions.filter((t) => 
        t.type === 'depense' && !t.estStorno && !estAnnuleeParStorno(t.id)
    );

    const getTotalRecettes = () =>
        getRecettes().reduce((sum, t) => sum + t.montant, 0);

    const getTotalDepenses = () =>
        getDepenses().reduce((sum, t) => sum + t.montant, 0);

    const getSoldeCaisse = () => {
        const recettesCaisse = transactions
            .filter((t) => 
                t.type === 'recette' && 
                t.moyenPaiement === 'especes' && 
                !t.estStorno && 
                !estAnnuleeParStorno(t.id)
            )
            .reduce((sum, t) => sum + t.montant, 0);
        const depensesCaisse = transactions
            .filter((t) => 
                t.type === 'depense' && 
                t.moyenPaiement === 'especes' && 
                !t.estStorno && 
                !estAnnuleeParStorno(t.id)
            )
            .reduce((sum, t) => sum + t.montant, 0);
        return recettesCaisse - depensesCaisse;
    };

    const getSoldeBanque = () => {
        const soldeInitial = exerciceCourant?.soldeOuvertureBanque || 0;
        const recettesBanque = transactions
            .filter((t) => 
                t.type === 'recette' && 
                t.moyenPaiement === 'banque' && 
                !t.estStorno && 
                !estAnnuleeParStorno(t.id)
            )
            .reduce((sum, t) => sum + t.montant, 0);
        const depensesBanque = transactions
            .filter((t) => 
                t.type === 'depense' && 
                t.moyenPaiement === 'banque' && 
                !t.estStorno && 
                !estAnnuleeParStorno(t.id)
            )
            .reduce((sum, t) => sum + t.montant, 0);
        return soldeInitial + recettesBanque - depensesBanque;
    };

    return {
        transactions,
        isLoading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        stornoTransaction,
        getRecettes,
        getDepenses,
        getTotalRecettes,
        getTotalDepenses,
        getSoldeCaisse,
        getSoldeBanque,
        isTransactionCancelled,
        reload: () => {
            // La souscription en temps réel gère automatiquement les mises à jour
            // Cette fonction est conservée pour la compatibilité
        },
    };
}
