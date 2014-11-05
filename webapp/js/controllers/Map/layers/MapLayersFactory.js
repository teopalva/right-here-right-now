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

        // Here there should be some form of if, or switch
        layers.push(UserPathLayerViewController);
        layers.push(CtaLayerViewController);

        return layers;
    };

    /////////////////////////////// PRIVATE METHODS ///////////////////////////////
    var init = function() {

    } ();
}