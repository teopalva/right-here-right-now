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

    var _directions = null;

    var delta = {
        latitude: 0.004,
        longitude: 0.005
    };

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
                console.time("Google request");
                requestPath(_points, function(overviewPath) {
                    console.timeEnd("Google request");

                    var directions = [];
                    overviewPath.forEach(function(pair) {
                        directions.push({
                            latitude: pair["k"],
                            longitude: pair["B"]
                        });
                    });

                    setDirections(directions);

                    console.time("create buffer");
                    _featureCollection = featureCollectionBuffer(overviewPath);
                    console.timeEnd("create buffer");
                    console.time("dispatch notifications");
                    notificationCenter.dispatch(Notifications.areaOfInterest.POINTS_UPDATED);
                    notificationCenter.dispatch(Notifications.areaOfInterest.PATH_UPDATED);
                    console.timeEnd("dispatch notifications");
                });
                break;
        }
    };


    /**
     * Remove all the points from the path
     */
    this.clearPath = function () {
        _points = [];
        _featureCollection = null;
        setDirections([]);
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
        if(_areaOfInterestType != type) {
            self.clearPath();
        }
        _areaOfInterestType = type;
    };

    /**
     * Return area of interest type
     * @returns {string}
     */
    this.getAreaOfInterestType = function() {
        return _areaOfInterestType;
    };

    this.isInsideAreaOfInterest = function(latitude, longitude) {
        if (model.getAreaOfInterestModel().getAreaOfInterest()) {
            var coordinates = [longitude, latitude];

            var area = self.getAreaOfInterest();

            var multipolygon = area.features[0].geometry;
            var _multipolygon = [];
            _multipolygon.push(multipolygon.coordinates);

            return self.isPointInArea(coordinates, _multipolygon)
        }
        return false;
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
        //console.time("filter");
        var res = [];
        var area = self.getAreaOfInterest();
        if (area == null) {
            return [];
        }
        var multipolygon = area.features[0].geometry;
        var _multipolygon = [];
        _multipolygon.push(multipolygon.coordinates);
        //console.log(_multipolygon, _multipoligonCA);

        objects = self.spatialReduction(objects);

        objects.forEach(function (o) {
            var coordinates = [];
            coordinates.push(o.longitude);
            coordinates.push(o.latitude);
            if (self.isPointInArea(coordinates, _multipolygon)) {
                res.push(o);
            }
        });
        //console.timeEnd("filter");
        return res;
    };

    this.spatialReduction = function(objects) {
        var reducedSet = [];
        var area = self.getAreaOfInterest();
        if (area == null) {
            return objects;
        }
        var bounds = d3.geo.bounds(area);

        var quadtree = d3.geom.quadtree()
            .x(function(d) {return d.longitude})
            .y(function(d) {return d.latitude})
        (objects);

        var x0 = bounds[0][0];
        var y0 = bounds[0][1];
        var x3 = bounds[1][0];
        var y3 = bounds[1][1];
        quadtree.visit(function(node, x1, y1, x2, y2) {
            var p = node.point;
            if (p) {
                p.scanned = true;
                p.selected = (p.longitude >= x0) && (p.longitude < x3) && (p.latitude >= y0) && (p.latitude < y3);
                //console.log(p.selected);
                if(p.selected) {
                    reducedSet.push(p);
                }
            }
            return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
        });

        return reducedSet;
    };

    /**
     * Returns a Feature collection of the area selected by the user. If no area is selected returns null.
     *
     * @return {FeatureCollection}|null
     */
    this.getAreaOfInterest = function () {
        return _featureCollection;
    };

    /**
     * Returns a feature collection representing the actual direction from starting point to ending point toward
     * way-points
     */
    this.getDirections = function() {
        return _directions;
    };

    // TODO: convert steradians to squared miles
    this.getSquaredMiles = function() {
        return d3.geo.area(_featureCollection) * 15668767.5070028;
    };



///////////////////////// PRIVATE METHODS /////////////////////////
    var setDirections = function(directions) {
        _directions = directions;
        notificationCenter.dispatch(Notifications.areaOfInterest.DIRECTIONS_UPDATED);
    };

    // Compute index of the closest point to given latitude and longitude
    var closestPoint = function(latitude, longitude) {
        var closestIndex = 0;
        var closestDistance = Math.sqrt(Math.pow(_points[0].latitude - latitude, 2) + Math.pow(_points[0].longitude - longitude, 2));

        var tmpDistance;
        _points.forEach(function(point, index) {
            tmpDistance = Math.sqrt(Math.pow(point.latitude - latitude, 2) + Math.pow(point.longitude - longitude, 2));
            if(tmpDistance < closestDistance) {
                closestDistance = tmpDistance;
                closestIndex = index;
            }
        });
        return closestIndex;
    };


// Compute feature collection bound for coordinates
    var computeFeatureCollectionBoundsWithCoordinates = function(coordinates) {
        var tmp = [
            {
                latitude: coordinates[0].latitude,
                longitude: coordinates[0].longitude
            },
            {
                latitude: coordinates[1].latitude,
                longitude: coordinates[1].longitude
            }
        ];


        if(tmp[0].longitude < tmp[1].longitude) {
            tmp[0].longitude -= delta.longitude;
            tmp[1].longitude += delta.longitude;
        } else {
            tmp[0].longitude += delta.longitude;
            tmp[1].longitude -= delta.longitude;
        }

        if(tmp[0].latitude < tmp[1].latitude) {
            tmp[0].latitude -= delta.latitude;
            tmp[1].latitude += delta.latitude;
        } else {
            tmp[0].latitude += delta.latitude;
            tmp[1].latitude -= delta.latitude;
        }

        var coordinatesArray = [
            [tmp[0].longitude, tmp[0].latitude],
            [tmp[1].longitude, tmp[1].latitude]
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

// Google API
    var requestPath = function(points, callback) {
        var directionsService = new google.maps.DirectionsService();

        var tmpWaypoints = [];
        for(var i = 1; i < (points.length -1); i++) {
            tmpWaypoints.push({
                location: new google.maps.LatLng(points[i].latitude, points[i].longitude),
                stopover:false
            });
        }

        var request = {
            origin: new google.maps.LatLng(points[0].latitude, points[0].longitude),
            destination: new google.maps.LatLng(_points[points.length - 1].latitude, points[_points.length - 1].longitude),
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

                callback(response["routes"][0]["overview_path"]);
            }
        });
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


    var featureCollectionBuffer = function(overviewPath) {
        var overviewPathGeo = [];
        for(var i = 0; i < overviewPath.length; i++) {
            overviewPathGeo.push(
                [overviewPath[i].lng(), overviewPath[i].lat()]
            );
        }

        var distance = 60/11100.12, // Roughly 600m
            geoInput = {
                type: "LineString",
                coordinates: overviewPathGeo
            };

        var geoReader = new jsts.io.GeoJSONReader(),
            geoWriter = new jsts.io.GeoJSONWriter();
        var geometry = geoReader.read(geoInput).buffer(distance);
        var polygon = geoWriter.write(geometry);

        return featureCollectionForGeometry(polygon);
    };

    var init = function () {
    }();

}

var AreaOfInterestType = {
    RECTANGLE : "rectangle",
    PATH : "path"
};















