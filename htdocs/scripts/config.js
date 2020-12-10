/* config.js by maxrt101 */

var config = {
    default: {visited: {}, showDebugConsole: false, allowManyRouteMarkers: false, map: { zoom: 6, center: {lat: 48.72047815236502, lng: 31.53918196250001} }}, // Center of Ukraine map
    session: {},
    loaded: false,

    save: function() {
        if (this.session !== null) {
           window.localStorage.setItem("user_config", JSON.stringify(this.session));
        } else {
            pageLog("WARN: User settings === null! This should not be possible");
        }
    },

    load: function() {
        pageLog("Loading stored user settings");
        var s = window.localStorage.getItem("user_config");
        if (s === null) {
            pageLog("Found none, settings = default");
            this.session = this.default;
        } else {
            this.session = JSON.parse(s);
        }
        this.loaded = true;
    },

    loadIfNotLoaded: function() {
        if (!this.loaded)
            this.load();
    }
};