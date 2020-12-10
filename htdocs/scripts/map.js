/* map.js by maxrt101 */

var map;
var directionsService;
var directionsRenderer;

var userMarkerCount = 0;
var userMarkerId = 0;


function addUserMarker(pos) {
    if (userMarkerCount == 2 && !config.session.allowManyRouteMarkers) {
        return;
    }
    let name = "URP" + (++userMarkerId); // URP = User Route Point(Marker)
    userMarkerCount++;
    console.log(name);
    createMarker({
        record: {name: name, pos: pos},
        icon: markerIconUser,
        draggable: true,
        info: `
            <div class='marker-info'>
                <h6>Route Marker #${userMarkerId}</h6>
                <button type='button' class='btn btn-primary' style='float: right;' onclick='deleteUserMarker("${name}")'>Delete</button>
            </div>
        `
    });
    // markers[name].addListener("dragend", function(event){});
    addToRoute(pos);
    return name
}

function deleteUserMarker(name) {
    console.log(name);
    let pos = markers[name].getPosition();
    console.log(pos);
    removeFromRoute({lat: pos.lat(), lng: pos.lng()});
    deleteMarker(name);
    userMarkerCount--;
}

function resetUserMarkers() {
    for ([key, value] of Object.entries(markers)) {
        if (key.startsWith('URP')) {
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
    map.addListener('zoom_changed', () => {
        config.session.map.zoom = map.getZoom();
        config.save();
    });

    // Add center_changed Event Listener
    map.addListener('center_changed', () => {
        config.session.map.center = map.getCenter();
        config.save();
    });

    // Add click Event Listener
    map.addListener("click", (event) => {
        addUserMarker({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        });
    });

    // Create Place Markers
    /**
     * @todo: make dynamic buttons, so when the user presses 'Add to Route', button changes to 'Remove from Route' and vice versa
    */
    for (let i = 0; i < markersData.length; i++) {
        try {
            createMarker({
                record: markersData[i],
                icon: config.session.visited[markersData[i].name] ? markerIconVisited : markerIconDefault,
                info: `
                    <div class='marker-info'>
                        <h6>${markersData[i].name}</h6>
                        <img src="${markersData[i].img}" style="max-width:100%; height: auto;" alt="img">
                        <p>${markersData[i].text}</p>
                        <button type='button' class='btn btn-primary' style='float: right;' onclick='toggleVisited("${markersData[i].name}")'>Mark Visited</button>
                        <div class='marker-info-pad'></div>
                        <button type='button' class='btn btn-primary' style='float: right;' onclick='addToRoute(markersData.find(element => element.name == "${markersData[i].name}").pos)'>Add to Route</button>
                    </div>
                `
            });
        } catch(e) {
            pageLog("Wiki Request Error");
            console.log(e);
        }
    }
}
            