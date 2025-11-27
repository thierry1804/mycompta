// Utilitaire pour exporter les transactions en CSV
import type { Transaction } from '../types';
import { formatDate } from './date';

export function exportTransactionsToCSV(transactions: Transaction[], filename: string = 'transactions.csv') {
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

    // Créer un blob et télécharger
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

// Exporter le bilan en CSV
export function exportBilanToCSV(bilan: any, filename: string = 'bilan.csv') {
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

// Exporter le compte de résultat en CSV
export function exportCompteResultatToCSV(compteResultat: any, filename: string = 'compte_resultat.csv') {
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
