/* map.js by maxrt101 */

var map;
var markers = {};

const markerIconDefault = './resources/marker_default.png';
const markerIconVisited = './resources/marker_visited.png';

function markerIcon(path) {
    return {
        url: path,
        origin: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(25, 25)
    };
}

function createMarker(name, pos) {
    page_log('Adding marker at {' + pos.lat + ', ' + pos.lng + '}');
    markers[name] = new google.maps.Marker({
        position: pos,
        map: map,
        icon: markerIcon(markerIconDefault)
    });
    return markers[name];
}

function createInfoWindowMarker(markerProps) {
    let marker = createMarker(markerProps.name, markerProps.pos);
    if (config.session.visited[markerProps.name] === true) marker.setIcon(markerIcon(markerIconVisited));
    let infoWindow = new google.maps.InfoWindow({
        content: `
            <div class='marker-info'>
                <h6>${markerProps.name}</h6>
                <button type='button' class='btn btn-primary' style='float: right;' onclick='setVisited("${markerProps.name}")'>Mark Visited</button>
            </div>
        `
    });
    marker.addListener("click", function(){
        infoWindow.open(map, marker);
    });
    return marker;
}

function setVisited(markerName) {
    config.session.visited[markerName] = true;
    config.save();
    markers[markerName].setIcon(markerIcon(markerIconVisited));
}

function initMap() {
    // Get User Settings
    config.load();
    var map_options = config.session.map;
    page_log('Initialising map at {' + map_options.center.lat + ', ' + map_options.center.lng + '} zoom: ' + map_options.zoom);
    // Create a Google Map
    map = new google.maps.Map(document.getElementById('map'), map_options);
    // Add event listeners
    map.addListener('zoom_changed', function(){
        config.session.map.zoom = map.getZoom();
        config.save();
    });
    map.addListener('center_changed', function(){
        config.session.map.center = map.getCenter();
        config.save();
    });
    // Create Place Markers
    for (i=0; i<markersData.length; i++) {
        createInfoWindowMarker(markersData[i]);
    }
}
