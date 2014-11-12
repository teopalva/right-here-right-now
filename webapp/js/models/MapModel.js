/**
 *
 * @param parentModel
 * @constructor
 */
function MapModel() {
    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    var _map;

    // This is the default latitude and longitude of the Map center.

    var _focusPoint = {
        latitude: 41.876320,
        longitude: -87.572841
    };
    var _topLeftCoord = new L.latLng(42.1, -88.0);
    var _bottomRightCoord = new L.latLng(41.1, -87.0);
    var _defaultZoomForProjecting = 10;

    var _mapContainer;
    var _tileLayers;
    var _mapLayer;

    ////////////////////////// PUBLIC METHODS //////////////////////////


    /**
     *
     * @returns {Array} [latitude, longitude]
     */
    this.getMapBounds = function () {
        return _map.getBounds();
    };


    /**
     *
     */
    this.getTopLeftCoordOfInterest = function () {
        return _topLeftCoord;
    };

    /**
     *
     */
    this.getBottomRightCoordOfInterest = function () {
        return _bottomRightCoord;
    };


    /**
     *
     */
    this.projectAtDefaultZoom = function (lat, long) {
        return _map.project(new L.LatLng(lat, long), _defaultZoomForProjecting);
    };

    this.projectAtCurrentZoom = function (lat, long) {
        var currentZoom = _map.getZoom();
        return _map.project(new L.LatLng(lat, long), currentZoom);
    };

    this.unprojectAtDefaultZoom = function (x, y) {
        return _map.unproject(new L.point(x, y), _defaultZoomForProjecting);
    };

    this.unprojectAtCurrentZoom = function (x, y) {
        var currentZoom = _map.getZoom();
        return _map.unproject(new L.point(x, y), currentZoom);
    };


    /**
     *
     */
    this.getZoomLevel = function () {
        //return _map.getZoomLevel();
        return _map.getZoom();
    };



    /**
     *
     * @returns {*[]}
     */
    this.getDefaultFocusPoint = function () {
        return [
            _focusPoint.latitude,
            _focusPoint.longitude
        ];
    };

    /**
     * Set the current leaflet map object to be used with this model
     * @param map
     */
    this.setMap = function (map) {
        _map = map;
        _map.on("move", function () {
            notificationCenter.dispatch(Notifications.mapController.MAP_POSITION_OR_ZOOM_CHANGED)
        });

        _map.on("zoomend", function () {
            notificationCenter.dispatch(Notifications.mapController.ZOOM_CHANGED);
        });
    };

    /**
     *
     * @param lat
     * @param long
     * @returns {*}
     */
    this.fromLatLngToLayerPoint = function (lat, long) {
        return _map.latLngToLayerPoint(new L.LatLng(lat, long));
    };

    /**
     *
     * @param x
     * @param y
     * @returns {*}
     */
    this.layerPointToLatLng = function (x, y) {
        return _map.layerPointToLatLng(new L.Point(x, y));
    };

    this.zoomIn = function () {
        _map.zoomIn(1);
    };

    this.zoomOut = function () {
        _map.zoomOut(1);
    };

    this.changeLayer = function (type) {
        if (_mapLayer)
            _mapContainer.removeLayer(_mapLayer);
        switch (type) {
        case "satellite":
            _mapLayer = _tileLayers.aerial.addTo(_mapContainer);
            break;
        case "street":
            _mapLayer = _tileLayers.map.addTo(_mapContainer);
            break;
        }
    }

    this.setMapContainer = function (m) {
        _mapContainer = m;
    };

    this.setTileLayers = function (t) {
        _tileLayers = t;
    };

    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////
    var init = function () {}();

}