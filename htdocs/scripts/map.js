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

function addInfoMarker(marker_cfg) {
    let marker = addMarker(marker_cfg.pos);
    let infoWindow = new google.maps.InfoWindow({
        content: "<dev class='marker-info'><h6>" + marker_cfg.name + "</h6></dev>"
    });
    marker.addListener("click", function(){
        infoWindow.open(map, marker);
    });
    return marker;
}

function initMap() {
    // Get User Settings
    config.load();
    var map_options = config.session.map;
    page_log("Initialising map at {" + map_options.center.lat + ", " + map_options.center.lng + "}");
    // Create a Google Map
    map = new google.maps.Map(document.getElementById("map"), map_options);
    // Add event listeners
    map.addListener("zoom_changed", function(){
        config.session.map.zoom = map.getZoom();
        config.save();
    });
    map.addListener("center_changed", function(){
        config.session.map.center = map.getCenter();
        config.save();
    });
    // Add Place Markers
    for (i=0; i<markers.length; i++) {
        addInfoMarker(markers[i]);
    }
    // Add User Markers
    for (i=0; i<config.session.markers.length; i++) {
        addMarker(config.session.markers[i]);
    }
}
