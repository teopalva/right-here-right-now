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
    this.getActiveLayers = function () {
        var activeLayers = [];

        d3.keys(_layerStatus).forEach(function (value) {
            if (_layerStatus[value] == true) {
                activeLayers.push(value);
            }
        });

        return activeLayers;
    };

    /**
     * Returns active layers that can be filtered by date
     * @returns {Array}
     */
    this.getActiveLayersToFilter = function () {
        var activeLayers = [];

        d3.keys(_layerStatus).forEach(function (value) {
            if (_layerStatus[value] == true && (
                value == Layers.POTHOLES ||
                value == Layers.LIGHTS ||
                value == Layers.VEHICLES ||
                value == Layers.VIOLENT_CRIMES ||
                value == Layers.PROPERTY_CRIMES ||
                value == Layers.QUALITY_OF_LIFE_CRIMES
                )) {
                activeLayers.push(value);
            }
        });

        return activeLayers;
    };

    /**
     * Enables the layers for which the layerKey is passed in the layerKeyArray
     * @param layerArray contains layer enum keys of the layers that have to be enabled
     */
    this.enableLayers = function (layerArray) {
        layerArray.forEach(function (value) {
            _layerStatus[value] = true;
        });

        notificationCenter.dispatch(Notifications.mapLayers.LAYERS_STATUS_CHANGED);
    };

    /**
     * Disables the layers for which the layerKey is passed in the layerKeyArray
     * @param layerArray contains layer enum keys of the layers that have to be disabled
     */
    this.disableLayers = function (layerArray) {
        layerArray.forEach(function (value) {
            _layerStatus[value] = false;
        });
        notificationCenter.dispatch(Notifications.mapLayers.LAYERS_STATUS_CHANGED);
    };

    this.disableAllLayers = function () {
        for (key in Layers) {
            _layerStatus[Layers[key]] = false;
        }
        ;
        _layerStatus[Layers.USER_PATH] = true;
        _layerStatus[Layers.POPUPS] = true;
        _layerStatus[Layers.PLACES_OF_INTEREST] = true;
        notificationCenter.dispatch(Notifications.mapLayers.LAYERS_STATUS_CHANGED);
    };

    /**
     * Test if the given layer is active
     * @param layer a layer enum constant @see Layers enum
     * @returns boolean
     */
    this.isLayerActive = function (layer) {
        return _layerStatus[layer];
    };

    /**
     * Test if the given layers are all active
     * @param layersArray an array of layer enum constant @see Layers enum
     * @returns boolean
     */
    this.areAllLayersActive = function (layersArray) {
        var allActive = true;

        // If all layers are active..
        layersArray.forEach(function (layer) {
            allActive = allActive && self.isLayerActive(layer);
        });

        return allActive;
    };

    ///////////////////////// PRIVATE METHODS /////////////////////////
    var init = function () {
        d3.values(Layers).forEach(function (value) {
            _layerStatus[value] = false;
        });

        self.enableLayers([Layers.USER_PATH]);
        self.enableLayers([Layers.POPUPS]);
        self.enableLayers([Layers.PLACES_OF_INTEREST]);
    }();
}

/**
 * LAYERS ENUM
 */
var Layers = {
    USER_PATH: "UserPathLayerViewController",
    POTHOLES: "PotholesLayerViewController",
    VEHICLES: "VehiclesLayerViewController",
    LIGHTS: "LightsLayerViewController",
    DIVVY_BIKES: "DivvyBikesLayerViewController",
    CTA_STOPS: "CtaLayerViewController",
    CTA_BUSES: "CtaStopsLayerViewController",
    CTA_BUS_ROUTES: "CtaBusRoutesLayerViewController",
    CTA_TRAINS: "CtaTrainLayerViewController",
    VIOLENT_CRIMES: "ViolentCrimesLayerViewController",
    PROPERTY_CRIMES: "PropertyCrimesLayerViewController",
    QUALITY_OF_LIFE_CRIMES: "QualityOfLifeCrimesLayerViewController",
    PASSED_RESTAURANTS: "PassedRestaurantsLayerViewController",
    FAILED_RESTAURANTS: "FailedRestaurantsLayerViewController",
    PLACES_OF_INTEREST: "PlacesOfInterestLayerViewController",
    AREA_OF_INTEREST: "AreaOfInterestViewController",
    POPUPS: "PopupLayerViewController"
};