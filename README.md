# Compta MPE - Application de Comptabilité pour Micro et Petites Entreprises

Application web de comptabilité simplifiée pour les micro et petites entreprises (MPE) à Madagascar, conforme au Plan Comptable Général (PCG) 2005.

## 🎯 Fonctionnalités

### ✅ Modules Implémentés

- **📊 Gestion des Transactions**
  - Ajout de recettes et dépenses
  - Liste avec filtres, recherche et tri
  - Modification et suppression
  - Calculs automatiques des soldes

- **💰 Trésorerie (SMT)**
  - Livre de Caisse
  - Livre de Banque
  - Graphiques d'évolution
  - Statistiques en temps réel

- **📈 Tableau de Bord**
  - KPIs (Soldes Caisse/Banque, Recettes/Dépenses)
  - Graphiques interactifs (Recharts)
  - Top 5 des dépenses

- **📋 États Financiers PCG 2005**
  - Bilan Simplifié
  - Compte de Résultat Simplifié
  - Conformité PCG 2005 Madagascar

- **⚙️ Paramètres**
  - Gestion des informations entreprise
  - Création/activation/clôture d'exercices
  - Configuration des catégories

- **❓ Aide & Documentation**
  - FAQ (8 questions)
  - Glossaire comptable (15 termes)
  - Guide d'utilisation détaillé

- **📥 Exports**
  - Export CSV des transactions
  - Export CSV du bilan
  - Export CSV du compte de résultat

## 🚀 Installation

### Prérequis

- Node.js 18+ et npm
- Navigateur moderne (Chrome, Firefox, Edge, Safari)

### Installation des dépendances

```bash
npm install
```

### Lancement en mode développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build de production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`

## 📁 Structure du Projet

```
compta/
├── src/
│   ├── components/        # Composants React réutilisables
│   │   ├── ui/           # Composants UI de base
│   │   ├── transactions/ # Composants spécifiques aux transactions
│   │   └── Layout.tsx    # Layout principal avec navigation
│   ├── contexts/         # Contextes React (App, Theme)
│   ├── hooks/            # Hooks personnalisés
│   ├── pages/            # Pages de l'application
│   ├── services/         # Services (Storage)
│   ├── types/            # Types TypeScript
│   └── utils/            # Utilitaires (currency, date, export)
├── public/               # Fichiers statiques
└── package.json
```

## 🎨 Technologies Utilisées

- **React 18** avec Hooks
- **TypeScript** pour la sécurité des types
- **Vite** pour le build rapide
- **Tailwind CSS** pour le styling
- **Lucide React** pour les icônes
- **Recharts** pour les graphiques
- **React Router** pour la navigation
- **date-fns** pour la manipulation des dates

## 📖 Guide d'Utilisation

### Premier Lancement

1. Remplissez les informations de votre entreprise (nom, forme juridique, NIF, STAT, etc.)
2. Définissez le capital initial
3. Un premier exercice comptable sera créé automatiquement

### Gestion des Transactions

1. Allez dans **Transactions**
2. Cliquez sur **Recette** (vert) ou **Dépense** (rouge)
3. Remplissez le formulaire :
   - Date de la transaction
   - Montant en Ariary (Ar)
   - Description
   - Catégorie (conforme PCG 2005)
   - Moyen de paiement (Espèces ou Banque)
4. Cliquez sur **Enregistrer**

### Consultation de la Trésorerie

1. Allez dans **Trésorerie**
2. Consultez le **Livre de Caisse** pour les mouvements en espèces
3. Consultez le **Livre de Banque** pour les mouvements bancaires
4. Visualisez l'évolution avec les graphiques

### États Financiers

1. Allez dans **États Financiers**
2. Consultez le **Bilan Simplifié** (Actif/Passif)
3. Consultez le **Compte de Résultat** (Produits/Charges)
4. Exportez en CSV si nécessaire

### Gestion des Exercices

1. Allez dans **Paramètres** > **Exercices**
2. Créez un nouvel exercice pour l'année suivante
3. Activez l'exercice sur lequel vous souhaitez travailler
4. Clôturez un exercice (⚠️ action irréversible)

## 💾 Stockage des Données

Les données sont sauvegardées automatiquement dans le **localStorage** du navigateur. Elles persistent même après fermeture du navigateur.

⚠️ **Important** : Pensez à exporter régulièrement vos données en CSV pour sauvegarder vos informations.

## 📊 Conformité PCG 2005

Cette application respecte les normes du Plan Comptable Général 2005 de Madagascar pour les micro et petites entreprises :

- Catégories de recettes et dépenses conformes
- Bilan simplifié (Actif/Passif)
- Compte de résultat simplifié (Produits/Charges)
- Système Minimal de Trésorerie (SMT)

## 🌙 Mode Sombre

L'application supporte le mode sombre. Basculez entre les modes clair et sombre via le bouton en bas de la sidebar.

## 📱 Responsive Design

L'application est entièrement responsive et fonctionne sur :
- 💻 Desktop
- 📱 Tablettes
- 📱 Smartphones

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview

# Linting
npm run lint
```

## 🤝 Contribution

Ce projet est destiné aux micro et petites entreprises à Madagascar. Les contributions sont les bienvenues !

## 📄 Licence

MIT License - Libre d'utilisation pour les MPE à Madagascar

## 🆘 Support

Pour toute question ou assistance :
- Consultez la page **Aide** dans l'application
- Référez-vous au **Glossaire** pour les termes comptables
- Suivez le **Guide d'utilisation** étape par étape

## 🎓 Ressources

- [Plan Comptable Général 2005 Madagascar](https://www.finances.gov.mg/)
- [Documentation React](https://react.dev/)
- [Documentation Tailwind CSS](https://tailwindcss.com/)

---

**Développé pour les Micro et Petites Entreprises de Madagascar** 🇲🇬
