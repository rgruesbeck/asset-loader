// create image from data uri
const createBase64Image = (dataUri) => {
    return [dataUri]
    .map(uri => {
        let image = new Image();
        image.src = uri;
        return image;
    }).reduce(img => img);
}

export {
    createBase64Image
}