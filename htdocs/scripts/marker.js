/* marker.js by maxrt101 */

var markers = {};
var userMarkerState = 0;

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
    /** @param: props {record: { name: "", pos: {}, icon: "", info: true, draggable: false, animation: null} */
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
            content: `
                <div class='marker-info'>
                    <h6>${rec.name}</h6>
                    <button type='button' class='btn btn-primary' style='float: right;' onclick='setVisited("${rec.name}")'>Mark Visited</button>
                </div>
            `
        });
        markers[rec.name].addListener("click", function(){
            infoWindow.open(map, markers[rec.name]);
        });
    }
    return markers[rec.name];
}

function setVisited(markerName) {
    config.session.visited[markerName] = true;
    config.save();
    markers[markerName].setIcon(markerIcon(markerIconVisited));
}