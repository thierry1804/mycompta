# Configuration PWA (Progressive Web App)

L'application est maintenant configurée comme PWA. Voici ce qui a été mis en place :

## Fonctionnalités PWA

✅ **Installable** : L'application peut être installée sur les appareils mobiles et desktop
✅ **Hors ligne** : Fonctionne hors ligne grâce au service worker
✅ **Mise à jour automatique** : Le service worker se met à jour automatiquement
✅ **Icônes** : Support des icônes pour différents appareils

## Génération des icônes

Vous devez créer les icônes suivantes dans le dossier `public/` :

1. **pwa-192x192.png** (192x192 pixels)
2. **pwa-512x512.png** (512x512 pixels)
3. **apple-touch-icon.png** (180x180 pixels pour iOS)

### Option 1 : Utiliser un outil en ligne

1. Allez sur [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
2. Uploadez votre logo (format carré recommandé)
3. Téléchargez les icônes générées
4. Placez-les dans le dossier `public/`

### Option 2 : Créer manuellement

Créez des images PNG avec les dimensions suivantes :
- `pwa-192x192.png` : 192x192px
- `pwa-512x512.png` : 512x512px
- `apple-touch-icon.png` : 180x180px

### Option 3 : Utiliser un logo existant

Si vous avez déjà un logo, redimensionnez-le aux dimensions requises avec un outil comme :
- [GIMP](https://www.gimp.org/)
- [Photoshop](https://www.adobe.com/products/photoshop.html)
- [Canva](https://www.canva.com/)
- [Figma](https://www.figma.com/)

## Test de la PWA

### En développement

1. Lancez l'application : `npm run dev`
2. Ouvrez les DevTools (F12)
3. Allez dans l'onglet "Application" > "Service Workers"
4. Vérifiez que le service worker est actif

### En production

1. Build l'application : `npm run build`
2. Preview : `npm run preview`
3. Ouvrez les DevTools > "Application" > "Manifest"
4. Vérifiez que le manifest est valide

### Installation sur mobile

1. Ouvrez l'application dans Chrome/Edge sur Android
2. Cliquez sur le menu (3 points)
3. Sélectionnez "Ajouter à l'écran d'accueil" ou "Installer l'application"
4. L'application apparaîtra comme une app native

### Installation sur desktop

1. Ouvrez l'application dans Chrome/Edge
2. Cliquez sur l'icône d'installation dans la barre d'adresse
3. Ou allez dans le menu > "Installer Compta MPE"

## Configuration

La configuration PWA se trouve dans `vite.config.ts`. Vous pouvez modifier :

- **Nom de l'application** : `manifest.name` et `manifest.short_name`
- **Couleur du thème** : `manifest.theme_color`
- **Mode d'affichage** : `manifest.display` (standalone, fullscreen, minimal-ui)
- **Orientation** : `manifest.orientation` (portrait, landscape, any)

## Service Worker

Le service worker est généré automatiquement par `vite-plugin-pwa` et :
- Met en cache les assets statiques
- Permet le fonctionnement hors ligne
- Se met à jour automatiquement lors des nouvelles versions

## Dépannage

### Le service worker ne se charge pas

1. Vérifiez que vous êtes en HTTPS (ou localhost)
2. Videz le cache du navigateur
3. Réinstallez le service worker depuis les DevTools

### L'application ne s'installe pas

1. Vérifiez que le manifest est valide (DevTools > Application > Manifest)
2. Assurez-vous que toutes les icônes sont présentes
3. Vérifiez que vous avez un service worker actif

### Les mises à jour ne fonctionnent pas

Le service worker se met à jour automatiquement. Si ce n'est pas le cas :
1. Fermez tous les onglets de l'application
2. Rouvrez l'application
3. Le nouveau service worker sera activé

## Ressources

- [Documentation vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [PWA Builder](https://www.pwabuilder.com/)
- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

