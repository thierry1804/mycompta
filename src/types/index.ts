// Types pour l'application de comptabilité

export interface Transaction {
    id: string;
    date: string; // ISO format
    type: 'recette' | 'depense';
    description: string;
    montant: number;
    categorie: string;
    moyenPaiement: 'especes' | 'banque';
    fournisseurBeneficiaire?: string;
    numeroPiece?: string;
    exerciceId: string;
}

export interface EntrepriseInfo {
    nom: string;
    formeJuridique: string;
    nif: string;
    stat: string;
    adresse: string;
    telephone: string;
    email: string;
    dateDebutExercice: string;
    capitalInitial: number;
    devise: 'Ar';
}

export interface Exercice {
    id: string;
    annee: number;
    dateDebut: string;
    dateFin: string;
    cloture: boolean;
    soldeOuvertureCaisse: number;
    soldeOuvertureBanque: number;
}

export interface Immobilisation {
    id: string;
    description: string;
    dateAcquisition: string;
    valeurAcquisition: number;
    dureeAmortissement: number; // en années
    tauxAmortissement: number;
    exerciceId: string;
}

export interface Stock {
    id: string;
    exerciceId: string;
    dateInventaire: string;
    description: string;
    quantite: number;
    valeurUnitaire: number;
    valeurTotale: number;
}

export interface Client {
    id: string;
    nom: string;
    adresse?: string;
    telephone?: string;
    email?: string;
}

export interface Fournisseur {
    id: string;
    nom: string;
    adresse?: string;
    telephone?: string;
    email?: string;
}

export interface Creance {
    id: string;
    clientId: string;
    montant: number;
    dateEcheance: string;
    statut: 'en_attente' | 'payee' | 'en_retard';
    exerciceId: string;
}

export interface Dette {
    id: string;
    fournisseurId: string;
    montant: number;
    dateEcheance: string;
    statut: 'en_attente' | 'payee' | 'en_retard';
    exerciceId: string;
}

// Catégories par défaut conformes au PCG 2005
export interface CategorieRecette {
    id: string;
    nom: string;
    code?: string;
    personnalisee: boolean;
}

export interface CategorieDepense {
    id: string;
    nom: string;
    code?: string;
    personnalisee: boolean;
}

// États financiers
export interface BilanSimplified {
    exerciceId: string;
    dateEtablissement: string;
    actif: {
        immobilisations: number;
        stocks: number;
        creances: number;
        tresorerie: number;
        total: number;
    };
    passif: {
        capitaux: number;
        dettes: number;
        total: number;
    };
}

export interface CompteResultat {
    exerciceId: string;
    dateEtablissement: string;
    produits: {
        ventesProduitsServices: number;
        autresProduits: number;
        total: number;
    };
    charges: {
        achats: number;
        chargesPersonnel: number;
        autresCharges: number;
        amortissements: number;
        total: number;
    };
    resultat: number;
}

// Theme
export type Theme = 'light' | 'dark';

// App Settings
export interface AppSettings {
    theme: Theme;
    exerciceCourantId: string;
    firstLaunch: boolean;
}
