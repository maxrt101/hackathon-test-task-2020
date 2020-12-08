/* map.js by maxrt101 */

var map;
var directionsService;
var directionsRenderer;

function initMap() {
    // Get User Settings
    config.loadIfNotLoaded();
    var map_options = config.session.map;
    pageLog('Initialising map at {' + map_options.center.lat + ', ' + map_options.center.lng + '} zoom: ' + map_options.zoom);

    // Create a Google Map
    map = new google.maps.Map(document.getElementById('map'), map_options);

    // Create required directions api instances
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    // Set map for DirectionsRenderer
    directionsRenderer.setMap(map);

    // Add zoom_changed Event Listener 
    map.addListener('zoom_changed', function(){
        config.session.map.zoom = map.getZoom();
        config.save();
    });

    // Add center_changed Event Listener
    map.addListener('center_changed', function(){
        config.session.map.center = map.getCenter();
        config.save();
    });

    // Add click Event Listener
    map.addListener("click", function(event) {
        if (userMarkerState == 0) { // 0 means no user markers yet, so create the first one
            createMarker({
                record: {name: "P1", pos: {"lat": event.latLng.lat(), "lng": event.latLng.lng()}},
                icon: markerIconUser,
                draggable: true,
                info: false
            });
            // markers["P1"].addListener("dragend", function(innerEvent){});
            userMarkerState = 1;
        } else if (userMarkerState == 1) { // 1 means there are already one user marker, so create another one
            createMarker({
                record: {name: "P2", pos: {"lat": event.latLng.lat(), "lng": event.latLng.lng()}},
                icon: markerIconUser,
                draggable: true,
                info: false
            });
            // markers["P2"].addListener("dragend", function(innerEvent){});
            userMarkerState = 2;
        } // if 2 user markers are present, do nothing
    });

    // Create Place Markers
    for (i = 0; i < markersData.length; i++) {
        createMarker({
            record: markersData[i],
            icon: config.session.visited[markersData[i].name] ? markerIconVisited : markerIconDefault,
            info: true
        });
    }
}
