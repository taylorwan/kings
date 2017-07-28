/**
* This skill allows our user to play the drinking game, Kings
* Developed by Taylor Wan
* https://github.com/taylorwan
**/

'use strict';

const Alexa  = require('alexa-sdk');
const APP_ID = 'your-app-id-here';

// default messages to the user
const messages = {
  welcome : 'Welcome to Kings! I hope you all have a drink. Ask me for your first card when you\'re ready.',
  stop    : 'Thanks for playing! Goodbye!',
  help    : 'You can ask me to draw a card, or about what a card can do.',
  ask     : 'If you would like a card, say "Alexa, ask kings for a card"'
};

// tracks which types of cards are still in the deck
let remainingCards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// our deck and its default values
let deck = [{
  value       : 'ace',
  synonyms    : ['1', 'one'],
  action      : 'Waterfall',
  explanation : 'Everyone start drinking. No player can stop drinking until the player to their right stops.',
  counter     : 4
}, {
  value       : 'two',
  synonyms    : ['2'],
  action      : 'You',
  explanation : 'Choose a player to take a drink.',
  counter     : 4
}, {
  value       : 'three',
  synonyms    : ['3'],
  action      : 'Me',
  explanation : 'You get to take a drink.',
  counter     : 4
}, {
  value       : 'four',
  synonyms    : ['4'],
  action      : 'Floor',
  explanation : 'The last person to touch the floor has to drink.',
  counter     : 4
}, {
  value       : 'five',
  synonyms    : ['5'],
  action      : 'Guys',
  explanation : 'All guys drink.',
  counter     : 4
}, {
  value       : 'six',
  synonyms    : ['6'],
  action      : 'Chicks',
  explanation : 'All girls drink.',
  counter     : 4
}, {
  value       : 'seven',
  synonyms    : ['7'],
  action      : 'Heaven',
  explanation : 'The last person to point to the ceiling has to drink.',
  counter     : 4
}, {
  value       : 'eight',
  synonyms    : ['8'],
  action      : 'Mate',
  explanation : 'Choose a person to be your mate. They drink whenever you drink for the rest of the game.',
  counter     : 4
}, {
  value       : 'nine',
  synonyms    : ['9'],
  action      : 'Rhyme',
  explanation : 'Choose a word, then go around in a circle saying words that rhyme with the initial word. The first person who can\'t think of a word, or repeats a word, must drink.',
  counter     : 4
}, {
  value       : 'ten',
  synonyms    : ['10'],
  action      : 'Categories',
  explanation : 'Think of a category of things, then go around in a circle saying things belonging to that category. The first person who can\'t think of an item, or repeats an item, must drink.',
  counter     : 4
}, {
  value       : 'jack',
  synonyms    : ['11', 'eleven'],
  action      : 'Never have I ever',
  explanation : 'Every player starts with three fingers up. Go around in a circle making "Never Have I Ever" statements. The first person to run out of fingers has to drink.',
  counter     : 4
}, {
  value       : 'queen',
  synonyms    : ['12', 'twelve'],
  action      : 'You are now the question master! If anyone asks you a question, they must drink.',
  explanation : 'This continues until the end of the game, or until another player draws a queen.',
  counter     : 4
}, {
  value       : 'king',
  synonyms    : ['13', 'thirteen'],
  action      : 'You are now the ruler of the land! If there was a previous king, they have been dethroned. Make a new rule as king. If anyone breaks the rule, they must drink.',
  explanation : 'This can be anything you\'d like, and the rule applies until the end of the game or until another player makes a different rule.',
  counter     : 4
}];

/**
* Choose a card from the remaining cards in our deck
* @return {String} message to the user
*/
const chooseCard = function() {
  // choose a type of card from our remaining deck
  const cardTypeIndex = parseInt(Math.random() * remainingCards.length);
  const chosenIndex   = remainingCards[cardTypeIndex];
  const card          = deck[chosenIndex];

  // decrement our counter
  card.counter = card.counter - 1;

  // if there are none remaining of this card, remove it from our possible selections
  if (card.counter === 0)
    remainingCards.splice(cardTypeIndex, 1);

  return 'Your card is: ' + card.value + ', ' + card.action + '.';
};

/**
* Choose a card from the remaining cards in our deck
* @return {String} message to the user
*/
const resetDeck = function() {
  // reset our array tracking remaining cards and reset to our full deck
  remainingCards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  deck.forEach((card) => {
    card.counter = 4;
  });

  return 'The deck has been reset! Ask me for your first card when you\'re ready.';
};

/**
* Choose a card from the remaining cards in our deck
* @param {String} value - card to explain
* @return {String} message to the user
*/
const explainCard = function(value) {
  // get the card to explain based on value
  let card = deck.filter((card) => card.value === value)[0];

  // if there's no card, check possible synonyms
  if (!card) {
    card = deck.filter((card) => {
      let isMatch = false;
      card.synonyms.forEach((synonym) => {
        if (synonym === value)
          isMatch = true;
      })
      return isMatch;
    })[0];
  }

  // if no synonyms match, return error message
  if (!card)
    return 'No cards match your query. Please try again.';

  // craft explanation
  return card.action + '. ' + card.explanation;
};

// handlers for each intent
const handlers = {
  'LaunchRequest': function() {
    this.emit(':tell', messages.welcome);
  },
  'IntentRequest': function() {
    this.emit('playKingsIntent');
  },
  'SessionEndedRequest': function() {
    this.emit(':tell', messages.stop);
  },
  'playKingsIntent' : function() {
    if (remainingCards.length === 0)
      this.emit(':tell', 'Game over! We are out of cards. If there is a middle cup, it\'s time to drink! If you would like to play again say, "new game"');
    else
      this.emit(':tell', chooseCard());
  },
  'newGameIntent' : function() {
    this.emit(':tell', resetDeck());
  },
  'getExplanationIntent' : function() {
    this.emit(':tell', explainCard(this.event.request.intent.slots.card.value));
  },
  'AMAZON.HelpIntent': function() {
    this.emit(':ask', messages.help, messages.ask);
  },
  'AMAZON.CancelIntent': function() {
    this.emit(':tell', messages.stop);
  },
  'AMAZON.StopIntent': function() {
    this.emit(':tell', messages.stop);
  },
};

// entry point
exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);

  // make sure application ID matches
  if (event.session.application.applicationId !== APP_ID) {
      throw new Error('Invalid Application ID');
  }

  alexa.registerHandlers(handlers);
  alexa.execute();
};
