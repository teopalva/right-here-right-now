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
                    layers.push(AreaOfInterestLayerViewController);
                    layers.push(DirectionsLayerViewController);
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
                    layers.push(CtaBusStopsLayerViewController);
                    break;
                case Layers.CTA_BUSES:
                    layers.push(CtaBusVehiclesLayerViewController);
                    break;
                case Layers.CTA_TRAINS:
                    layers.push(CtaTrainLayerViewController);
                    break;
                case Layers.VIOLENT_CRIMES:
                    layers.push(ViolentCrimesLayerViewController);
                    break;
                case Layers.PROPERTY_CRIMES:
                    layers.push(PropertyCrimesLayerViewController);
                    break;
                case Layers.QUALITY_OF_LIFE_CRIMES:
                    layers.push(QualityOfLifeCrimesLayerViewController);
                    break;
                case Layers.RESTAURANTS:
                    layers.push(RestaurantsLayerViewController);
                    break;
                case Layers.POPUPS:
                    layers.push(PopupLayerViewController);
                    break;
            }

        });

        return layers;
    };

    /////////////////////////////// PRIVATE METHODS ///////////////////////////////
    var init = function() {

    } ();
}