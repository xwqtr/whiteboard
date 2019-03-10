"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SynchronizationService_1 = require("./typings/SynchronizationService");
var mongodb_1 = require("mongodb");
var http_1 = require("http");
var port = 3001;
var mongoClient = new mongodb_1.MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
var dbName = "syncDb";
var collectionName = "SyncCollection";
mongoClient.connect().then(function (x) {
    var db = x.db(dbName);
    var collection = db.collection(collectionName);
    var syncService = new SynchronizationService_1.SynchronizationService(collection);
    var srv = new http_1.Server(function (request, response) {
        if (request.url.startsWith("/sync")) {
            ///IMPLEMENT Reading Of props
            var asd = { Id: null, Data: "asdasd", Time: Date.now() };
            syncService.TrySync(asd).then(function (x) {
                response.end();
            });
        }
        if (request.url.startsWith("/get")) {
            ///IMPLEMENT Reading Of props
            var someid = "";
            syncService.GetData(someid).then(function (z) {
                response.setHeader("Content-Type", "application/json");
                response.end(z);
            });
        }
    });
    srv.listen(port);
}).catch(function (x) {
    if (mongoClient.isConnected()) {
        mongoClient.close();
        mongoClient.connect();
    }
});
//# sourceMappingURL=server.js.map