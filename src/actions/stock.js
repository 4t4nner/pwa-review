import {UpdateStock,UploadPhoto,DeletePhoto,CancelEditCheckin,CommitCheckin} from "../services/appActions"
import {getStock as getDbStock, getApp,isLoaded} from '../services/db/stock'
// import {XDate} from '../services'

export const getStock = (filter = false) => async (dispatch, getState) => {
    try {
        !filter && (filter = getState().storage.filter)
        const userId = getState().app.user.id,
            /**
             * @param data - ignore if not {}
             */
            disp = (data = null) => {
                dispatch(Object.assign({},
                    {type: `LOAD_${!!data ? 'SUCCESS' : 'FAILED'}`},
                    data
                ))
            },
            isStorageLoaded = await isLoaded();

        try{
            if(!filter || !userId){
                console.log('!filter || !userId, (getState():)',getState())
                disp()
                return;
            }
            if (!isStorageLoaded) {
                let res = await (new UpdateStock(dispatch, getState)).fetchApi({userId})

                console.log('!isStorageLoaded_2',res)
                if (!(res)) {
                    console.log('not fetched')
                    disp()
                    return;
                }
            }

            disp(await getDbStock(filter));

        } catch (e) {
            disp()
            console.log('LOAD_FAILED', e)
        }

    } catch (e) {
        console.log(e)
    }
}

export const setFilter = filter => (dispatch, getState) => {
    // check input

    const oldFilter = new Set(Object.keys(getState().storage.filter))
    if(!(Object.keys(filter).every(newKey => oldFilter.has(newKey)))){
        console.log('setFilter: filter key not match :',filter,oldFilter)
        throw new Error()
    }

    filter.from = filter.from ? (new Date(filter.from)) : false;
    filter.to = filter.to ? (new Date(filter.to)) : false;

    return getDbStock(filter)
        .then((stock) => {
            console.log('after_getDbStock');
            dispatch(Object.assign({}, stock,
                {type:'SET_FILTER_SUCCESS'},
                {filter},
                ))
        })
        .catch(e => {
            console.log('SET_FILTER_ERROR', e);
            dispatch({type:'SET_FILTER_FAILED'})
        })
}

/**
 *
 * @param {Object} checkin
 */
export const openCheckinModal = checkin => (dispatch) => {
    console.log(checkin);
    dispatch({type:'OPEN_CHECKIN_MODAL',checkin})
}
/**
 *
 * @param {Boolean} cancel
 * @returns {Function}
 */
export const closeCheckinModal = (cancel = false) => (dispatch) => {
    dispatch({type:'CLOSE_CHECKIN_MODAL',cancel})
}

/**
 * @param {Blob} photo
 * @returns {Function}
 */
export const uploadPhoto = (photo) => (dispatch, getState) => {
    let data = new FormData();
    data.append('photo', photo);

    (new UploadPhoto(dispatch, getState))
        .fetchApi({}, {
            method: 'POST',
            headers: {
                "Content-Type": "multipart/form-data",
            },
            body: data,
            // body: photo
        })
        .catch(e => {
            console.log(e);
        })
}
/**
 * @param {string} fileName
 * @returns {Function}
 */
export const deletePhoto = (fileName) => (dispatch, getState) => {
    (new DeletePhoto(dispatch, getState))
        .fetchApi({fileName})
        .catch(e => {
            console.log(e);
        })
}
export const cancelEditCheckin = () => (dispatch, getState) => {
    (new CancelEditCheckin(dispatch, getState))
        .fetchApi({})
        .catch(e => {
            console.log(e);
        })
}
export const commitCheckin = () => (dispatch, getState) => {
    (new CommitCheckin(dispatch, getState))
        .fetchApi({})
        .catch(e => {
            console.log(e);
        })
}
