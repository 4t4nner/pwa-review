import md5 from 'js-md5';
// constructors for handling types
const toDate = (strDate) => {
    const date = strDate && new Date(strDate)

    return date && (date instanceof Date) && (!isNaN(date.getTime()))
        ? date
        : null
}

const entityKeyTypes = {
    entities : String,
    checkin : Number,
    order : Number,
    users : Number,
}

const entities = {
    checkin: {
        id: Number,
        order: Number,
        checkinDelay: Number,
        dateCreate: toDate,
        datePlanned: toDate,
        dateSuccess: toDate,
    },
    order: {
        id: Number,
        // arraival: toDate,
        // departure: toDate,
    },
    users: {
        id: Number,
    },
};

function Entity(entityName){
    this.isContains = entityName in entities;
    this.isString = entityName in entityKeyTypes && entityKeyTypes[entityName] === String  ;
    this.isNumber = entityName in entityKeyTypes && entityKeyTypes[entityName] === Number  ;

    this.handle = (item) => {
        Object.keys(entities[entityName]).map((key) => {
            item[key] = entities[entityName][key](item[key])
        })

        item.md5Sum = md5(JSON.stringify(item));
        return item;
    }

    this.getRange = (keys) => {
        let min = Infinity, max = -Infinity;

        if(!this.isNumber){
            return null;
        }

        keys.map(key => {
            key = Number(key);
            (min > key) && (min = key);
            (max < key) && (max = key)
        })

        return IDBKeyRange.bound(min, max, false, false)
    }
}

export default Entity;