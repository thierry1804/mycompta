# Configuration Firebase pour Compta MPE

Ce guide vous explique comment configurer Firebase Firestore pour l'application Compta MPE.

## 1. Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet" ou "Add project"
3. Suivez les étapes pour créer votre projet
4. Activez Google Analytics si vous le souhaitez (optionnel)

## 2. Créer une base de données Firestore

1. Dans votre projet Firebase, allez dans "Firestore Database"
2. Cliquez sur "Créer une base de données" ou "Create database"
3. Choisissez le mode de démarrage :
   - **Mode production** : Recommandé pour la production
   - **Mode test** : Pour le développement (règles de sécurité plus permissives)
4. Choisissez l'emplacement de votre base de données (ex: `europe-west`)

## 3. Configurer les règles de sécurité Firestore ⚠️ IMPORTANT

**Cette étape est CRITIQUE** - Sans ces règles, vous obtiendrez l'erreur "Missing or insufficient permissions".

### Étapes pour configurer les règles :

1. Dans Firebase Console, allez dans **Firestore Database**
2. Cliquez sur l'onglet **"Rules"** (Règles) en haut
3. Remplacez le contenu par les règles suivantes :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre la lecture et l'écriture pour tous (DÉVELOPPEMENT UNIQUEMENT)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Cliquez sur **"Publish"** (Publier) pour sauvegarder les règles

**⚠️ ATTENTION** : Ces règles permettent l'accès complet à tous les utilisateurs. 
- ✅ **Pour le développement** : C'est acceptable
- ❌ **Pour la production** : Vous DEVEZ implémenter l'authentification et des règles de sécurité appropriées

### Vérification

Après avoir publié les règles, rafraîchissez votre application. Les erreurs "Missing or insufficient permissions" devraient disparaître.

## 4. Obtenir les clés de configuration

1. Dans Firebase Console, allez dans "Project Settings" (⚙️)
2. Dans l'onglet "General", faites défiler jusqu'à "Your apps"
3. Cliquez sur l'icône Web (</>) pour ajouter une application web
4. Donnez un nom à votre application (ex: "Compta MPE")
5. Copiez les valeurs de configuration

## 5. Configurer les variables d'environnement

1. Créez un fichier `.env` à la racine du projet
2. Ajoutez les variables suivantes avec vos valeurs Firebase :

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 6. Créer les index Firestore (optionnel mais recommandé)

L'application utilise des requêtes avec `orderBy` et `where`. Firestore peut nécessiter des index composites.

### Index automatique

Lors de la première utilisation, Firestore vous proposera automatiquement de créer les index nécessaires. Cliquez sur le lien fourni dans la console du navigateur pour créer l'index.

### Index manuel

Si vous préférez créer les index manuellement :

1. Allez dans Firestore Database > Indexes
2. Cliquez sur "Créer un index"
3. Collection: `transactions`
4. Champs à indexer :
   - `exerciceId` (Ascending)
   - `date` (Descending)
5. Cliquez sur "Créer"

## 7. Structure des collections Firestore

L'application utilise les collections suivantes :

- **`entreprise`** : Informations de l'entreprise (document ID: `info`)
- **`exercices`** : Liste des exercices comptables
- **`transactions`** : Toutes les transactions
- **`settings`** : Paramètres de l'application (document ID: `app`)

## 8. Migration des données existantes

Si vous avez des données dans localStorage, vous pouvez les migrer vers Firestore :

1. Exportez vos données depuis l'application (si une fonctionnalité d'export existe)
2. Importez-les manuellement dans Firestore via la console Firebase
3. Ou créez un script de migration

## 9. Vérification

1. Démarrez l'application : `npm run dev`
2. Vérifiez la console du navigateur pour les erreurs
3. Vérifiez la console Firebase pour voir les données créées

## Sécurité en production

Pour la production, vous devez :

1. **Implémenter l'authentification** : Utilisez Firebase Authentication
2. **Créer des règles de sécurité** : Limitez l'accès aux données par utilisateur
3. **Activer la validation des données** : Utilisez les règles Firestore pour valider les données
4. **Configurer CORS** : Si nécessaire pour votre domaine

Exemple de règles de sécurité avec authentification (à adapter selon votre structure) :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Les utilisateurs authentifiés peuvent accéder à toutes les données
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Note** : Pour une application comptable, vous pourriez vouloir que tous les utilisateurs authentifiés partagent les mêmes données, ou créer un système de multi-tenant selon vos besoins.

## Support

Pour plus d'informations, consultez la [documentation Firebase](https://firebase.google.com/docs/firestore).

