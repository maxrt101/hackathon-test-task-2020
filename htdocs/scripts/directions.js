/* directions.js by maxrt101 */

function clearRouteRenderer() {
    directionsRenderer.setMap(null);
    for ([key, value] of Object.entries(markers)) {
        console.log(key, value);
        if (key.startsWith("WP")) {
            deleteMarker(key);
        }
    }
}

function renderDirections(request, resultCallback) {
    pageLog("Requesting route for: " + JSON.stringify(request));
    directionsService.route(request, function(result, status){
        pageLog("DirectionsService response: " + status);
        if (status == "OK") {
            directionsRenderer.setMap(map);
            directionsRenderer.setDirections(result);
            resultCallback(result);
        } else {
            console.error("DirectionsService.route(" + request + ") => " + status + ", " + result);
        }
    });
}

function renderUserPointDirections(drawOverviewPath=false) {
    var result;
    var points = [];
    var start, end;
    // Get points
    for ([key, value] of Object.entries(markers)) {
        // User markers should be in order
        if (key.startsWith("URP")) {
            points.push({
                location: value.getPosition(),,
                stopover: true
            });
        }
    }
    // Render
    if (points.length >= 2) { // change
        start = points[0].location;
        end = points[points.length-1].location;
        result = renderDirections({
            origin: start,
            destination: end,
            waypoints: (points.length > 2) ? points.slice(1, points.length-1) : null,
            travelMode: "DRIVING",
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false
        }, function(result){
            pageLog("Route constructed successfuly");
            console.log(result);
            /* result.routes[0].overview_path - Array of latLng waypoints */
            if (drawOverviewPath) {
                let overviewPath = result.routes[0].overview_path;
                for (let i = 0; i < overviewPath.length; i++) {
                    console.log(i, overviewPath[i]);
                    createMarker({
                        record: {
                            name: "WP" + i,
                            pos: {lat: overviewPath[i].lat(), lng: overviewPath[i].lng()}
                        },
                        icon: markerIconUser,
                        info: false
                    });
                }
            }
        });
    } else {
        alert("Select at least 2 points, by clicking at the map.");
    }

}