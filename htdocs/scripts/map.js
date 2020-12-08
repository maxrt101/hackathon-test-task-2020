/* map.js by maxrt101 */

var map;
var directionsService;
var directionsRenderer;

var userMarkerCount = 0;
var userMarkerId = 0;

function deleteUserMarker(name) {
    deleteMarker(name);
    userMarkerCount--;
}

function resetUserMarkers() {
    for ([key, value] of Object.entries(markers)) {
        if (key.startsWith('URP') && key.length < 6) { // Temporary check. "UBP".length:3 + 3 digits
            deleteMarker(key);
        }
    }
    userMarkerCount = 0;
    userMarkerId = 0;
}

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
        if (userMarkerCount == 2 && !config.session.allowManyRouteMarkers) {
            return;
        }

        let name = "URP" + (++userMarkerId);

        userMarkerCount++;

        createMarker({
            record: {name: name, pos: {"lat": event.latLng.lat(), "lng": event.latLng.lng()}},
            icon: markerIconUser,
            draggable: true,
            info: true,
            infoContent: `
                <div class='marker-info'>
                    <h6>Route Marker #${userMarkerId}</h6>
                    <button type='button' class='btn btn-primary' style='float: right;' onclick='deleteUserMarker("${name}")'>Delete</button>
                </div>
            `
        });
        // markers[name].addListener("dragend", function(event){});
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
