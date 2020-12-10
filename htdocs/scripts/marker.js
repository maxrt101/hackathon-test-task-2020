/* marker.js by maxrt101 */

var markers = {};

const markerIconDefault = './resources/marker_default.png';
const markerIconVisited = './resources/marker_visited.png';
const markerIconUser    = './resources/marker_user.png';


function markerIcon(path) {
    return {
        url: path,
        origin: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(25, 25)
    };
}

function createMarker(props) {
    /** @param: props {record: { name: "", pos: {}, icon: "", info: true, infoContent: "" draggable: false, animation: null} */
    let rec = props.record;
    pageLog("Created marker at {" + rec.pos.lat + ", " + rec.pos.lng + "}");
    markers[rec.name] = new google.maps.Marker({
        position: rec.pos,
        map: map,
        draggable: props.draggable !== null ? props.draggable : false,
        animation: props.animation,
        icon: props.icon ? markerIcon(props.icon) : markerIcon(markerIconDefault)
    });
    if (props.info) {
        let infoWindow = new google.maps.InfoWindow({
            content: props.info 
        });
        markers[rec.name].addListener("click", () => {
            infoWindow.open(map, markers[rec.name]);
        });
    }
    return markers[rec.name];
}

function deleteMarker(name) {
    markers[name].setMap(null);
    delete markers[name];
} 

function setVisited(markerName) {
    config.session.visited[markerName] = true;
    config.save();
    markers[markerName].setIcon(markerIcon(markerIconVisited));
}

function toggleVisited(markerName) {
    if (config.session.visited[markerName]) {
        delete config.session.visited[markerName];
    } else {
        config.session.visited[markerName] = true;
    }
    config.save();
    markers[markerName].setIcon(markerIcon(config.session.visited[markerName] ? markerIconVisited : markerIconDefault));
}