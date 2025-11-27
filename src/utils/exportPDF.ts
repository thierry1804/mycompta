// Utilitaires pour exporter en PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Transaction } from '../types';
import { formatMontant } from './currency';
import { formatDate } from './date';

export function exportTransactionsToPDF(transactions: Transaction[], entreprise: string, exercice: string) {
    const doc = new jsPDF();

    // Helper: vérifier si une transaction a été annulée par un STORNO
    const estAnnuleeParStorno = (transactionId: string) => {
        return transactions.some(
            (t) => t.estStorno && t.transactionIdOrigine === transactionId
        );
    };

    // En-tête
    doc.setFontSize(18);
    doc.text(entreprise, 14, 20);
    doc.setFontSize(12);
    doc.text(`Liste des Transactions - Exercice ${exercice}`, 14, 28);
    doc.setFontSize(10);
    doc.text(`Généré le ${formatDate(new Date().toISOString().split('T')[0])}`, 14, 34);

    // Tableau des transactions
    const tableData = transactions.map((t) => [
        formatDate(t.date),
        t.type === 'recette' ? 'Recette' : 'Dépense',
        t.description,
        t.categorie,
        t.moyenPaiement === 'especes' ? 'Espèces' : 'Banque',
        formatMontant(t.montant),
    ]);

    autoTable(doc, {
        startY: 40,
        head: [['Date', 'Type', 'Description', 'Catégorie', 'Paiement', 'Montant']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 9 },
    });

    // Totaux (exclure les STORNO et les transactions annulées)
    const totalRecettes = transactions
        .filter((t) => t.type === 'recette' && !t.estStorno && !estAnnuleeParStorno(t.id))
        .reduce((sum, t) => sum + t.montant, 0);
    const totalDepenses = transactions
        .filter((t) => t.type === 'depense' && !t.estStorno && !estAnnuleeParStorno(t.id))
        .reduce((sum, t) => sum + t.montant, 0);

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.text(`Total Recettes: ${formatMontant(totalRecettes)}`, 14, finalY);
    doc.text(`Total Dépenses: ${formatMontant(totalDepenses)}`, 14, finalY + 7);
    doc.setFont('helvetica', 'bold');
    doc.text(`Solde: ${formatMontant(totalRecettes - totalDepenses)}`, 14, finalY + 14);

    // Pied de page
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Conforme au PCG 2005 - Madagascar', 14, doc.internal.pageSize.height - 10);

    doc.save(`transactions_${exercice}.pdf`);
}

export function exportBilanToPDF(bilan: any, entreprise: string, exercice: string) {
    const doc = new jsPDF();

    // En-tête
    doc.setFontSize(18);
    doc.text(entreprise, 14, 20);
    doc.setFontSize(14);
    doc.text(`BILAN SIMPLIFIÉ`, 14, 28);
    doc.setFontSize(10);
    doc.text(`Exercice ${exercice}`, 14, 34);
    doc.text(`Établi le ${formatDate(new Date().toISOString().split('T')[0])}`, 14, 40);

    // ACTIF
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ACTIF', 14, 52);

    autoTable(doc, {
        startY: 56,
        head: [['Poste', 'Montant (Ar)']],
        body: [
            ['Immobilisations', formatMontant(bilan.actif.immobilisations)],
            ['Stocks', formatMontant(bilan.actif.stocks)],
            ['Créances', formatMontant(bilan.actif.creances)],
            ['Trésorerie', formatMontant(bilan.actif.tresorerie)],
            ['TOTAL ACTIF', formatMontant(bilan.actif.total)],
        ],
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 10 },
        columnStyles: { 1: { halign: 'right' } },
    });

    // PASSIF
    const passifY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PASSIF', 14, passifY);

    autoTable(doc, {
        startY: passifY + 4,
        head: [['Poste', 'Montant (Ar)']],
        body: [
            ['Capitaux propres', formatMontant(bilan.passif.capitaux)],
            ['Dettes', formatMontant(bilan.passif.dettes)],
            ['TOTAL PASSIF', formatMontant(bilan.passif.total)],
        ],
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 10 },
        columnStyles: { 1: { halign: 'right' } },
    });

    // Pied de page
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Conforme au Plan Comptable Général (PCG) 2005 - Madagascar', 14, doc.internal.pageSize.height - 10);

    doc.save(`bilan_${exercice}.pdf`);
}

export function exportCompteResultatToPDF(compteResultat: any, entreprise: string, exercice: string) {
    const doc = new jsPDF();

    // En-tête
    doc.setFontSize(18);
    doc.text(entreprise, 14, 20);
    doc.setFontSize(14);
    doc.text(`COMPTE DE RÉSULTAT SIMPLIFIÉ`, 14, 28);
    doc.setFontSize(10);
    doc.text(`Exercice ${exercice}`, 14, 34);
    doc.text(`Établi le ${formatDate(new Date().toISOString().split('T')[0])}`, 14, 40);

    // PRODUITS
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129); // Green
    doc.text('PRODUITS', 14, 52);
    doc.setTextColor(0, 0, 0);

    autoTable(doc, {
        startY: 56,
        head: [['Poste', 'Montant (Ar)']],
        body: [
            ['Ventes de produits et services', formatMontant(compteResultat.produits.ventesProduitsServices)],
            ['Autres produits', formatMontant(compteResultat.produits.autresProduits)],
            ['TOTAL PRODUITS', formatMontant(compteResultat.produits.total)],
        ],
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 10 },
        columnStyles: { 1: { halign: 'right' } },
    });

    // CHARGES
    const chargesY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(239, 68, 68); // Red
    doc.text('CHARGES', 14, chargesY);
    doc.setTextColor(0, 0, 0);

    autoTable(doc, {
        startY: chargesY + 4,
        head: [['Poste', 'Montant (Ar)']],
        body: [
            ['Achats', formatMontant(compteResultat.charges.achats)],
            ['Charges de personnel', formatMontant(compteResultat.charges.chargesPersonnel)],
            ['Autres charges', formatMontant(compteResultat.charges.autresCharges)],
            ['Amortissements', formatMontant(compteResultat.charges.amortissements)],
            ['TOTAL CHARGES', formatMontant(compteResultat.charges.total)],
        ],
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68] },
        styles: { fontSize: 10 },
        columnStyles: { 1: { halign: 'right' } },
    });

    // RÉSULTAT
    const resultatY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const resultatText = compteResultat.resultat >= 0 ? 'BÉNÉFICE' : 'PERTE';
    const resultatColor = compteResultat.resultat >= 0 ? [16, 185, 129] : [239, 68, 68];
    doc.setTextColor(resultatColor[0], resultatColor[1], resultatColor[2]);
    doc.text(`${resultatText}: ${formatMontant(Math.abs(compteResultat.resultat))}`, 14, resultatY);

    // Pied de page
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('Conforme au Plan Comptable Général (PCG) 2005 - Madagascar', 14, doc.internal.pageSize.height - 10);

    doc.save(`compte_resultat_${exercice}.pdf`);
}
