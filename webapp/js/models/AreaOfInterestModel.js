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

    var _points = [];

    var _areaOfInterestType = AreaOfInterestType.RECTANGLE;

    // Feature collection of the user selected area
    var _featureCollection = null;

    ///////////////////////// PUBLIC METHODS /////////////////////////////
    /**
     * Adds a point to the current path
     * @param latitude
     * @param longitude
     */
    this.addPoint = function (latitude, longitude) {
        var newPoint = {
            latitude: latitude,
            longitude: longitude
        };

        switch(_areaOfInterestType) {
            case AreaOfInterestType.RECTANGLE:
                if(_points.length > 1) {
                    var closestIndex = closestPoint(latitude, longitude);
                    _points.splice(closestIndex, 1, newPoint);
                } else {
                    _points.push(newPoint);
                }

                //notificationCenter.dispatch(Notifications.areaOfInterest.POINT_ADDED_TO_PATH);
                notificationCenter.dispatch(Notifications.areaOfInterest.POINTS_UPDATED);

                if(_points.length > 1) {
                    _featureCollection = computeFeatureCollectionBoundsWithCoordinates(_points);
                    notificationCenter.dispatch(Notifications.areaOfInterest.PATH_UPDATED);
                }
                break;
            case AreaOfInterestType.PATH:
                _points.push(newPoint);
                _featureCollection = computeSuggestedPath(_points);
                notificationCenter.dispatch(Notifications.areaOfInterest.POINTS_UPDATED);
                notificationCenter.dispatch(Notifications.areaOfInterest.PATH_UPDATED);
                break;
        }
    };

    this.movePoint = function(index, latitude, longitude) {

    };


    this.removeLastPoint = function() {

    };

    /**
     * Remove all the points from the path
     */
    this.clearPath = function () {
        _points = [];
        _featureCollection = null;
        //updateFeatureCollection();
        notificationCenter.dispatch(Notifications.areaOfInterest.PATH_UPDATED);
        notificationCenter.dispatch(Notifications.areaOfInterest.POINTS_UPDATED);
    };

    /**
     * Returns a sorted Array containing stop points in the form of a dictionary {latitude, longitude}
     * @returns {Array}
     */
    this.getPath = function () {
        return _points;
    };


    /**
     * Set the type of area of interest
     * @param type @see AreaOfInterest enum
     */
    this.setAreaOfInterestType = function(type) {
        console.log("set area of interest to " + type);
        _areaOfInterestType = type;
    };

    /**
     * Return area of interest type
     * @returns {string}
     */
    this.getAreaOfInterestType = function() {
        return _areaOfInterestType;
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
        /*var areaOfInterest = null;

        if (_featureCollection != null) {
            areaOfInterest = computeFeatureCollectionBoundRectangle(_featureCollection);
        }

        return areaOfInterest;*/
        return _featureCollection;
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
        if (_points.length > 1) {
            var directionsService = new google.maps.DirectionsService();

            var tmpWaypoints = [];
            for(var i = 1; i < (_points.length -1); i++) {
                tmpWaypoints.push({
                    location: new google.maps.LatLng(_points[i].latitude, _points[i].longitude),
                    stopover:false
                });
            }

            var request = {
                origin: new google.maps.LatLng(_points[0].latitude, _points[0].longitude),
                destination: new google.maps.LatLng(_points[_points.length - 1].latitude, _points[_points.length - 1].longitude),
                waypoints: tmpWaypoints,
                travelMode: google.maps.TravelMode.WALKING
            };
            // Route the directions and pass the response to a
            // function to create markers for each step.
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {

                    // Compute coordinates
                    var coordinates = [];
                    response["routes"][0]["overview_points"].forEach(function (point) {
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

    // Compute index of the closest point to given latitude and longitude
    var closestPoint = function(latitude, longitude) {
        return 0;
    };


    // Compute feature collection bound for coordinates
    var computeFeatureCollectionBoundsWithCoordinates = function(coordinates) {
        var coordinatesArray = [
            [coordinates[0].longitude, coordinates[0].latitude],
            [coordinates[1].longitude, coordinates[1].latitude]
        ];
        var polygon = computeFeatureCollectionPolygonWithCoordinates(coordinatesArray);
        return computeFeatureCollectionBoundRectangle(polygon);
    };

    // Compute a feature collection with given coordinates
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

    var computeSuggestedPath = function(points) {
        var circle = d3.geo.circle();
        var circleFeature = circle.origin([points[0].longitude, points[0].latitude]).angle(0.01)();

        return featureCollectionForGeometry(circleFeature);
    };

    var featureCollectionForGeometry = function(geometry) {
        return {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: geometry
                }
            ]
        };
    };

    var init = function () {
    }();

}

var AreaOfInterestType = {
    RECTANGLE : "rectangle",
    PATH : "path"
};















