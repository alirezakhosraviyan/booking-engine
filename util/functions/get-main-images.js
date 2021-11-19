export default (images) => {
    let result = { main: null, other: [] }
    for (let image of images) {
        if (image.caption == 'main')
            result.main = image
        else
            result.other.push(image)
    }
    return result
}