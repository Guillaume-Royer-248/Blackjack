//Main du croupier
let dealerHand = [];

//Main du joueur
let playerHand = [];


let app = {
  cardColors: ["heart", "spade", "diamond", "club"],

  cardValues: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],

  // Nombre de jeux de 56 cartes que je souhaite intégrer au jeu de cartes complet
  nbCardSetInCardGame: 6,

  // Jeu de carte complet ordonné
  cardSet: [],

  // Jeu de carte complet mélangé
  cardDeck: [],

  // Jeu de carte scindé
  cardDeckTopPlay: [],



  // Marqueur de fin de jeu
  stopGame: false,

  addGameZone: () => {
    const gameZone = document.createElement("div");
    gameZone.id = "gameZone";
    gameZone.className = "gameZone";
    const scriptBalise = document.querySelector("#scriptBalise");
    const parentDiv = scriptBalise.parentNode;
    parentDiv.insertBefore(gameZone, scriptBalise);
  },

  addCroupierZone: () => {
    const croupierZone = document.createElement("div");
    croupierZone.id = "croupierZone";
    croupierZone.className = "croupierZone";
    const gameZone = document.querySelector("#gameZone");
    // console.log(croupierZone);
    gameZone.appendChild(croupierZone);
  },

  addPlayerZone: () => {
    const playerZone = document.createElement("div");
    playerZone.id = "playerZone";
    playerZone.className = "playerZone";
    const gameZone = document.querySelector("#gameZone");
    // console.log(croupierZone);
    gameZone.appendChild(playerZone);
  },

  initGameRoom: () => {
    app.addGameZone();
    app.addCroupierZone();
    app.addPlayerZone();
  },

  /**
   * Fonction qui permet de générer un set de cartes rangées dans l'ordre des couleurs (coeur, carreaux, pique, treffle) et des valeurs (2->As)
   */
  createCardSet: () => {
    app.cardSet = [];
    for (let k = 1; k < app.nbCardSetInCardGame + 1; k++) {
      for (let i = 0; i < app.cardColors.length; i++) {
        for (let j = 0; j < app.cardValues.length; j++) {
          let cardValue = () => {
            if (app.cardValues[j] < 9) {
              return app.cardValues[j];
            } else {
              return 10;
            }
          };
          let newCardSetEntry = {
            color: app.cardColors[i],
            value: app.cardValues[j],
            score: cardValue(),
          };
          app.cardSet.push(newCardSetEntry);
        }
      }
    }
  },

  /**
   * Fonction qui perment de créer un deck complet de cartes (312 cartes).
   * Les cartes à l'interiezur de ce deck sont mélangées
   */
  createCardDeck: () => {
    app.cardDeck = [];
    app.createCardSet();
    while (app.cardSet.length > 0) {
      // Fonction qui permet de générer un nombre aléatoire entre un min et un max
      let selectACardInCardSet = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
      };
      // Définit un nombre aléatoire entre 0 et le nombre d'entrées de la table 'cardSet'
      let cardFromCardSetSelected = selectACardInCardSet(0, app.cardSet.length);
      // lit les infos de l'entrée newCardDeckEntry du tableau
      let cardFromCardSet = app.cardSet[cardFromCardSetSelected];
      // Ajoute cette carte dans le cardDeck
      app.cardDeck.push(cardFromCardSet);
      // supprime cette carte de carteset
      app.cardSet.splice(cardFromCardSetSelected, 1);
    }
    // console.log("Visu de cardDeck :", app.cardDeck);
    // console.log("Visu de cardSet :", app.cardSet);
  },

  /**
   * Fonction qui permet de créer un Deck de cartes limitées pour le jeu
   */
  createCardDeckToPlay: () => {
    app.cardDeckTopPlay = [];
    app.createCardDeck();
    // Fonction qui permet de générer un nombre aléatoire entre un min et un max
    let selectACardInCardDeck = (min, max) => {
      return Math.floor(Math.random() * (max - min)) + min;
    };
    // Définit un nombre aléatoire entre 52 et le nombre d'entrées de la table 'cardDeck'
    // let cardFromCardDeckSelected = selectACardInCardDeck(52, app.cardDeck.length);
    let cardFromCardDeckSelected = selectACardInCardDeck(4, 10);
    // coupe le cardDeck de la première carte jusqu'à la carte   'cardFromCardDeckSelected' a la fin du cardDeck
    let selectedCardsForCardDeckToPlay = app.cardDeck.slice(0, cardFromCardDeckSelected);
    // recupère la coupe du cardDeck et alimente de cardDeckToPlay
    app.cardDeckTopPlay = selectedCardsForCardDeckToPlay;
    // console.log("Visu de cardDeckToPlay :", app.cardDeckTopPlay);
    // console.log("Visu de cardDeck :", app.cardDeck);
    // console.log("Visu de cardSet :", app.cardSet);
  },

  // Fonction de distribution d'une carte au Croupier
  distributeACard: (WhichHand) => {

    // let handScore = Number(WhichHand.score)
    // La distribution ne peut se faire que si le Deck cardDeckToPlay contient au moins une carte et que stpGame soit à False
    if (!app.stopGame) {

      if (app.cardDeckTopPlay.length > 1) {
        // Récupération de la première carte du Deck cardDeckToPlay
        let cardToPush = app.cardDeckTopPlay[0];
        // Ajout de cette carte dans la main du dealer
        console.log("valeur de la carte :", cardToPush.value, "type de la valeur de la carte :", typeof (cardToPush.value));
        WhichHand.push(cardToPush);
        WhichHand.score += Number(cardToPush.value);
        // Suppression de cette carte du Deck cardDeckToPlay
        app.cardDeckTopPlay.shift();


      } else if (app.stopGame = 1) {
        // Récupération de la première carte du Deck cardDeckToPlay
        let cardToPush = app.cardDeckTopPlay[0];
        // Ajout de cette carte dans la main du dealer
        WhichHand.push(cardToPush);
        console.log("valeur de la carte :", cardToPush.value);
        WhichHand.score += Number(cardToPush.value);
        // Suppression de cette carte du Deck cardDeckToPlay
        app.cardDeckTopPlay.shift();
        app.stopGame = true;

      };
    };
    console.log(WhichHand);
    console.log("nombre de cartes restantes dans le jeu :", app.cardDeckTopPlay.length);

  },

  init: () => {
    app.initGameRoom();
    app.createCardDeckToPlay();
    app.playerHand = [];
    app.dealerHand = [];
    console.log("nombre de carte dans le Deck :", app.cardDeckTopPlay.length);
    console.log("Main du dealer :", app.dealerHand);
    console.log("Main du joueur :", app.playerHand);
    // app.distributeACard(app.dealerHand);
  },
};

document.addEventListener("DOMContentLoaded", app.init);
