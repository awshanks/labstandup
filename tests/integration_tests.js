var test = require('tape');
var lambdaLocal = require('lambda-local');
var winston = require('winston');

var lambdasPath = '../';

function testLocalLambda(func, event, cb) {
    var lambdaFunc = require(func);
    var lambdaEvent = require(event);
    winston.level = 'none'; //'error' //'debug', 'info'
    lambdaLocal.setLogger(winston);
    lambdaLocal.execute({
        event: lambdaEvent,
        lambdaFunc: lambdaFunc,
        lambdaHandler: 'handler',
        callbackWaitsForEmptyEventLoop: false,
        timeoutMs: 5000,
        mute: true,
        callback: cb
    });
}

test('call_lambda_integeration', function (t) {

    testLocalLambda(lambdasPath + 'index.js', lambdasPath + 'tests/sampleevents/event.js',
        function (_err, _data) {
            err = _err;
            json = _data;

            console.log("JSON" + JSON.stringify(json));

            t.end()
        });
});