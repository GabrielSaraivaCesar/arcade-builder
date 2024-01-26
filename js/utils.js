function readImage(file) {
    return new Promise(resolve => {
        let reader = new FileReader();
        reader.onloadend = function() {
            resolve(reader.result);
        }
        reader.readAsDataURL(file);
    })
}

function readTextFile(file) {
    return new Promise(resolve => {
        let reader = new FileReader();
        reader.onloadend = function() {
            resolve(reader.result);
        }
        reader.readAsText(file);
    })
}