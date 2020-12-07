/* config.js by maxrt101 */

var config = {
    default: {markers: [], visited: {}, map: {zoom: 8, center: markers[0].pos}},
    session: {},
    save: function() {
        //page_log("Saving user settings: " + JSON.stringify(this.session));
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
            console.log(s);
            this.session = JSON.parse(s);
        }
    }
};