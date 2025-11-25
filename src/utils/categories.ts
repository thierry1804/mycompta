// Catégories par défaut conformes au PCG 2005 Madagascar

import type { CategorieRecette, CategorieDepense } from '../types';

export const CATEGORIES_RECETTES_DEFAULT: CategorieRecette[] = [
    {
        id: 'rec-1',
        nom: 'Ventes de produits/marchandises',
        code: '70',
        personnalisee: false,
    },
    {
        id: 'rec-2',
        nom: 'Prestations de services',
        code: '706',
        personnalisee: false,
    },
    {
        id: 'rec-3',
        nom: 'Subventions d\'exploitation',
        code: '74',
        personnalisee: false,
    },
    {
        id: 'rec-4',
        nom: 'Autres produits d\'exploitation',
        code: '75',
        personnalisee: false,
    },
    {
        id: 'rec-5',
        nom: 'Produits financiers',
        code: '76',
        personnalisee: false,
    },
    {
        id: 'rec-6',
        nom: 'Autres recettes',
        code: '78',
        personnalisee: false,
    },
];

export const CATEGORIES_DEPENSES_DEFAULT: CategorieDepense[] = [
    {
        id: 'dep-1',
        nom: 'Achats de marchandises',
        code: '60',
        personnalisee: false,
    },
    {
        id: 'dep-2',
        nom: 'Matières premières et fournitures',
        code: '601',
        personnalisee: false,
    },
    {
        id: 'dep-3',
        nom: 'Fournitures de bureau',
        code: '6064',
        personnalisee: false,
    },
    {
        id: 'dep-4',
        nom: 'Loyer',
        code: '613',
        personnalisee: false,
    },
    {
        id: 'dep-5',
        nom: 'Électricité et eau',
        code: '6061',
        personnalisee: false,
    },
    {
        id: 'dep-6',
        nom: 'Téléphone et internet',
        code: '626',
        personnalisee: false,
    },
    {
        id: 'dep-7',
        nom: 'Salaires et traitements',
        code: '661',
        personnalisee: false,
    },
    {
        id: 'dep-8',
        nom: 'Charges sociales',
        code: '664',
        personnalisee: false,
    },
    {
        id: 'dep-9',
        nom: 'Impôts et taxes',
        code: '63',
        personnalisee: false,
    },
    {
        id: 'dep-10',
        nom: 'Transport et déplacement',
        code: '624',
        personnalisee: false,
    },
    {
        id: 'dep-11',
        nom: 'Entretien et réparations',
        code: '615',
        personnalisee: false,
    },
    {
        id: 'dep-12',
        nom: 'Assurances',
        code: '616',
        personnalisee: false,
    },
    {
        id: 'dep-13',
        nom: 'Publicité et marketing',
        code: '623',
        personnalisee: false,
    },
    {
        id: 'dep-14',
        nom: 'Frais bancaires',
        code: '627',
        personnalisee: false,
    },
    {
        id: 'dep-15',
        nom: 'Autres charges d\'exploitation',
        code: '65',
        personnalisee: false,
    },
];
