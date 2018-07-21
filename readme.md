**Lab Stand Up**

This AWS lambda function proved the name of person to host the next lab / team stand up and is invoked by an Alexa Skill with the following utterances:

"who's turn is it next"
"who will take tomorrows stand up"
"who will be the next presenter"

**DynamoDB**

To load the database upload via aws console with the following .json format (example file included in this repo)
`aws dynamodb batch-write-item --request-items file://DATA_TO_LOAD.json`

This will load the Items in the json file to the table name (defined as the name of the array).