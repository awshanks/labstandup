'use strict';

const alexaSDK = require('alexa-sdk');
const awsSDK = require('aws-sdk');
const promisify = require('es6-promisify');
const docClient = new awsSDK.DynamoDB.DocumentClient();
const APP_ID = process.env.APP_ID;

const nameList = 'nameList';
const dbScan = promisify(docClient.scan, docClient);
const dbUpdate = promisify(docClient.update, docClient);

// const dbPut = promisify(docClient.put, docClient);
// const dbGet = promisify(docClient.get, docClient);
// const dbDelete = promisify(docClient.delete, docClient);

const languageStrings = {
    "en": {
        "translation": {
            "SKILL_NAME": "lab stand up",
            "NEXT_PRESENTER_MESSAGE": "The name of the person who will host the next stand up is ",
            "HELP_MESSAGE": "You can say who will be the next presenter, who will take tomorrows standup, whos turn is it next, or, you can say exit... What can I help you with?",
            "HELP_REPROMPT": "What can I help you with?",
            "STOP_MESSAGE": "Goodbye!",
            "NO_PRESENTER_AVAILABLE": "Sorry, I have been unable to find a host for the standup"
        }
    }
};

const handlers = {
    'NextPresenterIntent'() {

        let nextPresentersName;
        let outputMessage;

        const dynamoParams = {
            TableName: nameList
        };
        let output;

        let namesLeft = [];

        dbScan(dynamoParams)
            .then(data => {

                if (data.Items && data.Items.length) {
                    //loop over and create a new array with only persons who have not been chosen already
                    data.Items.forEach(item => {
                        if (!item.chosen) {
                            namesLeft.push(item.name);
                        }
                    });
                    if (namesLeft && namesLeft.length > 0) {
                        nextPresentersName = namesLeft[Math.floor(Math.random() * namesLeft.length)];
                        outputMessage = this.t("NEXT_PRESENTER_MESSAGE") + nextPresentersName;
                    }

                    //write back to table that the person has already been chosen (true)
                    var params = {
                        TableName:nameList,
                        Key: {
                            "name": nextPresentersName[0],
                        },
                        UpdateExpression: "set chosen = :c",
                        ConditionExpression: "name = :name",
                        ExpressionAttributeValues: {
                            ":c":true,
                            "name": nextPresentersName[0]
                        },
                        ReturnValues:"UPDATED_NEW"
                    };

                    console.log("heres the input", params);

                    dbUpdate(params)
                        .then(data => {
                            //success
                            console.log(data);
                        })
                        .catch(err => {
                            console.log(params);
                            console.log(err, "error updating person");
                        });
                }
                else {
                    output = 'No names found, try again or reset name list';
                }
                this.emit(':tellWithCard', outputMessage, this.t("SKILL_NAME"), outputMessage);
            })
            .catch(err => {
                console.error(err);
            });
    },
    'ResetPresentersIntent'() {
        //update all records in the db and set chosen to false
    },
    'AddPresentersIntent'() {
        //add a new presenter
    },
    'RemovePresentersIntent'() {
        //remove a presenter
    },
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
    alexa.registerHandlers(handlers);
    alexa.execute();
};