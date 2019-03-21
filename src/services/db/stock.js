import Db from './index'
import Entity from './entity'

export default function Stock() {
    Db.call(this)


    this.firstUpdate = (updateDB) => {
        console.log('store_firstUpdate', updateDB)
        switch (updateDB.oldVersion) {
            case 0: {
                updateDB.createObjectStore('users')
                updateDB.createObjectStore('order')
                updateDB.createObjectStore('service')

                const checkinStorage = updateDB.createObjectStore('checkin'),
                    uploadTask = updateDB.createObjectStore('uploadTask')
                uploadTask.createIndex('tag', 'tag', {unique: true})
                checkinStorage.createIndex('typeCode', 'typeCode', {unique: false})
                checkinStorage.createIndex('order', 'order', {unique: false})
                checkinStorage.createIndex('datePlanned', 'datePlanned', {unique: false})
                checkinStorage.createIndex('datePlanned,typeCode,id', ['datePlanned','typeCode','id'], {unique: false})

                updateDB.createObjectStore('app')
                updateDB.createObjectStore('entities')
            }
            // case 1:{
            // }
        }

    }

    /**
     *
     * @param task = {tag,url,data}
     * @returns {*}
     */
    this.addUploadTask = (task) => this.dbPromise.then((db) => {
        return db.transaction('uploadTask', 'readwrite')
            .objectStore('uploadTask')
            .add(task)
    })
    this.cleanUploadTask = (tag) => this.dbPromise.then((db) => {
        return db.transaction('uploadTask', 'readwrite')
            .objectStore('uploadTask')
            .index('tag')
            .delete(IDBKeyRange.only(tag))
            .catch(e => console.log('cleanUploadTask_Error',e))
    })
    this.getUploadTask = (tag) => this.dbPromise.then((db) => {
        return db.transaction('uploadTask', 'read')
            .objectStore('uploadTask')
            .index('tag')
            .delete(IDBKeyRange.only(tag))
            .catch(e => console.log('cleanUploadTask_Error',e))
    })
    // this.fetchUploadTasks = () => this.dbPromise.then((db) => {
    //     let storage = db.transaction('uploadTask', 'readwrite')
    //         .objectStore('uploadTask');
    //     return storage
    //         .getAll()
    //         .then(tasks => {tasks.map(t => )})
    //         .delete(IDBKeyRange.only(tag))
    //         .catch(e => console.log('cleanUploadTask_Error',e))
    // })

    this.getCheckinList = (from = false,to = false,type = false) => this.dbPromise.then((db) => {
        [from, to] = [from, to].map(date =>
            (
                (date instanceof Date)
                || (typeof date === 'string'
                    && (date = new Date(date))
                )
                    ? date
                    : false
            )
        )

        let s = db.transaction('checkin').objectStore('checkin'),
            range,
            i,
            isDate = !!from || !!to;


        if(!(isDate || type)) return s.getAll();

        if(isDate) {
            range = from && to
                    ? IDBKeyRange.bound(from, to)
                    : (from
                        ? IDBKeyRange.lowerBound(from)
                        : IDBKeyRange.upperBound(to)
                    );
            i = s.index('datePlanned');

            return type
                ? i.getAll(range)
                    .then(checkinList =>
                        checkinList.filter(
                            checkin => (checkin.typeCode === type)
                        )
                    )
                :  i.getAll(range)
        }

        return s.index('typeCode').getAll(IDBKeyRange.only(type))
    })

    this.getAllKeys = (async function (storageName, range = null) {
        try {
            return await (await this.dbPromise)
                .transaction(storageName, 'readwrite')
                .objectStore(storageName)
                .getAllKeys(range)
                .catch((e) => {
                    console.log('getAllKeys_e', e)
                    return []
                })
        } catch (e) {
            console.log('getAllKeys_e', e)
        }
    }).bind(this)

    this.updateStorage = async function (storageName, dataList) {

        const entity = new Entity(storageName)

        try {
            const allKeys = new Set(await this.getAllKeys(
                storageName,
                entity.getRange(Object.keys(dataList))
            ))

            let tx = (await this.dbPromise)
                .transaction(storageName, 'readwrite')


            return Promise.all(
                Object.keys(dataList).map(
                    (key) => tx.objectStore(storageName)[allKeys.has(key) ? 'put' : 'add'](
                        entity.isContains
                            ? entity.handle(dataList[key])
                            : dataList[key],
                        entity.isNumber ? Number(key) : key
                    )
                )
            ).then(function () {
                return tx.complete
            }).catch((e) => {
                tx.abort()
                console.log('updateStorage_onPromiseError', e)
            })
        } catch (e) {
            console.log('after_allKeys2', e)
        }
    }.bind(this)


    /**
     *
     * @param {Object} stock = {
     *     order: [
     *         id1: {order1},
     *         ...,
     *     ],
     *     checkin: ...,
     *     point: ...,
     *     ...
     * }
     * @returns {*}
     */
    this.updateStock = (stock) => Promise
        .all(
            ['order', 'checkin', 'point', 'service', 'entities', 'users']
                .filter((storeName) => storeName in stock)
                .map((storeName) => this.updateStorage(
                    storeName,
                    stock[storeName]
                ))
        )
        .then(() => this.set('app', 'storageLoaded', true))
        .then(() => 'SUCCESS')
        .catch((e) => {
            console.log(e)
            return 'FAILED'
        })

    /**
     * get orders with it checkins
     * @param f
     * @returns {Q.Promise<any> | * | Promise<T | never>}
     */
    this.getFiltered = (f) => this.dbPromise.then(async db => {

        let
            orderList = {},
            checkinTypes = {},
            orderCheckins = {},
            maxOrder = 0,
            minOrder = Infinity,
            users = {},
            orderIdSet = new Set()


        await Promise.all([
            this.getCheckinList(f.from, f.to, f.type),
            this.get('entities', 'checkin').then(checkin => {
                Object.keys(checkin.typeList).map((typeCode) => {
                    checkin.typeList[typeCode].count = 0
                })
                return checkin.typeList
            }),
            this.getAll('users').then(uList => {
                let uId;
                for(uId in uList){
                    uList[uId] = {
                        id: uList[uId].id,
                        fio: uList[uId].fio,
                    }
                }
                return uList;
            }),
        ]).then(([checkinList, checkinDBTypes,dbUsers]) => {
            checkinTypes = checkinDBTypes;
            users = dbUsers;
            checkinList.map(c => {
                c.performer = users[c.performer] ? users[c.performer] : c.performer;
                if (!orderCheckins.hasOwnProperty(c.order)) {
                    orderCheckins[c.order] = []
                }

                checkinTypes[c.typeCode].count++
                orderCheckins[c.order].push(c) // ссылка на объект
                orderIdSet.add(c.order);

                if (maxOrder < c.order) maxOrder = c.order
                if (minOrder > c.order) minOrder = c.order
            })
        })


        if (orderIdSet.size) {
            if (minOrder > maxOrder) {
                console.log('getFiltered_error_minOrder > maxOrder (i, range,minOrder,maxOrder)', orderCheckins, checkinTypes, minOrder, maxOrder)
                return false
            }


            await (Promise.all([
                db.transaction('order').objectStore('order')
                    .getAll(IDBKeyRange.bound(minOrder, maxOrder)),
                this.getAll('service'),
            ]).then(([orders, services]) => {
                orders
                    .filter(order => orderIdSet.has(order.id))
                    .map(o => {
                    o.serviceList = {}
                    o.services.map(sId => {
                        o.serviceList[sId] = {
                            name: services[sId].name,
                            price: services[sId].tariff[o.tariffCode],
                        }
                    })
                    delete o.services
                    o.checkinList = orderCheckins[o.id]
                    o.owner = users[o.owner]
                    o.payer = users[o.payer]
                    orderList[o.id] = o
                })
            }))
        }

        return {
            orders: orderList,
            checkinTypes
        }
    }).catch((e) => {
        console.log('getFiltered_error', e)
        return false
    })

    this.setApp = (app) => this.dbPromise.then(db => {
        let tx = db.transaction('app', 'readwrite'),
            store = tx.objectStore('app')

        return store.getAllKeys().then((appKeys = []) => {
            appKeys = new Set(appKeys)
            return Promise.all(
                Object.keys(app).map((key) => {
                    return appKeys.has(key)
                        ? store.put(app[key], key)
                        : store.add(app[key], key)
                })
            )
        }).catch((e) => {
            console.log('setUser_err', e)
        })
    })
}

export const getApp = (...params) => (new Stock()).getAll('app', ...params)
export const setApp = (app) => (new Stock()).setApp(app)
export const setStock = (stock) => (new Stock()).updateStock(stock)
export const getStock = (filter) => (new Stock()).getFiltered(filter)
export const isLoaded = () => (new Stock())
    .get('app', 'storageLoaded')
    .then(res => !!res)
    .catch(e => {
        console.log('isLoaded_error',e)
        return false
    })
