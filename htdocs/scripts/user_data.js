/* user_data.js by maxrt101 */
var default_user_settings = {markers: [], map: {zoom: 12, center: {lat: 49.842957, lng: 24.031111}}};
var user_settings;

function storeUserSettings() {
    page_log("Saving user settings")
    if (user_settings !== null) {
       window.localStorage.setItem("user_settings", JSON.stringify(user_settings));
    } else {
        page_log("WARN: User settings === null! This should not be possible");
    }
}

function loadUserSettings() {
    page_log("Loading stored user settings");
    var s = window.localStorage.getItem("user_settings");
    if (s === null) {
        page_log("Found none, settings = default");
        user_settings = default_user_settings;
    } else {
        console.log(s);
        user_settings = JSON.parse(s);
    }
}