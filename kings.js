/**
* This skill allows our user to play the drinking game, Kings
* Developed by Taylor Wan
* https://github.com/taylorwan
**/

'use strict';

const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.e77444e5-1d0f-41f0-b891-cf2f974f2985';

// default messages to the user
const messages = {
  welcome : 'Welcome to Kings! I hope you all have a drink. Ask me for your first card when you\'re ready.',
  stop    : 'Thanks for playing! Goodbye!',
  help    : 'You can ask me to draw a card, or about what a card can do.',
  ask     : 'Would you like a card?'
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
  explanation : 'Take a drink.',
  counter     : 4
}, {
  value       : 'four',
  synonyms    : ['4'],
  action      : 'Floor',
  explanation : 'The last person to touch the floor drinks.',
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
  explanation : 'The last person to point to the ceiling drinks.',
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
  explanation : 'Choose a word, then go around in a circle saying words word that rhyme with the initial word. The first person who can\'t think of a word or repeats a word must drink.',
  counter     : 4
}, {
  value       : 'ten',
  synonyms    : ['10'],
  action      : 'Categories',
  explanation : 'Think of a category of things, then go around in a circle saying things belonging to that category. The first person who can\'t think of an item or repeats an item must drink.',
  counter     : 4
}, {
  value       : 'jack',
  synonyms    : ['11', 'eleven'],
  action      : 'Never have I ever',
  explanation : 'Every player starts with three fingers up. Go around in a circle making "Never Have I Ever" statements. First person to run out of fingers drinks.',
  counter     : 4
}, {
  value       : 'queen',
  synonyms    : ['12', 'twelve'],
  action      : 'You are now the question master!',
  explanation : 'If anyone answers a question that the question master asks, he or she must drink. This continues until the end of the game, or until another player draws the card.',
  counter     : 4
}, {
  value       : 'king',
  synonyms    : ['13', 'thirteen'],
  action      : 'You get to make a new rule',
  explanation : 'To perform a waterfall, each player starts drinking their beverage at the same time as the person to their left. No player can stop drinking until the player before them stops.',
  counter     : 4
}];

/**
* Choose a card from the remaining cards in our deck
* @return {String} message to the user
*/
const chooseCard = function() {
  // choose a type of card from our remaining deck
  const cardTypeIndex = parseInt(Math.random() * remainingCards.length);
  const chosenIndex = remainingCards[cardTypeIndex];

  // decrement our counter
  const count = deck[chosenIndex].counter;
  deck[chosenIndex].counter = count - 1;

  // if there are none remaining of this card, remove it from our possible selections
  if (deck[chosenIndex].counter === 0)
    remainingCards.splice(cardTypeIndex, 1);

  const card = deck[chosenIndex];
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


const handlers = {
  'LaunchRequest': function () {
    this.emit(':tell', messages.welcome);
  },
  'playKings' : function() {
    if (remainingCards.length === 0) {
      this.emit(':tell', 'We are out of cards! If you would like to play again say, "new game"');
    } else {
      this.emit(':tell', chooseCard());
    }
  },
  'newGame' : function() {
    this.emit(':tell', resetDeck());
  },
  'getExplanation' : function() {
    this.emit(':tell', explainCard(this.event.request.intent.slots.number.value));
  },
  'AMAZON.HelpIntent': function () {
    this.emit(':ask', messages.help, messages.ask);
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', messages.stop);
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', messages.stop);
  },
};

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  if (event.session.application.applicationId !== APP_ID) {
      throw new Error('Invalid Application ID');
  }
  alexa.registerHandlers(handlers);
  alexa.execute();
};
