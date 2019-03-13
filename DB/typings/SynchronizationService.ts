import {
    MongoClient
} from '../node_modules/mongodb'
import {
    SyncData
} from './SyncData'
import {
    Guid
} from './guid'
import { Collection } from 'mongodb';
export class SynchronizationService {


    private readonly _dbSyncData: Collection<SyncData>;
    constructor(data: Collection<SyncData>) {
        this._dbSyncData = data;

    }
    public async TrySync(syncData: SyncData): Promise<SyncData> {
        if (syncData.Id != null && syncData.Id != '') {
            return await this.syncData(syncData);
        }
        this.insertNewSession(syncData);
        return Promise.resolve(syncData);
    }


    private async insertNewSession(syncData: SyncData): Promise<SyncData> {
        let newId = Guid.newGuid();
        syncData.Id = newId;
        syncData.Time = Date.now();


        await this._dbSyncData.insertOne(syncData, (err, result) => {

            if (err) {
                console.log(err)
                return null;
            }
            console.log(result.ops);

        });

        return syncData;
    }

    public GetData(Id: string): Promise<SyncData> {
        return this._dbSyncData.findOne({ Id: Id });
    }
    private async syncData(syncData: SyncData): Promise<SyncData> {
        const data: SyncData = {
            Id: syncData.Id,
            Time: Date.now(),
            Data: syncData.Data
        }
        this._dbSyncData.findOneAndUpdate({ Id: data.Id }, { $set: { Time: data.Time, Data: data.Data } });
        return data;
    }


}
