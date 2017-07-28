/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This skill allows our user to play kings
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.e77444e5-1d0f-41f0-b891-cf2f974f2985';

const messages = {
    welcome : 'Welcome to Kings! Ask me for your first card when you\'re ready.',
    stop    : 'Thanks for playing! Goodbye!',
    help    : 'You can ask me to draw a card, or about what a card can do',
    ask     : 'Would you like a card?'
};

const welcomeMessage = 'Thanks for playing! Goodbye!';
const stopMessage = 'Thanks for playing! Goodbye!';
const helpMessage = 'You can ask me to draw a card, or about what a card can do';
const askMessage = 'Would you like a card?';

const handlers = {
    'LaunchRequest': function () {
        // this.emit('PlayKings');
        this.emit(':tell', welcomeMessage);
    },
    'playKings' : function() {
        this.emit(':tell', 'in play kings');
    },
    'newGame' : function() {
        this.emit(':tell', 'in new game');
    },
    'getExplanation' : function() {
        this.emit(':tell', 'in get explanation');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', helpMessage, askMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', stopMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', stopMessage);
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
