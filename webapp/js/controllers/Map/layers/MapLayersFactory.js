/**
 * @class MapLayersFactory
 * @description Factory that returns the layers of the map based on the status of the model
 *
 * @constructor
 */
function MapLayersFactory() {
    /////////////////////////////// PRIVATE ATTRIBUTES ///////////////////////////////
    var self = this;

    /////////////////////////////// PUBLIC METHODS ///////////////////////////////
    this.getMapLayers = function() {
        var layers = [];

        var activeLayers = model.getMapLayersModel().getActiveLayers();

        activeLayers.forEach(function(layer) {
            switch(layer) {
                case Layers.USER_PATH:
                    layers.push(UserPathLayerViewController);
                    break;
                case Layers.POTHOLES:
                    layers.push(PotholesLayerViewController);
                    break;
                case Layers.CTA:
                    layers.push(CtaLayerViewController);
                    break;
            }
        });

        return layers;
    };

    /////////////////////////////// PRIVATE METHODS ///////////////////////////////
    var init = function() {

    } ();
}