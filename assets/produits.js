/* ==========================================================================
   FORMIDABLE — CATALOGUE
   C'est le SEUL fichier à modifier pour gérer la boutique.
   • Changer un prix : modifiez « prix » (nombre, sans espace).
   • Stock : « stock » = "en-stock", "sur-commande" ou "epuise".
   • Ajouter un produit : copiez un bloc { ... }, changez « id » (sans accent ni espace),
     le nom, le prix, la catégorie et les photos (déposées dans assets/img/).
   • Catégories possibles : "classic", "shamballa", "stones", "duo".
   • Paiement en ligne : bloc « fedapay » ci-dessous (lien Tap & Go + code USSD).
     Pour couper le paiement en ligne, videz « lien » : seul WhatsApp (paiement à la livraison) reste.
   • « chariow » : réservé aux futurs produits numériques (Chariow n'accepte pas les produits physiques).
   ========================================================================== */

window.FORMIDABLE = {
  whatsapp: "2290153300376",            // numéro WhatsApp de la boutique (indicatif + numéro, sans +)
  whatsappAffiche: "+229 01 53 30 03 76",
  fedapay: {
    lien: "https://pos.fedapay.com/pay/00588",   // page de paiement (QR code Tap & Go)
    ussd: "*601*14*00588*{montant}#",            // {montant} est remplacé par le total
    beneficiaire: "HARMONIA COSMETICS"           // nom affiché par FedaPay au moment du paiement
  },
  chariowDomaine: "",                   // inutilisé pour les bracelets (produits physiques)
  produits: [
    {
      id: "shamballa-initiale",
      nom: "Shamballa Initiale",
      categorie: "shamballa",
      prix: 1000,
      couleur: "noir",
      stock: "en-stock",
      badge: "Personnalisable",
      populaire: true,
      photos: ["shamballa-initiale-1.jpg", "shamballa-initiale-2.jpg", "duo-initiales-2.jpg"],
      court: "Le bracelet tressé qui porte ton initiale, au milieu.",
      description: "Un Shamballa tressé à la main, sobre et ajustable, avec une perle gravée de la lettre de ton choix en son centre. Pour toi, ou pour garder près de toi le prénom de quelqu'un.",
      matieres: [
        ["Bracelet", "Fil tressé noir façon Shamballa"],
        ["Initiale", "Perle ronde blanche marquée d'une lettre"],
        ["Fermeture", "Nœud coulissant, s'ajuste à tous les poignets"]
      ],
      initiales: 1,
      chariow: ""
    },
    {
      id: "shamballa-classique",
      nom: "Shamballa Classique",
      categorie: "shamballa",
      prix: 1000,
      couleur: "noir",
      stock: "en-stock",
      badge: "",
      populaire: false,
      photos: ["shamballa-classique-1.jpg", "perles-noires-2.jpg"],
      court: "Le tressé noir tout simple, qui va avec tout.",
      description: "La base de toute collection : un Shamballa tressé noir, discret et solide, qui se porte seul ou superposé à un bracelet de perles.",
      matieres: [
        ["Bracelet", "Fil tressé noir façon Shamballa"],
        ["Fermeture", "Nœud coulissant, s'ajuste à tous les poignets"]
      ],
      initiales: 0,
      chariow: ""
    },
    {
      id: "perles-noires",
      nom: "Shamballa Perles Noires",
      categorie: "classic",
      prix: 1000,
      couleur: "noir",
      stock: "en-stock",
      badge: "",
      populaire: true,
      photos: ["perles-noires-1.jpg", "perles-noires-2.jpg"],
      court: "Des perles noires polies, un éclat discret.",
      description: "Une rangée de perles noires brillantes montées sur cordon, avec la fermeture coulissante façon Shamballa. Sobre, masculin comme féminin, parfait pour le quotidien.",
      matieres: [
        ["Perles", "Perles noires polies"],
        ["Cordon", "Fil noir, fermeture coulissante façon Shamballa"]
      ],
      initiales: 0,
      chariow: ""
    },
    {
      id: "oeil-de-tigre",
      nom: "Œil de Tigre",
      categorie: "stones",
      prix: 2500,
      couleur: "marron",
      stock: "en-stock",
      badge: "Pierre naturelle",
      populaire: true,
      photos: ["oeil-de-tigre-1.jpg", "oeil-de-tigre-2.jpg", "oeil-de-tigre-3.jpg"],
      court: "Les reflets dorés d'une pierre naturelle.",
      description: "Des perles d'œil de tigre aux reflets miel et bronze, qui changent avec la lumière. Chaque bracelet est unique : les veines de la pierre ne se ressemblent jamais.",
      matieres: [
        ["Pierres", "Œil de tigre, pierre naturelle"],
        ["Cordon", "Fil marron, fermeture coulissante façon Shamballa"]
      ],
      initiales: 0,
      chariow: ""
    },
    {
      id: "duo-initiales",
      nom: "Duo Initiales",
      categorie: "duo",
      prix: 1500,
      couleur: "noir",
      stock: "en-stock",
      badge: "Idée cadeau",
      populaire: true,
      photos: ["duo-initiales-1.jpg", "shamballa-initiale-2.jpg", "duo-initiales-2.jpg"],
      court: "Deux bracelets, deux initiales : un pour toi, un pour l'autre.",
      description: "Deux Shamballa Initiale assortis, chacun avec sa lettre. Le cadeau qui se partage : en couple, entre meilleurs amis, entre frère et sœur.",
      matieres: [
        ["Bracelets", "2 × fil tressé noir façon Shamballa"],
        ["Initiales", "2 perles blanches marquées d'une lettre"],
        ["Fermeture", "Nœuds coulissants ajustables"]
      ],
      initiales: 2,
      chariow: ""
    },
    {
      id: "duo-shamballa",
      nom: "Duo Shamballa",
      categorie: "duo",
      prix: 1500,
      couleur: "noir",
      stock: "en-stock",
      badge: "",
      populaire: false,
      photos: ["duo-shamballa-1.jpg", "perles-noires-2.jpg"],
      court: "Le tressé et les perles noires, à porter ensemble ou à offrir.",
      description: "Deux bracelets au choix : un Shamballa Classique et un Shamballa Perles Noires, ou deux identiques. Ils se portent superposés ou se partagent.",
      matieres: [
        ["Composition", "2 bracelets Shamballa au choix"],
        ["Fermeture", "Nœuds coulissants ajustables"]
      ],
      initiales: 0,
      composition: ["Classique + Perles noires", "2 × Classique", "2 × Perles noires"],
      chariow: ""
    }
  ]
};
