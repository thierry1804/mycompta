// Utilitaire pour exporter les transactions en CSV
import type { Transaction } from '../types';
import { formatDate } from './date';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export async function exportTransactionsToCSV(transactions: Transaction[], filename: string = 'transactions.csv') {
    // En-têtes du CSV
    const headers = [
        'Date',
        'Type',
        'Description',
        'Catégorie',
        'Montant (Ar)',
        'Moyen de paiement',
        'Client/Fournisseur',
        'N° Pièce',
    ];

    // Convertir les transactions en lignes CSV
    const rows = transactions.map((t) => [
        formatDate(t.date),
        t.type === 'recette' ? 'Recette' : 'Dépense',
        `"${t.description.replace(/"/g, '""')}"`, // Échapper les guillemets
        `"${t.categorie.replace(/"/g, '""')}"`,
        t.montant.toString(),
        t.moyenPaiement === 'especes' ? 'Espèces' : 'Banque',
        t.fournisseurBeneficiaire ? `"${t.fournisseurBeneficiaire.replace(/"/g, '""')}"` : '',
        t.numeroPiece || '',
    ]);

    // Créer le contenu CSV
    const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.join(',')),
    ].join('\n');

    // Détecter si on est sur mobile (Capacitor)
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
        // Sur mobile : utiliser Capacitor Share
        try {
            // Écrire le fichier temporairement
            const base64Content = btoa('\uFEFF' + csvContent);
            await Filesystem.writeFile({
                path: filename,
                data: base64Content,
                directory: Directory.Cache,
                encoding: Encoding.UTF8,
            });

            // Obtenir l'URI du fichier
            const fileUri = await Filesystem.getUri({
                path: filename,
                directory: Directory.Cache,
            });

            // Partager le fichier
            await Share.share({
                title: 'Exporter les transactions',
                text: 'Fichier CSV des transactions',
                url: fileUri.uri,
                dialogTitle: 'Partager le fichier CSV',
            });
        } catch (error) {
            console.error('Erreur lors de l\'export mobile:', error);
            // Fallback : partager le contenu directement
            await Share.share({
                title: 'Transactions CSV',
                text: csvContent,
            });
        }
    } else {
        // Sur web : utiliser le téléchargement blob classique
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Exporter le bilan en CSV
export async function exportBilanToCSV(bilan: any, filename: string = 'bilan.csv') {
    const rows = [
        ['BILAN SIMPLIFIÉ'],
        [''],
        ['ACTIF', 'Montant (Ar)'],
        ['Immobilisations', bilan.actif.immobilisations],
        ['Stocks', bilan.actif.stocks],
        ['Créances', bilan.actif.creances],
        ['Trésorerie', bilan.actif.tresorerie],
        ['TOTAL ACTIF', bilan.actif.total],
        [''],
        ['PASSIF', 'Montant (Ar)'],
        ['Capitaux propres', bilan.passif.capitaux],
        ['Dettes', bilan.passif.dettes],
        ['TOTAL PASSIF', bilan.passif.total],
    ];

    const csvContent = rows.map((row) => row.join(',')).join('\n');
    
    // Détecter si on est sur mobile (Capacitor)
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
        // Sur mobile : utiliser Capacitor Share
        try {
            const base64Content = btoa('\uFEFF' + csvContent);
            await Filesystem.writeFile({
                path: filename,
                data: base64Content,
                directory: Directory.Cache,
                encoding: Encoding.UTF8,
            });

            const fileUri = await Filesystem.getUri({
                path: filename,
                directory: Directory.Cache,
            });

            await Share.share({
                title: 'Exporter le bilan',
                text: 'Fichier CSV du bilan',
                url: fileUri.uri,
                dialogTitle: 'Partager le fichier CSV',
            });
        } catch (error) {
            console.error('Erreur lors de l\'export mobile:', error);
            await Share.share({
                title: 'Bilan CSV',
                text: csvContent,
            });
        }
    } else {
        // Sur web : utiliser le téléchargement blob classique
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Exporter le compte de résultat en CSV
export async function exportCompteResultatToCSV(compteResultat: any, filename: string = 'compte_resultat.csv') {
    const rows = [
        ['COMPTE DE RÉSULTAT SIMPLIFIÉ'],
        [''],
        ['PRODUITS', 'Montant (Ar)'],
        ['Ventes de produits et services', compteResultat.produits.ventesProduitsServices],
        ['Autres produits', compteResultat.produits.autresProduits],
        ['TOTAL PRODUITS', compteResultat.produits.total],
        [''],
        ['CHARGES', 'Montant (Ar)'],
        ['Achats', compteResultat.charges.achats],
        ['Charges de personnel', compteResultat.charges.chargesPersonnel],
        ['Autres charges', compteResultat.charges.autresCharges],
        ['Amortissements', compteResultat.charges.amortissements],
        ['TOTAL CHARGES', compteResultat.charges.total],
        [''],
        ['RÉSULTAT', compteResultat.resultat >= 0 ? 'BÉNÉFICE' : 'PERTE', Math.abs(compteResultat.resultat)],
    ];

    const csvContent = rows.map((row) => row.join(',')).join('\n');
    
    // Détecter si on est sur mobile (Capacitor)
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
        // Sur mobile : utiliser Capacitor Share
        try {
            const base64Content = btoa('\uFEFF' + csvContent);
            await Filesystem.writeFile({
                path: filename,
                data: base64Content,
                directory: Directory.Cache,
                encoding: Encoding.UTF8,
            });

            const fileUri = await Filesystem.getUri({
                path: filename,
                directory: Directory.Cache,
            });

            await Share.share({
                title: 'Exporter le compte de résultat',
                text: 'Fichier CSV du compte de résultat',
                url: fileUri.uri,
                dialogTitle: 'Partager le fichier CSV',
            });
        } catch (error) {
            console.error('Erreur lors de l\'export mobile:', error);
            await Share.share({
                title: 'Compte de résultat CSV',
                text: csvContent,
            });
        }
    } else {
        // Sur web : utiliser le téléchargement blob classique
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
