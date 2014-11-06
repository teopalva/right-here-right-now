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

    // feature of the selection (CA for now)
    var _CAs = null;
    var _feature = null;
    var _multipoligonCA = null;

    var _communitiesURI = "/webapp/data/chicago_community_district_map.json";

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
        notificationCenter.dispatch(Notifications.areaOfInterest.PATH_CLEANED);
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
     */
    this.filterObjects = function (objects) {
        var res = [];
        var area = self.getAreaOfInterest();
        /*if (!area) {
            console.log("Empty area of interest!");
            return;
        }*/
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
     * Returns a Feature collection of the area selected by the user
     */
    this.getAreaOfInterest = function () {
        var areaOfInterest = null;

        if (_featureCollection != null) {
            areaOfInterest = computeFeatureCollectionBoundRectangle(_featureCollection);
        }

        return areaOfInterest;
    };

    this.getSelectedFeature = function () {
        return _feature;
    };

    this.getCAs = function () {
        return _CAs;
    };

    ///////////////////////// PRIVATE METHODS /////////////////////////
    // Updates feature collection of the user selected area
    var updateFeatureCollection = function () {
        if (_path.length > 1) {
            var directionsService = new google.maps.DirectionsService();
            var request = {
                origin: new google.maps.LatLng(_path[0].latitude, _path[0].longitude),
                destination: new google.maps.LatLng(_path[_path.length - 1].latitude, _path[_path.length - 1].longitude),
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

                    /*
                     var featureCollection = {};
                     featureCollection["type"] = "FeatureCollection";
                     featureCollection["features"] = [
                     { "type": "Feature",
                     "geometry": {
                     "type": "Polygon",
                     "coordinates": [
                     coordinates
                     ]
                     },
                     "properties": {
                     "prop0": "value0",
                     "prop1": {"this": "that"}
                     }
                     }
                     ];*/
                    _featureCollection = computeFeatureCollectionPolygonWithCoordinates(coordinates);

                    notificationCenter.dispatch(Notifications.areaOfInterest.PATH_UPDATED);
                    //_featureCollection = featureCollection;
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

    var loadCA = function () {
        var selectedArea = 28;
        d3.json(_communitiesURI, function (error, geojsonFeatures) {
            var features = geojsonFeatures.features;
            _CAs = features;

            for (var i in features) {
                var feature = features[i];
                if (feature.id == selectedArea) {
                    // store feature
                    _feature = feature;
                    _multipoligonCA = feature.geometry.coordinates;
                    break;
                }
            }
            if (_multipoligonCA === null)
                return;
        });
    };

    var init = function () {
        loadCA();
    }();

}