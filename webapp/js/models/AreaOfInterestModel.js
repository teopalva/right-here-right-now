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
    var _multipoligon = null;

    var _communitiesURI = "/webapp/data/chicago_community_district_map.json";

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
        notificationCenter.dispatch(Notifications.areaOfInterest.POINT_ADDED_TO_PATH);
    };

    /**
     * Remove all the points from the path
     */
    this.clearPath = function () {
        _path = [];
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
     *
     */
    this.filterObjects = function (objects) {
        var res = [];
        objects.forEach(function (o) {
            var coordinates = [];
            coordinates.push(o.longitude);
            coordinates.push(o.latitude);
            if (self.isPointInArea(coordinates, _multipoligon)) {
                res.push(o);
            }
        });
        return res;
    };

    this.getSelectedFeature = function () {
        return _feature;
    };

    this.getCAs = function () {
        return _CAs;
    };

    ///////////////////////// PRIVATE METHODS /////////////////////////

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
                    _multipoligon = feature.geometry.coordinates;
                    break;
                }
            }
            if (_multipoligon === null)
                return;
        });
    };

    var init = function () {
        loadCA();
    }();

}