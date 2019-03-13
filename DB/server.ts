import {
    SynchronizationService
} from './typings/SynchronizationService';
import {
    MongoClient,
    Db,
    Collection
} from 'mongodb';
import {
    SyncData
} from './typings/SyncData';
import {
    log
} from 'util';
const port = 3001;
const mongoClient = new MongoClient("mongodb://localhost:27017/", {
    useNewUrlParser: true
});
const dbName = "syncDb";
const collectionName = "SyncCollection";
const express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json({ limit: '5000mb' }));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '5000mb'
}));
mongoClient.connect().then(x => {

    const db: Db = x.db(dbName);
    const collection: Collection<SyncData> = db.collection(collectionName);
    const syncService = new SynchronizationService(collection);

    app.post('/sync', (req, response) => {
        syncService.TrySync(req.body).then(x => {
            // console.log(x);
            var data = JSON.stringify(x);
            response.end(data);
        }).catch(x => log(x));
    })
    app.post('/get', (req, response) => {
        syncService.GetData(req.body.Id).then(z => {
            console.log(z);
            var data = JSON.stringify(z);
            response.end(data);
        }).catch(x => log(x));
    })
    app.listen(port);

}).catch(x => {
    if (mongoClient.isConnected()) {
        mongoClient.close();
        mongoClient.connect();
    }
});
