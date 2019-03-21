

const initialState = {

    filter: {
        time: 'all', // tomorrow, today
        from: false,
        to: false,
        type: false,
    },
    orders: [],
    loaded:false,
    checkinTypes: {},

    checkinModal: false,
    checkinModalOpen: false,
    photoError: false,
    photoInfo: false,
    // points: [],
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_SUCCESS':{
            console.log(action.type)
            return Object.assign({},state, {
                orders: action.orders,
                checkinTypes: action.checkinTypes,
                loaded: true,
                error: false
            })
        }
        case 'SET_FILTER_SUCCESS':{
            console.log(action.type,action);
            return Object.assign({},state,
                {
                    filter: Object.assign({},
                        initialState.filter,
                        action.filter
                    ),
                    orders: action.orders,
                    checkinTypes: action.checkinTypes,
                },
            )
        }

        case 'CANCEL_EDIT_CHECKIN_SUCCESS': {
            console.log(action.type)
            return Object.assign({}, state, {
                checkinModal: false,
                checkinModalOpen: false,
            })
        }
        case 'CLOSE_CHECKIN_MODAL': {
            console.log(action.type)
            return Object.assign({}, state, {
                ...(action.close ? {checkinModal: false} : {}),
                checkinModalOpen: false,
            })
        }
        case 'OPEN_CHECKIN_MODAL':{
            console.log(action.type);
            return Object.assign({},state,
                {
                    checkinModal: action.checkin,
                    checkinModalOpen : true,
                })
        }
        case 'COMMIT_CHECKIN_SUCCESS':{
            console.log(action.type);
            return Object.assign({},state,
                {
                    checkinModal: false,
                    checkinModalOpen : false,
                })
        }
        case 'COMMIT_CHECKIN_FAILED':{
            console.log(action.type);
            return Object.assign({},state,
                {
                    checkinModal: false,
                    checkinModalOpen : false,
                })
        }
        case 'UPLOAD_PHOTO_FAILED':{
            console.log(action.type);
            return Object.assign({},state, {photoError: true,})
        }
        case 'UPLOAD_PHOTO_SUCCESS':{
            console.log(action.type);
            return Object.assign({},state, {photoError: false,})
        }
        default:
            return state
    }
}
