"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SynchronizationService_1 = require("./typings/SynchronizationService");
var mongodb_1 = require("mongodb");
var util_1 = require("util");
var port = 3001;
var mongoClient = new mongodb_1.MongoClient("mongodb://localhost:27017/", {
    useNewUrlParser: true
});
var dbName = "syncDb";
var collectionName = "SyncCollection";
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json({ limit: '50mb' }));
mongoClient.connect().then(function (x) {
    var db = x.db(dbName);
    var collection = db.collection(collectionName);
    var syncService = new SynchronizationService_1.SynchronizationService(collection);
    app.post('/sync', function (req, response) {
        syncService.TrySync(req.body).then(function (x) {
            var data = JSON.stringify(x);
            response.end(data);
        }).catch(function (x) { return util_1.log(x); });
    });
    app.get('/get', function (req, response) {
        var someid = "";
        syncService.GetData(someid).then(function (z) {
            var data = JSON.stringify(z);
            response.end(data);
        }).catch(function (x) { return util_1.log(x); });
    });
    app.listen(port);
}).catch(function (x) {
    if (mongoClient.isConnected()) {
        mongoClient.close();
        mongoClient.connect();
    }
});
//# sourceMappingURL=server.js.map