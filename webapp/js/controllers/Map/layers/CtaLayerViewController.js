/***
 * @class CtaLayerViewController
 * @description Layer of CTA buses lines and stops.
 *
 * @constructor
 */
function CtaLayerViewController() {
    MapLayerController.call(this);

    //////////////////////// PRIVATE ATTRIBUTES ////////////////////////
    var self = this;

    // To draw the icons on the map
    var _markersViewController;
    var _vehiclesColor = "teal";
    var _stopsColor = "blue";

    //////////////////////// PUBLIC METHODS ////////////////////////
    this.timeChanged = function() {
        var time = model.getCtaModel().getCtaTime();
        console.log(time);
    };

    this.vehiclesChanged = function() {
        var vehicles = model.getCtaModel().getVehicles();
        console.log("Vehicles");
        console.log(vehicles);
        var canvas = self.getView().getSvg();
        var points = canvas.selectAll("circle").data(vehicles);
        _markersViewController.draw(self,points,_vehiclesColor);
    };

    this.stopsChanged = function() {
        var stops = model.getCtaModel().getStops();
        console.log("Stops");
        console.log(stops);
        var canvas = self.getView().getSvg();
        var points = canvas.selectAll("circle").data(stops);
        _markersViewController.draw(self,points,_stopsColor);
    };

    /**
     * Start all the query related on the selected area
     */
    this.layerAdded = function() {
        //model.getCtaModel().setArea();
        // TODO: in the following method
        model.getCtaModel().retrieveData();
    };

    /**
     * Clear Data
     */
    this.layerCleaned = function() {
        console.log("layer removed");
        model.getCtaModel().clearData();
        self.stopsChanged();
        self.vehiclesChanged();
    };

    //////////////////////// PRIVATE METHODS ////////////////////////
    var init = function() {
        self.getView().addClass("cta-layer-view-controller");

        _markersViewController = new MarkersViewController();

        // Subscribe to notifications
        notificationCenter.subscribe(self, self.timeChanged, Notifications.cta.TIME);
        notificationCenter.subscribe(self, self.stopsChanged, Notifications.cta.STOPS);
        notificationCenter.subscribe(self, self.vehiclesChanged, Notifications.cta.VECHICLES);

        notificationCenter.subscribe(self, self.layerAdded, Notifications.cta.LAYER_ADDED);
        notificationCenter.subscribe(self, self.layerCleaned, Notifications.cta.LAYER_CLEANED);
        //notificationCenter.subscribe(self, self.ctaUpdated, Notifications.cta.LAYER_UPDATED);

        //model.getCtaModel().startUpdates();
    } ();

}

Utils.extend(PotholesLayerViewController, MapLayerController);
