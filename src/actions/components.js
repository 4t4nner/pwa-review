
export const collapseOpen = id => (dispatch) => {
    console.log('Action:collapseOpen; [id,dispatch]: ',[id,dispatch])
    dispatch(
        {type:'COLLAPSE_OPEN',id}
    )
}

export const lightboxOpen = (images, checkinMd5) => (dispatch) => {
    console.log('Action:lightboxOpen; [images,checkinMd5]: ', [images, checkinMd5])
    dispatch({
        type: 'LIGHTBOX_OPEN',
        images,
        checkinMd5,
    })
}

export const lightboxClose = () => (dispatch) => {
    dispatch({type: 'LIGHTBOX_CLOSE',})
}
