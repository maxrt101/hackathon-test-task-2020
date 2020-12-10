/* directions.js by maxrt101 */

/* Route */

var routeCoords = [];

function addToRoute(pos) {
    routeCoords.push(pos);
}

function removeFromRoute(pos) {
    if (routeCoords.length > 0) {
        let index = routeCoords.indexOf(pos);
        for (let i = 0; i < routeCoords.length; i++) {
            if (routeCoords[i].lat == pos.lat && routeCoords[i].lng == pos.lng) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            routeCoords = routeCoords.slice(0, index).concat(routeCoords.slice(index+1, routeCoords.length));
        } else {
            console.warn("removeFromRoute: element index " + index);
        }
    }
}

function toggleAddToRouteName(name) {
    if (routeCoords.find(element => element == markers[name].getPosition())) {
        markers[name].setAnimation(null);
        removeFromRoute(markers[name].getPosition());
        return;
    }
    markers[name].setAnimation(google.maps.Animation.BOUNCE);
    addToRoute(markers[name].getPosition());
}


/* Directions */

function clearRouteRenderer() {
    directionsRenderer.setMap(null);
    for ([key, value] of Object.entries(markers)) {
        if (key.startsWith("WP")) {
            deleteMarker(key);
        }
    }
}

function renderDirections(request, resultCallback) {
    pageLog("Requesting route for: " + JSON.stringify(request));
    directionsService.route(request, (result, status) => {
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
    for (let i = 0; i < routeCoords.length; i++) {
        // User markers should be in order
        points.push({
            location: routeCoords[i],
            stopover: true
        });
    }
    // Render
    if (points.length >= 2) {
        start = points[0].location;
        end = points[points.length-1].location;
        result = renderDirections({
            origin: start,
            destination: end,
            waypoints: (points.length > 2) ? points.slice(1, points.length-1) : null,
            travelMode: "DRIVING",
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false
        }, (result) => {
            pageLog("Route constructed successfuly");
            /* result.routes[0].overview_path - Array of latLng waypoints */
            if (drawOverviewPath) {
                let overviewPath = result.routes[0].overview_path;
                for (let i = 0; i < overviewPath.length; i++) {
                    createMarker({
                        record: {
                            name: "WP" + i,
                            pos: {lat: overviewPath[i].lat(), lng: overviewPath[i].lng()}
                        },
                        icon: markerIconUser,
                        info: false
                    });
                }
            } // drawOverviewPath
        });
    } else {
        alert("Select at least 2 points, by clicking at the map.");
    }

}