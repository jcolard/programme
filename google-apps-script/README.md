# Guide de Déploiement Google Apps Script

Ce script permet à votre application Day Scheduler de lire et d'écrire dans votre fichier JSON stocké sur Google Drive :
👉 **Fichier :** `https://drive.google.com/file/d/1tMm3y6prKb251h2Hq70rUt0ehfGWt2kB/view`

---

## Étapes de mise en place (2 minutes)

1. Rendez-vous sur [script.google.com](https://script.google.com) ou créez un nouveau script depuis votre Google Drive (**Nouveau > Plus > Google Apps Script**).
2. Nommez le projet (ex : `Day Scheduler Sync`).
3. Remplacez le contenu du fichier `Code.gs` par le code contenu dans [`google-apps-script/Code.gs`](./Code.gs).
4. Cliquez sur **Déployer** (bouton bleu en haut à droite) > **Nouveau déploiement**.
5. Cliquez sur l'icône d'engrenage ⚙️ à côté de *Sélectionner le type* et choisissez **Application Web**.
6. Renseignez la configuration :
   - **Description :** `API Synchronisation Calendrier`
   - **Exécuter en tant que :** `Moi (<votre email>)`
   - **Qui a accès :** `Tout le monde` *(Important pour que l'app Web puisse appeler le script sans bloquer sur l'authentification CORS)*
7. Cliquez sur **Déployer**.
8. Autorisez l'accès lorsque Google vous le demande (en cliquant sur *Paramètres avancés* > *Accéder à...*).
9. Copiez l'**URL de l'application Web** (qui se termine par `/exec`).

---

## Utilisation dans l'application

Une fois l'URL obtenue :
- Vous pouvez la coller directement dans l'interface de l'application (en cliquant sur l'icône d'engrenage / Cloud dans l'en-tête).
- Ou nous l'indiquer pour que nous l'intégrions en constante par défaut dans le code source.
