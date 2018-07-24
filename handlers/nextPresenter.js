'use strict';
const awsSDK = require('aws-sdk');
const promisify = require('es6-promisify');
const docClient = new awsSDK.DynamoDB.DocumentClient();

//database table name
const nameList = 'nameList';

//promisify database commands
const dbScan = promisify(docClient.scan, docClient);
const dbUpdate = promisify(docClient.update, docClient);

const nextPresenter = {
    'NextPresenterIntent'() {

        let nextPresentersName;
        let outputMessage;

        const dynamoParams = {
            TableName: nameList
        };
        let output;

        let namesLeft = [];

        let numberToIncrease;

        dbScan(dynamoParams)
            .then(data => {

                if (data.Items && data.Items.length) {
                    //find the different values of timeschosen in the array
                    var times = [];

                    let unique = [...new Set(data.Items.map(item => item.timeschosen))];

                    if(unique && unique.length > 1) {
                        //get the min number
                        const smallestNumber =  Math.min(...unique);
                        numberToIncrease = smallestNumber;

                        data.Items.forEach(item => {
                            if (item.timeschosen === smallestNumber) {
                                namesLeft.push(item.name);
                            }
                        });

                        if (namesLeft && namesLeft.length > 0) {
                            nextPresentersName = namesLeft[Math.floor(Math.random() * namesLeft.length)];
                            outputMessage = this.t("NEXT_PRESENTER_MESSAGE") + nextPresentersName;
                        }
                        else {
                            output = 'No names found, try again';
                        }
                    }
                    else {
                        //everyone has been chosen the same number of times, so just use the full list
                        if (data.Items.length > 0) {

                            numberToIncrease = data.Items[0].timeschosen;
                            nextPresentersName = data.Items[Math.floor(Math.random() * data.Items.length)].name;
                            outputMessage = this.t("NEXT_PRESENTER_MESSAGE") + nextPresentersName;
                        }
                        else {
                            output = 'No names found, try again';
                        }
                    }
                }
                else {
                    output = 'No names found, try again';
                }
            })
            .then(() => {
                if (output !== 'No names found, try again') {

                    numberToIncrease += 1;

                    //write back to table that the person has already been chosen (true)
                    var params = {
                        TableName: nameList,
                        Key: {
                            "name": nextPresentersName,
                        },
                        UpdateExpression: "set timeschosen = :n",
                        ExpressionAttributeValues: {
                            ":n": numberToIncrease,
                        },
                        ReturnValues: "UPDATED_NEW"
                    };

                    dbUpdate(params)
                        .then(() => {
                            //success output the next speaker name
                            this.emit(':tellWithCard', outputMessage, this.t("SKILL_NAME"), outputMessage);
                        })
                        .catch(err => {
                            console.log("update failure", err);
                        });
                }
                else {
                    //inform the user there are no unchosen presenters left and reset
                    outputMessage = this.t(output);
                    this.emit(':tellWithCard', outputMessage, this.t("SKILL_NAME"), outputMessage);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }
};

module.exports = nextPresenter;