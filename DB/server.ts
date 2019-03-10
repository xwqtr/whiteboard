import {SynchronizationService } from './typings/SynchronizationService';
import { MongoClient, Db, Collection} from 'mongodb';
import { Server } from 'http';
import { Guid } from './typings/guid';
import { SyncData } from './typings/SyncData';
const port = 3001;
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
const dbName = "syncDb";
const collectionName = "SyncCollection";
mongoClient.connect().then(x=> {
    const db: Db = x.db(dbName);
    const collection: Collection<SyncData> = db.collection(collectionName);
    const syncService = new SynchronizationService(collection);
    var srv = new Server((request, response)=>
    {
       if(request.url.startsWith("/sync"))
       {
           ///IMPLEMENT Reading Of props
            var asd: SyncData = {Id:null, Data:"asdasd", Time : Date.now()  }
            syncService.TrySync(asd).then(x => {
                response.end();
            });
       }
       if(request.url.startsWith("/get"))
       {
           ///IMPLEMENT Reading Of props
            const someid = "";
            syncService.GetData(someid).then(z=>{
            response.setHeader("Content-Type", "application/json");
            response.end(z);
        });
       }
        
        
        
    });
    srv.listen(port);
}).catch(x=> {
    if(mongoClient.isConnected())
    {
        mongoClient.close();
        mongoClient.connect();
    }
});










