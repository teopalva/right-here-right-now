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
                case Layers.VEHICLES:
                    layers.push(VehiclesLayerViewController);
                    break;
                case Layers.LIGHTS:
                    layers.push(LightsLayerViewController);
                    break;
                case Layers.DIVVY_BIKES:
                    layers.push(DivvyBikesLayerViewController);
                    break;
                case Layers.CTA_STOPS:
                    layers.push(CtaStopsLayerViewController);
                    break;
                case Layers.CTA_BUSES:
                    layers.push(CtaLayerViewController);
                    break;
                case Layers.VIOLENT_CRIMES:
                    layers.push(ViolentCrimesLayerViewController);
                    break;
                
            }

        });

        return layers;
    };

    /////////////////////////////// PRIVATE METHODS ///////////////////////////////
    var init = function() {

    } ();
}