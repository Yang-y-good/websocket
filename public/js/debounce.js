function debounce(fn, delay) {
    var timer = null
    return function (...args) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}


export {debounce}