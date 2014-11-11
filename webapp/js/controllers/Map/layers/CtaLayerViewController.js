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

    // TODO: use queue.js
    var _counter = 0;

    // To draw the icons on the map
    var _markersViewController;
    var _vehiclesColor = "teal";

    //////////////////////// PUBLIC METHODS ////////////////////////
    //this.timeChanged = function() {
    //    var time = model.getCtaModel().getCtaTime();
    //    console.log(time);
    //};

    this.vehiclesChanged = function() {
        var fakeVehicles = model.getCtaModel().getFakeVehicles();

        console.log(_counter);

        // Draw only when all the queries ended.
        if(++_counter === model.getCtaModel().getRoutes().length || fakeVehicles) {
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


    this.pathChanged = function() {
        model.getCtaModel().stopUpdates();
        _counter = 0;
        self.vehiclesChanged();
    };

    /**
     * @overridden
     */
    var super_dispose = this.dispose;
    this.dispose = function() {
        console.log("CTA Bus Dispose")

        // Call super dispose
        super_dispose.call(self);

        // Do cleaning stuff here
        model.getCtaModel().stopUpdates();
        notificationCenter.unsuscribeFromAll(self);
    };
    //////////////////////// PRIVATE METHODS ////////////////////////
    var init = function() {
        self.getView().addClass("cta-layer-view-controller");

        _markersViewController = new MarkersViewController();

        // Subscribe to notifications
        notificationCenter.subscribe(self, self.vehiclesChanged, Notifications.cta.VEHICLES);
        notificationCenter.subscribe(self, self.pathChanged, Notifications.areaOfInterest.PATH_UPDATED);


    } ();

}

Utils.extend(CtaLayerViewController, MapLayerController);
