**Lab Stand Up**

This AWS lambda function proved the name of person to host the next lab / team stand up and is invoked by an Alexa Skill with the following utterances:

"who's turn is it next"
"who will take tomorrow's stand up"
"who will be the next presenter"

**DynamoDB**

You will need to install the aws-cli to make batch updates to the table.
See https://docs.aws.amazon.com/cli/latest/userguide/cli-install-macos.html#install-bundle-macos-os-prereq for details on how to install and configure the aws-cli.

Then configure: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html

To load the database upload via aws console with the following .json format (example file included in this repo)


`{
  "nameList": [
    {
      "PutRequest": {
        "Item": {
          "name": {
            "S": "Name One"
          },
          "timeschosen": {
            "N": "0"
          }
        }
      }
    }
  ]
}`

Run the below command from the folder where the file containing the names is:

`aws dynamodb batch-write-item --request-items file://DATA_TO_LOAD.json`

This will load the Items in the json file to the table name (defined as the name of the array).
