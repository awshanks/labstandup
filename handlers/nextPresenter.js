'use strict';
const awsSDK = require('aws-sdk');
const promisify = require('es6-promisify');
const docClient = new awsSDK.DynamoDB.DocumentClient();

//database table name
const nameList = 'nameList';

//promisify database commands
const dbScan = promisify(docClient.scan, docClient);
const dbUpdate = promisify(docClient.update, docClient);
// const dbPut = promisify(docClient.put, docClient);
// const dbGet = promisify(docClient.get, docClient);
// const dbDelete = promisify(docClient.delete, docClient);

const nextPresenter = {
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
                    else {
                        output = 'No names found, try again or reset name list';
                    }
                }
                else {
                    output = 'No names found, try again or reset name list';
                }
            })
            .then(result => {
                if (output !== 'No names found, try again or reset name list') {

                    //write back to table that the person has already been chosen (true)
                    var params = {
                        TableName: nameList,
                        Key: {
                            "name": nextPresentersName,
                        },
                        UpdateExpression: "set chosen = :c",
                        ExpressionAttributeValues: {
                            ":c": true,
                        },
                        ReturnValues: "UPDATED_NEW"
                    };

                    console.log("heres the input", params);

                    dbUpdate(params)
                        .then(data => {
                            //success output the next speaker name
                            console.log("UP success", data);
                            this.emit(':tellWithCard', outputMessage, this.t("SKILL_NAME"), outputMessage);
                        })
                        .catch(err => {
                            console.log(params);
                            console.log("UP failure", err);
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