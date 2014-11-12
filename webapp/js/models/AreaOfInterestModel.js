/**
 * @class AreaOfInterestModel
 * @description This model keeps information about the area of interest that the user has select and represents the
 * boundaries in which data should be visualized
 *
 * @constructor
 */
function AreaOfInterestModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    var _path = [];


    // Feature collection of the user selected area
    var _featureCollection = null;

    ///////////////////////// PUBLIC METHODS /////////////////////////////
    /**
     * Adds a point to the current path
     * @param latitude
     * @param longitude
     */
    this.addPoint = function (latitude, longitude) {
        _path.push({
            latitude: latitude,
            longitude: longitude
        });
        updateFeatureCollection();
        notificationCenter.dispatch(Notifications.areaOfInterest.POINT_ADDED_TO_PATH);
    };

    /**
     * Remove all the points from the path
     */
    this.clearPath = function () {
        _path = [];
        updateFeatureCollection();
        notificationCenter.dispatch(Notifications.areaOfInterest.PATH_UPDATED);
    };

    /**
     * Returns a sorted Array containing stop points in the form of a dictionary {latitude, longitude}
     * @returns {Array}
     */
    this.getPath = function () {
        return _path;
    };

    /**
     *  Returns boolean stating if given point is inside given polygon
     */
    this.isPointInArea = function (coordinates, multipoligon) {
        var res = gju.pointInPolygon({
            "type": "Point",
            "coordinates": coordinates
        }, {
            "type": "Polygon",
            "coordinates": multipoligon[0]
        });
        //console.log(res);
        return res;
    };

    /**
     *  Filters the given objects checking if they belong to the area of interest
     *  Area of interest has to be selected
     *
     *  @return {Array}
     */
    this.filterObjects = function (objects) {
        var res = [];
        var area = self.getAreaOfInterest();
        if (area == null) {
            console.log("Empty area of interest!");
            return [];
        }
        var multipolygon = area.features[0].geometry;
        var _multipolygon = [];
        _multipolygon.push(multipolygon.coordinates);
        //console.log(_multipolygon, _multipoligonCA);
        objects.forEach(function (o) {
            var coordinates = [];
            coordinates.push(o.longitude);
            coordinates.push(o.latitude);
            if (self.isPointInArea(coordinates, _multipolygon)) {
                res.push(o);
            }
        });
        return res;
    };

    /**
     * Returns a Feature collection of the area selected by the user. If no area is selected returns null.
     *
     * @return {FeatureCollection}|null
     */
    this.getAreaOfInterest = function () {
        var areaOfInterest = null;

        if (_featureCollection != null) {
            areaOfInterest = computeFeatureCollectionBoundRectangle(_featureCollection);
        }

        return areaOfInterest;
    };

    /**
     * Returns a feature collection representing the actual direction from starting point to ending point toward
     * way-points
     */
    this.getDirections = function() {
        return _featureCollection;
    };





    ///////////////////////// PRIVATE METHODS /////////////////////////
    // Updates feature collection of the user selected area
    var updateFeatureCollection = function () {
        if (_path.length > 1) {
            var directionsService = new google.maps.DirectionsService();

            var tmpWaypoints = [];
            for(var i = 1; i < (_path.length -1); i++) {
                tmpWaypoints.push({
                    location: new google.maps.LatLng(_path[i].latitude, _path[i].longitude),
                    stopover:false
                });
            }

            var request = {
                origin: new google.maps.LatLng(_path[0].latitude, _path[0].longitude),
                destination: new google.maps.LatLng(_path[_path.length - 1].latitude, _path[_path.length - 1].longitude),
                waypoints: tmpWaypoints,
                travelMode: google.maps.TravelMode.WALKING
            };
            // Route the directions and pass the response to a
            // function to create markers for each step.
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {

                    // Compute coordinates
                    var coordinates = [];
                    response["routes"][0]["overview_path"].forEach(function (point) {
                        coordinates.push([point["B"], point["k"]]);
                    });

                    _featureCollection = computeFeatureCollectionPolygonWithCoordinates(coordinates);

                    notificationCenter.dispatch(Notifications.areaOfInterest.PATH_UPDATED);
                }
            });
        } else {
            _featureCollection = null;
        }
    };


    var computeFeatureCollectionPolygonWithCoordinates = function (coordinates) {
        var featureCollection = {};
        featureCollection["type"] = "FeatureCollection";
        featureCollection["features"] = [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        coordinates
                    ]
                },
                "properties": {
                    "prop0": "value0",
                    "prop1": {
                        "this": "that"
                    }
                }
            }
        ];
        return featureCollection;
    };

    var computeFeatureCollectionBoundRectangle = function (featureCollection) {
        var minLat = 1000;
        var minLon = 1000;
        var maxLat = -1000;
        var maxLon = -1000;

        featureCollection["features"][0]["geometry"]["coordinates"][0].forEach(function (lngLat) {
            var lon = lngLat[0];
            var lat = lngLat[1];

            if (lon < minLon) {
                minLon = lon;
            }
            if (lon > maxLon) {
                maxLon = lon;
            }
            if (lat < minLat) {
                minLat = lat;
            }
            if (lat > maxLat) {
                maxLat = lat;
            }
        });

        var bottomLeft = [minLon, minLat];
        var topLeft = [minLon, maxLat];
        var topRight = [maxLon, maxLat];
        var bottomRight = [maxLon, minLat];

        return computeFeatureCollectionPolygonWithCoordinates([bottomLeft, topLeft, topRight, bottomRight, bottomLeft]);
    };

    var init = function () {
    }();

}

var AreaOfInterestType = {

};















