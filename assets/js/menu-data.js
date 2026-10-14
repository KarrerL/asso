/* ==========================================================================
   MENU DU REPAS — à compléter quand le menu sera fixé (prévu mi-janvier 2027)
   Rien n'est inventé : tant qu'un champ est vide, le site affiche « À venir ».
   Octobre 2026 : ce sont des idées (rien d'officiel). Ingrédients, allergènes
   et régimes correspondent à la recette traditionnelle, à titre indicatif :
   à remplacer par la fiche du Crous quand la recette sera fixée.

   Pour chaque plat :
     nom           "Nom du plat"
     pays          "Pays d'origine"
     drapeau       code pays (fichier assets/img/drapeaux/xx.svg) ou ""
     presentation  "Deux ou trois phrases"
     ingredients   "Liste des ingrédients"
     allergenes    null = à venir ; [] = aucun ; sinon ex. ["Gluten", "Lait"]
                   (utiliser les intitulés des 14 allergènes réglementaires)
     vegan / vegetarien / sansGluten   true, false, ou null (= à venir)
     photo         "assets/img/menu/nom-du-fichier.jpg" ou "" (= à venir)
                   (photos d'illustration, crédits dans mentions-legales.html)
   ========================================================================== */
window.MENU = {
  entrees: [
    { nom: "Mercimek köftesi", pays: "Turquie", drapeau: "tr", presentation: "",
      ingredients: "Lentilles corail, boulgour fin, oignon, oignon nouveau, concentré de tomate et de poivron, persil, huile d'olive, cumin, piment doux, citron, salade",
      allergenes: ["Gluten"], vegan: true, vegetarien: true, sansGluten: false, photo: "assets/img/menu/mercimek-koftesi.jpg" },
    { nom: "Zaalouk", pays: "Maroc", drapeau: "ma", presentation: "",
      ingredients: "Aubergines, tomates, ail, huile d'olive, paprika, cumin, coriandre, persil, citron",
      allergenes: [], vegan: true, vegetarien: true, sansGluten: true, photo: "assets/img/menu/zaalouk.jpg" },
    { nom: "Bolinho de arroz", pays: "Brésil", drapeau: "br", presentation: "",
      ingredients: "Riz cuit, œufs, farine de blé, fromage râpé, oignon, ail, persil, huile de friture",
      allergenes: ["Gluten", "Œufs", "Lait"], vegan: false, vegetarien: true, sansGluten: false, photo: "assets/img/menu/bolinho-de-arroz.jpg" },
  ],
  plats: [
    { nom: "Thiébou niébé", pays: "Sénégal", drapeau: "sn", presentation: "",
      ingredients: "Riz brisé, niébé (haricots à œil noir), oignons, concentré de tomate, ail, poivron, piment, huile végétale",
      allergenes: [], vegan: true, vegetarien: true, sansGluten: true, photo: "assets/img/menu/thiebou-niebe.jpg" },
    { nom: "Plov", pays: "Ouzbékistan", drapeau: "uz", presentation: "",
      ingredients: "Riz, agneau, carottes, oignons, ail, pois chiches, huile, cumin",
      allergenes: [], vegan: false, vegetarien: false, sansGluten: true, photo: "assets/img/menu/plov.jpg" },
    { nom: "Bolani", pays: "Afghanistan", drapeau: "af", presentation: "",
      ingredients: "Pâte (farine de blé, eau, sel, huile), pommes de terre, ciboule, coriandre, piment, sauce au yaourt",
      allergenes: ["Gluten", "Lait"], vegan: false, vegetarien: true, sansGluten: false, photo: "assets/img/menu/bolani.jpg" },
  ],
  desserts: [
    { nom: "Malva pudding", pays: "Afrique du Sud", drapeau: "za", presentation: "",
      ingredients: "Farine de blé, sucre, œuf, confiture d'abricot, beurre, lait, crème, bicarbonate, vinaigre",
      allergenes: ["Gluten", "Œufs", "Lait"], vegan: false, vegetarien: true, sansGluten: false, photo: "assets/img/menu/malva-pudding.jpg" },
    { nom: "Suji halwa", pays: "Inde", drapeau: "in", presentation: "",
      ingredients: "Semoule de blé, ghee (beurre clarifié), sucre, lait, cardamome, amandes, noix de cajou, raisins secs",
      allergenes: ["Gluten", "Lait", "Fruits à coque"], vegan: false, vegetarien: true, sansGluten: false, photo: "assets/img/menu/suji-halwa.jpg" },
    { nom: "Peach cobbler", pays: "États-Unis", drapeau: "us", presentation: "",
      ingredients: "Pêches, farine de blé, sucre, beurre, lait, levure chimique, cannelle",
      allergenes: ["Gluten", "Lait"], vegan: false, vegetarien: true, sansGluten: false, photo: "assets/img/menu/peach-cobbler.jpg" },
  ],
};
