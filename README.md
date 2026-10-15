# PANGEA — site du repas du monde au Crous

Site statique (HTML, CSS, JS) : aucune installation, aucun service tiers.
Ouvrir `index.html` dans un navigateur, ou déposer le dossier tel quel chez l'hébergeur.

## Pages
`index.html` · `evenement.html` · `menu.html` · `participer.html` · `association.html` · `mentions-legales.html`

## À remplacer avant la mise en ligne
Toutes les infos provisoires sont visibles sur le site (soulignées en pointillés ou badge « À venir »).

| Élément | Où |
|---|---|
| E-mail, Instagram | chercher `E-mail à venir` et `Instagram à venir` |
| Lien du sondage | chercher `Lien du sondage à venir` (menu.html, participer.html) |
| RNA, SIRET, hébergeur | mentions-legales.html |
| Coordonnées bancaires | participer.html, section Soutenir |
| Photo de Julie | photo portrait 4:5 (800×1000 px, sans métadonnées) dans `assets/img/bureau/`, puis une balise `<img>` comme pour Loïc dans association.html |
| Menu | **un seul fichier** : `assets/js/menu-data.js`. Il alimente la page « Le menu », l'accueil (« Compose ton plateau ») et la page L'événement (« Le principe »). Ingrédients et allergènes = recette traditionnelle indicative, à remplacer par la fiche du Crous |
| Photos des plats | photos d'illustration Wikimedia Commons dans `assets/img/menu/`, crédits dans mentions-legales.html : à mettre à jour si une photo change |
| Partenaires | uniquement avec accord écrit |

## ⚠️ Nom de l'IUT
La charte SAE impose l'accord du chef de département avant toute communication utilisant le nom ou le logo de l'IUT.
Chaque mention est balisée `<span data-iut>` pour être retrouvée facilement. Aucun logo IUT n'est utilisé.

## Technique
- Polices Telma, Supreme, Gambarino (Fontshare, licence ITF FFL), intégrées en base64 dans `assets/css/polices.css` (fonctionne aussi en ouvrant le site depuis le disque). Les .woff2 d'origine restent dans `assets/fonts/`.
- Animations : GSAP + ScrollTrigger, en local dans `assets/js/vendor/`.
- Le contenu reste lisible sans JavaScript ; l'option système « réduire les animations » est respectée.
- Aucun cookie, aucune mesure d'audience.
- Carte (page L'événement) : MapLibre en local + fonds OpenFreeMap (gratuit, sans clé), recolorés aux couleurs du site, chargés seulement après un clic sur « Afficher la carte » (choix mémorisé dans le navigateur).
- Photos du bureau : recadrées, compressées et nettoyées de leurs métadonnées. Les originaux sont dans `Documents/site-asso-originaux/` (à ne pas mettre en ligne).

## Logo et couleurs
- Logo : `assets/img/logo/` (logo pour fond clair dans l'en-tête, P seul, favicon), police Vabedo. Toutes les déclinaisons (SVG + PNG) et la planche d'usage : dossier `Documents/pangea-logo`.
- Palette : coolors.co/cb5731-f2be5c-758a5c-f8e9cf-442f29, variables en tête de `assets/css/style.css`.

## Boutique (boutique.html)
- Photos : emplacements « Photo à venir ». Pour en ajouter une, déposer `assets/img/boutique/<produit>.jpg` (format carré) et remplacer l'emplacement par une balise `<img>` (voir le commentaire dans boutique.html).
- Prix proposés et coût unitaire estimé (petites séries d'environ 50 pièces, ordres de grandeur à vérifier par devis) :

| Objet | Prix de vente | Coût estimé | Marge estimée |
|---|---|---|---|
| T-shirt | 22 € | 8 à 10 € | 12 à 14 € |
| Casquette brodée | 20 € | 6 à 9 € | 11 à 14 € |
| Tote bag | 12 € | 3 à 4 € | 8 à 9 € |
| Housse d'ordinateur | 28 € | 10 à 13 € | 15 à 18 € |
| Stylo | 3 € | 0,50 à 1 € | 2 à 2,50 € |
| Lot de 3 autocollants | 3 € | 0,60 à 1 € | 2 à 2,40 € |

- Avant d'ouvrir les précommandes : vérifier la charte SAE (règles sur les ventes et les fonds), attendre que l'association soit déclarée et ait son compte bancaire, demander des devis.
