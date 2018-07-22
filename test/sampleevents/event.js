module.exports = {
    "version": "1.0",
    "session": {
        "new": true,
        "sessionId": "amzn1.echo-api.session.a9f37de0-62a2-4305-809f-491f5b26e2b3",
        "application": {
            "applicationId": process.env.amazonApplicationId
        },
        "user": {
            "userId": process.env.amazonAskAccountUserId
        }
    },
    "context": {
        "System": {
            "application": {
                "applicationId": process.env.amazonApplicationId
            },
            "user": {
                "userId": process.env.amazonAskAccountUserId
            },
            "device": {
                "deviceId": process.env.amazonDeviceId,
                "supportedInterfaces": {}
            },
            "apiEndpoint": "https://api.eu.amazonalexa.com",
            "apiAccessToken": process.env.amazonAPIAccessToken
        }
    },
    "request": {
        "type": "IntentRequest",
        "requestId": "amzn1.echo-api.request.b516d8c2-a9cb-40b3-85ec-c862516a14c0",
        "timestamp": "2018-07-20T16:57:18Z",
        "locale": "en-GB",
        "intent": {
            "name": "NextPresenterIntent",
            "confirmationStatus": "NONE"
        }
    }
};