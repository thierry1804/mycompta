// Utilitaires pour le formatage des montants en Ariary

export function formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-MG', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(montant) + ' Ar';
}

export function formatMontantSimple(montant: number): string {
    return new Intl.NumberFormat('fr-MG', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(montant);
}

export function parseMontant(montantStr: string): number {
    // Enlever les espaces et "Ar"
    const cleaned = montantStr.replace(/\s/g, '').replace('Ar', '').replace(',', '.');
    return parseFloat(cleaned) || 0;
}
