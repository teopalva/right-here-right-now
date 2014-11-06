/**
 * @class MapLayersModel
 * @description
 *
 * @constructor
 */
function MapLayersModel() {
    ///////////////////////// PRIVATE ATTRIBUTES /////////////////////////
    var self = this;

    var _layerStatus = {};


    ///////////////////////// PUBLIC METHODS /////////////////////////////
    /**
     * Returns active layers
     * @returns {Array}
     */
    this.getActiveLayers = function() {
        var activeLayers = [];

        d3.keys(_layerStatus).forEach(function(value) {
            if(_layerStatus[value] == true) {
                activeLayers.push(value);
            }
        });

        return activeLayers;
    };

    /**
     * Enables the layers for which the layerKey is passed in the layerKeyArray
     * @param layerArray contains layer enum keys of the layers that have to be enabled
     */
    this.enableLayers = function(layerArray) {
        layerArray.forEach(function(value) {
            _layerStatus[value] = true;
        });

        notificationCenter.dispatch(Notifications.mapLayers.LAYERS_STATUS_CHANGED);
    };

    /**
     * Disables the layers for which the layerKey is passed in the layerKeyArray
     * @param layerArray contains layer enum keys of the layers that have to be disabled
     */
    this.disableLayers = function(layerArray) {
        layerArray.forEach(function(value) {
            _layerStatus[value] = false;
        });

        notificationCenter.dispatch(Notifications.mapLayers.LAYERS_STATUS_CHANGED);
    };

    ///////////////////////// PRIVATE METHODS /////////////////////////
    var init = function() {
        d3.values(Layers).forEach(function(value) {
            _layerStatus[value] = true;
        });
    } ();
}

/**
 * LAYERS ENUM
 */
var Layers = {
    USER_PATH: "UserPathLayerViewController",
    POTHOLES: "PotholesLayerViewController",
    VEHICLES: "VehiclesLayerViewController",
    LIGHTS: "LightsLayerViewController",
    CTA: "CtaLayerViewController",
    AREA_OF_INTEREST: "AreaOfInterestViewController"
};