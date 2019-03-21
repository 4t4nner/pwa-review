import {openDb} from 'idb';

export default function () {
    const _this = this

    this.version = 1

    this.firstUpdate = (updateDB) => {
        updateDB.createObjectStore('app');
    }

    this.dbPromise = openDb('impocar', this.version, updateDB => {
        console.log('dbPromise_openDb');
        _this.firstUpdate(updateDB);
    });


    this.set = (storageName,key,val) => this.dbPromise.then(db => {
        const store = db.transaction(storageName, 'readwrite').objectStore(storageName)

        return store.getKey(IDBKeyRange.only(key))
            .then((dbStatus) => store[dbStatus ? 'put' : 'add'](val, key))
            .catch((e) => console.log('db_set_error', e))
    })

    this.getAll = (storageName, ...params) => this.dbPromise.then((db) => {
        const store = db.transaction(storageName, 'readonly').objectStore(storageName)

        return Promise
            .all([
                store.getAllKeys(...params),
                store.getAll(...params)
            ])
            .then(([keys, values]) => {
                let r = {}

                for (let i = 0; i < keys.length; i++) {
                    r[keys[i]] = values[i]
                }

                return r
            })
            .catch((e) => {
                console.log('getApp_err', e)
                return {}
            })
    })

    this.get = (storageName,key) => this.dbPromise.then(db => db
        .transaction(storageName, 'readonly')
        .objectStore(storageName)
        .get(key)
        .catch((e) => {
            console.log('get_err', e)
            return false;
        })
    )
}