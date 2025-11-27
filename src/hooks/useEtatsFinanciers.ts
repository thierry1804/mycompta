// Hook pour calculer les états financiers conformes au PCG 2005
import { useMemo } from 'react';
import { useTransactions } from './useTransactions';
import { useApp } from '../contexts/AppContext';
import type { BilanSimplified, CompteResultat } from '../types';

export function useEtatsFinanciers() {
    const { transactions, isTransactionCancelled } = useTransactions();
    const { exerciceCourant, entrepriseInfo } = useApp();

    // Calcul du Bilan Simplifié (Situation de Fin d'Exercice)
    const bilan = useMemo((): BilanSimplified => {
        const recettes = transactions
            .filter((t) => t.type === 'recette' && !t.estStorno && !isTransactionCancelled(t.id))
            .reduce((sum, t) => sum + t.montant, 0);

        const depenses = transactions
            .filter((t) => t.type === 'depense' && !t.estStorno && !isTransactionCancelled(t.id))
            .reduce((sum, t) => sum + t.montant, 0);

        const resultat = recettes - depenses;
        const capitalInitial = entrepriseInfo?.capitalInitial || 0;

        // Actif
        const tresorerie = recettes - depenses + capitalInitial;
        const totalActif = tresorerie;

        // Passif
        const capitaux = capitalInitial + (resultat > 0 ? resultat : 0);
        const dettes = resultat < 0 ? Math.abs(resultat) : 0;
        const totalPassif = capitaux + dettes;

        return {
            exerciceId: exerciceCourant?.id || '',
            dateEtablissement: new Date().toISOString().split('T')[0],
            actif: {
                immobilisations: 0,
                stocks: 0,
                creances: 0,
                tresorerie,
                total: totalActif,
            },
            passif: {
                capitaux,
                dettes,
                total: totalPassif,
            },
        };
    }, [transactions, exerciceCourant, entrepriseInfo, isTransactionCancelled]);

    // Calcul du Compte de Résultat Simplifié
    const compteResultat = useMemo((): CompteResultat => {
        const recettes = transactions
            .filter((t) => t.type === 'recette' && !t.estStorno && !isTransactionCancelled(t.id))
            .reduce((sum, t) => sum + t.montant, 0);

        const depenses = transactions
            .filter((t) => t.type === 'depense' && !t.estStorno && !isTransactionCancelled(t.id))
            .reduce((sum, t) => sum + t.montant, 0);

        // Détail des dépenses par catégorie (simplification)
        const achats = transactions
            .filter((t) => t.type === 'depense' && !t.estStorno && !isTransactionCancelled(t.id) && t.categorie.toLowerCase().includes('achat'))
            .reduce((sum, t) => sum + t.montant, 0);

        const chargesPersonnel = transactions
            .filter((t) => t.type === 'depense' && !t.estStorno && !isTransactionCancelled(t.id) && (
                t.categorie.toLowerCase().includes('salaire') ||
                t.categorie.toLowerCase().includes('personnel')
            ))
            .reduce((sum, t) => sum + t.montant, 0);

        const autresCharges = depenses - achats - chargesPersonnel;

        const resultat = recettes - depenses;

        return {
            exerciceId: exerciceCourant?.id || '',
            dateEtablissement: new Date().toISOString().split('T')[0],
            produits: {
                ventesProduitsServices: recettes,
                autresProduits: 0,
                total: recettes,
            },
            charges: {
                achats,
                chargesPersonnel,
                autresCharges,
                amortissements: 0,
                total: depenses,
            },
            resultat,
        };
    }, [transactions, exerciceCourant, isTransactionCancelled]);

    return {
        bilan,
        compteResultat,
    };
}
