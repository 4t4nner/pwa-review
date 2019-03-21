
const initialState = {
    Collapse: {
        isOpen: false,
        id: '',
    },
    lightbox: {
        isOpen: false,
        images: [],
        checkinMd5: false,
    },
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'COLLAPSE_OPEN':{
            console.log(action.type);
            return Object.assign({},state, {
                Collapse: Object.assign({},state.Collapse,{isOpen: true,id:action.id})})
        }
        case 'COLLAPSE_CLOSE':{
            console.log(action.type);
            return Object.assign({},state, {
                Collapse: Object.assign({},state.Collapse,{isOpen: false})})
        }
        case 'LIGHTBOX_OPEN':{
            console.log(action.type);
            return Object.assign({},state, {
                lightbox: Object.assign({},state.lightbox,{isOpen: true,images:action.images,checkinMd5:action.checkinMd5})})
        }
        case 'LIGHTBOX_CLOSE':{
            console.log(action.type);
            return Object.assign({},state, {
                lightbox: Object.assign({},state.lightbox,{isOpen: false})})
        }
        default:
            return state
    }
}
