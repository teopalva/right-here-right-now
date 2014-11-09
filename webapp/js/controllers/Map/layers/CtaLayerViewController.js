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
    var _counter = 0;

    // To draw the icons on the map
    var _markersViewController;
    var _vehiclesColor = "teal";
    //var _stopsColor = "blue";

    //////////////////////// PUBLIC METHODS ////////////////////////
    //this.timeChanged = function() {
    //    var time = model.getCtaModel().getCtaTime();
    //    console.log(time);
    //};

    this.vehiclesChanged = function() {
        // Draw only when all the queries ended.
        if(++_counter === model.getCtaModel().getRoutes().length) {
            var vehicles = model.getCtaModel().getVehicles();
            console.log("Vehicles");
            console.log(vehicles);

            var data = vehicles;
            if (model.getAreaOfInterestModel().getAreaOfInterest()) {
                // filter objects
                data = model.getAreaOfInterestModel().filterObjects(vehicles);
            }

            var canvas = self.getView().getSvg();
            var points = canvas.selectAll("circle").data(data);
            _markersViewController.draw(self, points, _vehiclesColor);

            _counter = 0;
        }
    };

    //this.stopsChanged = function() {
    //    var stops = model.getCtaModel().getStops();
    //    //console.log("Stops");
    //    //console.log(stops);
    //    var canvas = self.getView().getSvg();
    //    var points = canvas.selectAll("circle").data(stops);
    //    _markersViewController.draw(self,points,_stopsColor);
    //};

    /**
     * Start all the query related on the selected area
     */
    this.layerAdded = function() {
        //model.getCtaModel().setArea();
        // TODO: in the following method
        //model.getCtaModel().retrieveData();
    };

    /**
     * Clear Data
     */
    this.layerCleaned = function() {
        console.log("layer removed");
        model.getCtaModel().clearData();
        //self.stopsChanged();
        self.vehiclesChanged();
    };

    //////////////////////// PRIVATE METHODS ////////////////////////
    var init = function() {
        self.getView().addClass("cta-layer-view-controller");

        _markersViewController = new MarkersViewController();

        // Subscribe to notifications
        //notificationCenter.subscribe(self, self.timeChanged, Notifications.cta.TIME);
        //notificationCenter.subscribe(self, self.stopsChanged, Notifications.cta.STOPS);
        notificationCenter.subscribe(self, self.vehiclesChanged, Notifications.cta.VEHICLES);

        notificationCenter.subscribe(self, self.layerAdded, Notifications.cta.LAYER_ADDED);
        notificationCenter.subscribe(self, self.layerCleaned, Notifications.cta.LAYER_CLEANED);
        //notificationCenter.subscribe(self, self.ctaUpdated, Notifications.cta.LAYER_UPDATED);
        notificationCenter.subscribe(self, self.vehiclesChanged, Notifications.areaOfInterest.PATH_UPDATED);


        //model.getCtaModel().startUpdates();
    } ();

}

Utils.extend(CtaLayerViewController, MapLayerController);
