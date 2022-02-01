
const app = {
    // Paramètres des cartes (couleurs, valeurs) et nombre de jeux de cartes pour une partie
    cardParams: {
        cardColors: ['heart', 'spade', 'diamond', 'club'],
        // Valeurs des cartes : 2 -> 10 cartes simples, 11 = Vallet, 12 = Dame, 13 = Roi, 14 = As
        cardValues: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        // Nombre de jeux de 56 cartes que je souhaite intégrer au jeu de cartes complet
        nbCardSetInCardGame: 6,
    },

    // Jeu de carte complet ordonné
    cardSet: [],

    // Jeu de carte complet mélangé
    cardDeck: [],

    // Jeu de carte scindé
    cardDeckTopPlay: [],

    // Tableau des joueurs
    players: [
        {
            name: 'Croupier',
            hand: [],
            score: 0,
            money: 0,
        },
    ],

    // Niveau de difficulté du jeu : true = avec indication des scores des cartes de chaque joueur, False sans indication de score des cartes des joueurs
    easyLevel: true,

    // Marqueur de fin de jeu
    stopGame: false,

    /**
     * Fonction qui permet de générer un set de cartes rangées dans l'ordre des couleurs (coeur, carreaux, pique, treffle) et des valeurs (2->As)
     */
    createCardSet: () => {
        app.cardSet = [];
        for (let k = 1; k < app.cardParams.nbCardSetInCardGame + 1; k++) {
            for (let i = 0; i < app.cardParams.cardColors.length; i++) {
                for (let j = 0; j < app.cardParams.cardValues.length; j++) {
                    let cardValue = () => {
                        if (app.cardParams.cardValues[j] < 9) {
                            return app.cardParams.cardValues[j];
                        } else if (app.cardParams.cardValues[j] === 14) {
                            return 11;
                        } else {
                            return 10;
                        }
                    };
                    let newCardSetEntry = {
                        color: app.cardParams.cardColors[i],
                        value: app.cardParams.cardValues[j],
                        score: cardValue(),
                        visible: false,
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
        // coupe le cardDeck de la première carte jusqu'à la carte   'cardFromCardDeckSelected' a la fin du cardDeck
        let selectedCardsForCardDeckToPlay = app.cardDeck.slice(0, cardFromCardDeckSelected);
        // recupère la coupe du cardDeck et alimente de cardDeckToPlay
        app.cardDeckTopPlay = selectedCardsForCardDeckToPlay;
        // console.log('Visu de cardDeckToPlay :', app.cardDeckTopPlay);
        // console.log('Visu de cardDeck :', app.cardDeck);
        // console.log('Visu de cardSet :', app.cardSet);
    },

    /**
         * Fonction qui permet d'ajouter sur le DOM une zone d'un joueur ainsi que sa structure (nom, montant du wallet)
         * @param {string} player Nom du joueur
         * @param {number} money Montant du wallet du joueur
         */
    addPlayerZone: (player, money) => {
        const playerZone = document.createElement('div');
        playerZone.className = `playerZone player-${player}`;
        const gameZone = document.querySelector('.playersZone');
        // console.log(croupierZone);
        gameZone.appendChild(playerZone);
        const playerName = document.createElement('h2');
        playerName.className = `playerName player-${player}`;
        playerName.textContent = player;
        playerZone.appendChild(playerName);

        const playerMoney = document.createElement('h3');
        playerMoney.className = `playerMoney player-${player}`;
        playerMoney.textContent = `${money} €`;
        playerZone.appendChild(playerMoney);
        const cardZone = document.createElement('div');
        cardZone.className = `cardZone cardZone-${player}`;
        playerZone.appendChild(cardZone);
    },

    /**
         * Fonction permettant d'initialiser plusieurs joueurs à la table de jeu et d'afficher sur le DOM les zones de jeu des joueurs
         */
    initPlayers: () => {
        // Demande combien de joueurs souhaitent jouer
        let answer = prompt('Combien de joueurs à la table ?\n--  4 joueurs maximum  --');
        let howManyPlayers = Number(answer);

        // Si la réponse donnée n'est pas un nombre on redemande
        while (isNaN(howManyPlayers)) {
            let answer2 = prompt('Recommence, ce n\'est pas un nombre! \nCombien de joueurs à la table ?');
            howManyPlayers = Number(answer2);
        }

        // Si le nombre de joueurs est supérieur à 4 on redemande
        while (howManyPlayers > 4) {
            let answer3 = prompt('Le nombre de joueurs à la table est limité a 4 !\nCombien de joueurs à la table ?');
            howManyPlayers = Number(answer3);
        }

        // Demande des noms des joueurs et initialisation des paramètres des joueurs
        for (let nb = 1; nb <= howManyPlayers; nb++) {
            let nameAnswer = prompt(`Quel est le nom du joueur ${nb} ?`);
            let newPlayer = {
                name: nameAnswer,
                hand: [],
                score: 0,
                money: 500,
            };
            app.players.push(newPlayer);
            app.addPlayerZone(newPlayer.name, newPlayer.money);
        }

        // console.log(app.players);
        // console.log(app.players[0].name, app.players[1].name)

    },

    /**
     * Fonction qui permet d'ajouter une carte sur le DOM dans la cardZone du joueur
     * @param {String} wichPlayer Index du joueur dans le tableau des joueurs
     * @param {Object} card Carte qui est distribuée au joueur
     */
    addCardInPlayerZone: (wichPlayer, card) => {
        // console.log(app.players[0].name);
        // console.log('Player : ', wichPlayer, 'card : ', card);
        const playerZone = document.querySelector(`.cardZone-${app.players[wichPlayer].name}`);
        const newCard = document.createElement('div');
        newCard.className = `card card-${card.color} card-${card.value}`;
        playerZone.appendChild(newCard);

    },

    /**
     * Fonction de distribution d'une carte au joueur (ajout d'une carte depuis le cardDeckToPlay vers la main du joueur) puis ajout sur le DOM de cette carte dans la cardZone du joueur
     * @param {String} whichPlayer Index du joueur dans le tableau des joueurs
     * @param {Boolean} visibility Etat de la carte true = visible, False = cachée
     */
    distributeACard: (whichPlayer, visibility) => {

        if (app.cardDeckTopPlay.length >= 1) {
            // Récupération de la première carte du Deck cardDeckToPlay
            let cardToPush = app.cardDeckTopPlay[0];

            // Si le joueur tire un As on lui demande quelle valeur il souhaite que cet As prenne (1 ou 11)
            // if (cardToPush.value === 14) {
            //     cardToPush.score = app.ChooseAceValue(whichPlayer);
            // }

            // Ajout de cette carte dans la main du joueur
            // Changement de la visibilité de la carte
            cardToPush.visible = visibility;
            // console.log("valeur de la carte :", cardToPush.value, "Le score de la carte est :", cardToPush.score);
            // console.log(app.players[whichPlayer].hand.push(cardToPush));
            app.players[whichPlayer].hand.push(cardToPush);
            // Incrémentation du score du joueur
            app.players[whichPlayer].score += Number(cardToPush.score);
            // Suppression de cette carte du Deck cardDeckToPlay
            app.cardDeckTopPlay.shift();

            // Ajoute la carte sur le DOM
            app.addCardInPlayerZone(whichPlayer, cardToPush);

        }
        // console.log(whichPlayer);
        // console.log("nombre de cartes restantes dans le jeu :", app.cardDeckTopPlay.length);
    },

    /**
     * Fonction permettant de faire le choix si l'as vaut 1 ou vaut 11
     * @param {Number} whichPlayer Index du tableau des joueurs
     * @returns Valeur de la carte "As"
     */
    ChooseAceValue: (whichPlayer) => {
        // Demande au joueur quelle valeur il souhaite pour l'As
        let playerAnswer = prompt(`${whichPlayer.name.toUpperCase()} Quelle Valeur Souhaitez vous pour l'As ? 1 ou 11 ?`);
        // Tant que sa réponse n'est pas 1 ou 11 on lui repose la question
        while (playerAnswer !== '1' && playerAnswer !== '11') {
            playerAnswer = prompt('Vous avez donné la mauvaise réponse ! \n Quelle Valeur Souhaitez vous pour l\'As ? 1 ou 11 ?');
        }
        // Si la réposne est "1" on renvoi 1 et si la réponse est "11" on renvoi 11
        if (playerAnswer === '1') {
            return 1;
        } else if (playerAnswer === '11') {
            return 11;
        }
    },

    /**
     * Fonction d'execution de la première donne de jeu
     */
    playFirstRound: () => {
        // Initialise les mains des joueurs avant le premier tour de distribution
        app.players.forEach(item => {
            item.hand = [];
        });

        // Distribution d'une carte au croupier
        app.distributeACard(0, true);

        // Distribution de 2 cartes à tous les joueurs
        for (let iteration = 1; iteration <= 2; iteration++) {
            for (let playerNb = 1; playerNb <= app.players.length - 1; playerNb++) {
                // console.log('valeur de i :', i);
                app.distributeACard(playerNb, true);
            }
        }
        // console.log(app.players);

        // Si l'option de jeu facile est activée alors on affiche pour chacun des joueurs le score représenté par ses cartes
        if (app.easyLevel) {
            app.players.forEach((player) => {
                const playerName = document.querySelector(`h2.player-${player.name}`);
                const scoreText = document.createElement('span');
                scoreText.className = 'scoreText';
                scoreText.textContent = `( score des cartes : ${player.score})`;
                playerName.appendChild(scoreText);
            });
        }
    },

    // TODO Faire la fonction de suite du jeu

    init: () => {

        // Création du deck de jeu
        app.createCardDeckToPlay();
        console.log('nombre de carte dans le Deck :', app.cardDeckTopPlay.length);

        // Initialisation des joueurs
        app.initPlayers();

        // Lance la première phase de jeu : la première donne
        app.playFirstRound();

    },
};

document.addEventListener('DOMContentLoaded', app.init);


