
export const dataURItoBlob = (dataURI) => {
    let byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}

export const getCanvasPreview = (file) => {
    let canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        image = new Image(),
        promise = new Promise((res,rej) => {
            image.addEventListener('load',(e) => {

                console.log('image.addEventListener',image);
                let previewWidth = 145, // ширина превью
                    previewHeight = 145, // высота превью
                    imgWidth = image.naturalWidth,
                    imgHeight = image.naturalHeight,
                    scaleX = (imgWidth > previewWidth) ? (previewWidth / imgWidth) : 1,
                    scaleY = (imgHeight > previewHeight) ? (previewHeight / imgHeight) : 1,
                    scale = (scaleX >= scaleY) ? scaleX : scaleY,
                    sx = 0,
                    sy = 0
                ;

                if (scale < 1) {
                    imgHeight = imgHeight * scale;
                    imgWidth = imgWidth * scale;
                }
                if (imgHeight > previewHeight) {
                    sy = -(imgHeight - previewHeight) / 2;
                }
                if (imgWidth > previewWidth) {
                    sx = -(imgWidth - previewWidth) / 2;
                }

                ctx.drawImage(image, sx, sy, imgWidth, imgHeight);

                console.log('image.onload',{ctx,sx, sy, imgWidth, imgHeight});

                res(canvas.toDataURL())
                URL.revokeObjectURL(image.src);
            })
        })
    ;
    canvas.width = 145;
    canvas.height = 145;
    image.src = URL.createObjectURL(file);


    console.log('getCanvasPreview__END');

    return promise;
}
