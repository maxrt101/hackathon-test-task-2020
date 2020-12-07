/* map.js by maxrt101 */

var map;

function addMarker(pos) {
    page_log("Adding marker at {" + pos.lat + ", " + pos.lng + "}");
    var marker = new google.maps.Marker({
        position: pos,
        map: map
    });
    return marker;
}

function initMap() {
    // Get User Settings
    loadUserSettings();
    var map_options = user_settings.map;
    page_log("Initialising map at {" + map_options.center.lat + ", " + map_options.center.lng + "}");
    // Create a map
    map = new google.maps.Map(document.getElementById("map"), map_options);
    // Add Marker at the center
    addMarker(map_options.center);
    for (i=0; i<user_settings.markers.length; i++) {
        console.log("addMarker: " + JSON.stringify(user_settings.markers[i]));
        addMarker(user_settings.markers[i]);
    }
}
