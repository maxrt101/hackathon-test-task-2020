/* map.js by maxrt101 */

var map;

function addMarker(pos, icon_img="./resources/marker_default.png") {
    page_log("Adding marker at {" + pos.lat + ", " + pos.lng + "}");
    var marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: {
            url: icon_img,
            origin: new google.maps.Point(0, 0),
            scaledSize: new google.maps.Size(25, 25)
        }
    });
    return marker;
}

function addInfoMarker(marker_cfg) {
    let marker = addMarker(marker_cfg.pos, (config.session.visited[marker_cfg.name] === true) ? "./resources/marker_visited.png" : "./resources/marker_default.png");
    let infoWindow = new google.maps.InfoWindow({
        content: "<div class='marker-info'><h6>" + marker_cfg.name + "</h6><button type='button' class='btn btn-primary' onclick='setVisited(\"" + marker_cfg.name + "\")'>Set Visited</button></div>"
    });
    marker.addListener("click", function(){
        infoWindow.open(map, marker);
    });
    return marker;
}

function setVisited(marker_name) {
    config.session.visited[marker_name] = true;
    config.save();
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
