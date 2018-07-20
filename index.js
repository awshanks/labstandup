'use strict';
const alexaSDK = require('alexa-sdk');
const APP_ID = process.env.APP_ID;

//import handlers
const nextPresenter = require('./handlers/nextPresenter');
//import voice strings
const languageStrings = require('./languageStrings/languageStrings');

const handlers = {
    'Unhandled'() {
        console.error('problem', this.event);
        this.emit(':ask', 'An unhandled problem occurred!');
    },
    'AMAZON.HelpIntent'() {
        const speechOutput = this.t("HELP_MESSAGE");
        const reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent'() {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.StopIntent'() {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};


exports.handler = function handler(event, context) {
    const alexa = alexaSDK.handler(event, context);
    alexa.appId = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers, nextPresenter);
    alexa.execute();
};