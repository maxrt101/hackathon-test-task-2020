/* directions.js by maxrt101 */

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

function clearRouteRenderer() {
    directionsRenderer.setMap(null);
    for ([key, value] of Object.entries(markers)) {
        console.log(key, value);
        if (key.startsWith("WP")) {
            value.setMap(null);
            delete markers[key];
        }
    }
}

function renderUserPointDirections(drawOverviewPath=false) {
    var result;
    if (markers["P1"] && markers["P2"]) {
        result = renderDirections({
            origin: markers["P1"].getPosition(),
            destination: markers["P2"].getPosition(),
            travelMode: "DRIVING",
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false
        }, function(result){
            pageLog("Route constructed successfuly");
            console.log(result);
            /* result.routes[0].overview_path - Array of {lat, lng} waypoints */
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
                        info: true,
                        infoContent: `
                            <div class="marker-info">
                                <h6>${"WP"+i}</h6>
                                <p>This is route waypoint</p>
                            </div>
                        `,
                    });
                }
            }
        });
    } else {
        alert("Select 2 points, by clicking at the map.");
    }

}