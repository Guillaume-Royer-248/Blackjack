


let app = {
  cardColors: ["heart", "spade", "diamond", "club"],

  // Valeurs des cartes : 2 -> 10 cartes simples, 11 = Vallet, 12 = Dame, 13 = Roi, 14 = As
  cardValues: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],

  // Nombre de jeux de 56 cartes que je souhaite intégrer au jeu de cartes complet
  nbCardSetInCardGame: 6,

  // Jeu de carte complet ordonné
  cardSet: [],

  // Jeu de carte complet mélangé
  cardDeck: [],

  // Jeu de carte scindé
  cardDeckTopPlay: [],

  // Croupier
  dealer: {
    name: "dealer",
    hand: [],
    score: 0,
  },

  // Croupier
  player: {
    name: "player",
    hand: [],
    score: 0,
  },

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

  ChooseAceValue: () => {
    // Demande au joueur quelle valeur il souhaite pour l'As
    let playerAnswer = prompt("Quelle Valeur Souhaitez vous pour l'As ? 1 ou 11 ?");
    // Tant que sa réponse n'est pas 1 ou 11 on lui repose la question
    while (playerAnswer !== "1" && playerAnswer !== "11") {
      playerAnswer = prompt("Vous avez donné la mauvaise réponse ! \n Quelle Valeur Souhaitez vous pour l'As ? 1 ou 11 ?");
    }
    // Si la réposne est "1" on renvoi 1 et si la réponse est "11" on renvoi 11
    if (playerAnswer === "1") {
      return 1;
    } else if (playerAnswer === "11") {
      return 11;
    }
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
            } else if (app.cardValues[j] = 14) {
              return 11;
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
    let cardFromCardDeckSelected = selectACardInCardDeck(52, app.cardDeck.length);
    // let cardFromCardDeckSelected = selectACardInCardDeck(4, 10);
    // coupe le cardDeck de la première carte jusqu'à la carte   'cardFromCardDeckSelected' a la fin du cardDeck
    let selectedCardsForCardDeckToPlay = app.cardDeck.slice(0, cardFromCardDeckSelected);
    // recupère la coupe du cardDeck et alimente de cardDeckToPlay
    app.cardDeckTopPlay = selectedCardsForCardDeckToPlay;
    // console.log("Visu de cardDeckToPlay :", app.cardDeckTopPlay);
    // console.log("Visu de cardDeck :", app.cardDeck);
    // console.log("Visu de cardSet :", app.cardSet);
  },

  // Fonction de distribution d'une carte au Croupier
  distributeACard: (whichPlayer) => {

    if (app.cardDeckTopPlay.length >= 1) {
      // Récupération de la première carte du Deck cardDeckToPlay
      let cardToPush = app.cardDeckTopPlay[0];
      // Si le joueur tire un As on lui demande quelle valeur il souhaite que cet As prenne (1 ou 11)
      if (cardToPush.value === 14) {
        cardToPush.score = app.ChooseAceValue();
      }
      // Ajout de cette carte dans la main du joueur
      console.log("valeur de la carte :", cardToPush.value, "Le score de la carte est :", cardToPush.score);
      whichPlayer.hand.push(cardToPush);
      // Incrémentation du score du joueur
      whichPlayer.score += Number(cardToPush.score);
      // Suppression de cette carte du Deck cardDeckToPlay
      app.cardDeckTopPlay.shift();
    };
    console.log(whichPlayer);
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
    app.distributeACard(app.player);
    app.distributeACard(app.dealer);
    app.distributeACard(app.player);
    app.distributeACard(app.dealer);
    // app.distributeACard(app.dealerHand);
  },
};

document.addEventListener("DOMContentLoaded", app.init);
