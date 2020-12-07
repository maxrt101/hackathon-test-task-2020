/* config.js by maxrt101 */

var config = {
    default: {visited: {}, map: { zoom: 8, center: markersData[0].pos }},
    session: {},

    save: function() {
        if (this.session !== null) {
           window.localStorage.setItem("user_config", JSON.stringify(this.session));
        } else {
            page_log("WARN: User settings === null! This should not be possible");
        }
    },

    load: function() {
        page_log("Loading stored user settings");
        var s = window.localStorage.getItem("user_config");
        if (s === null) {
            page_log("Found none, settings = default");
            this.session = this.default;
        } else {
            this.session = JSON.parse(s);
        }
    }
};