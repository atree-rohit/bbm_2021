function capitalizeWords(string){
    let arr = string.split(" ").map((w) => capitalizeWord(w))
    return arr.join(" ")
}

function capitalizeWord(string){
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export {
    capitalizeWords
}