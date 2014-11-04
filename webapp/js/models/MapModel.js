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

    var  _focusPoint = { latitude:41.876320, longitude:-87.572841 };
    var _topLeftCoord = new L.latLng(42.1, -88.0);
    var _bottomRightCoord = new L.latLng(41.1, -87.0);
    var _defaultZoomForProjecting = 10;


    ////////////////////////// PUBLIC METHODS //////////////////////////


    /**
     *
     * @returns {Array} [latitude, longitude]
     */
    this.getMapBounds = function() {
        return _map.getBounds();
    };


    /**
     *
     */
    this.getTopLeftCoordOfInterest = function() {
        return _topLeftCoord;
    } ;

    /**
     *
     */
    this.getBottomRightCoordOfInterest = function() {
        return _bottomRightCoord;
    };


    /**
     *
     */
    this.projectAtDefaultZoom = function(lat,long) {
        return _map.project(new L.LatLng(lat,long), _defaultZoomForProjecting);
    };

    this.unprojectAtDefaultZoom = function(x, y) {
        return _map.unproject(new L.point(x, y), _defaultZoomForProjecting);
    };


    /**
     *
     */
    this.getZoomLevel = function() {
        return _map.getZoomLevel();
    };

    /**
     *
     * @returns {*[]}
     */
    this.getDefaultFocusPoint = function() {
        return [
            _focusPoint.latitude,
            _focusPoint.longitude
        ];
    };

    /**
     * Set the current leaflet map object to be used with this model
     * @param map
     */
    this.setMap = function(map) {
        _map = map;
        _map.on("move", function(){
            notificationCenter.dispatch(Notifications.mapController.MAP_POSITION_OR_ZOOM_CHANGED)
        });

        _map.on("zoomend", function(){
            notificationCenter.dispatch(Notifications.mapController.ZOOM_CHANGED);
        });
    };


    /**
     *
     * @param lat
     * @param long
     * @returns {*}
     */
    this.fromLatLngToLayerPoint = function(lat,long){
        return _map.latLngToLayerPoint(new L.LatLng(lat, long));
    } ;

    /**
     *
     * @param x
     * @param y
     * @returns {*}
     */
    this.layerPointToLatLng = function(x,y){
        return _map.layerPointToLatLng(new L.Point(x, y));
    };





    ////////////////////////////////// PRIVATE METHODS //////////////////////////////////
    var init = function() {
    } ();

}