export default {
    get: function(key: string) {
        return localStorage.getItem(key)
    },
    set: function(key: string, value: string) {
        localStorage.setItem(key, value)
    },
    has: function(key: string) {
        return localStorage.getItem(key) !== null
    },
    remove: function(key: string) {
        localStorage.removeItem(key)
    },
    clear: function() {
        localStorage.clear()
    }
}