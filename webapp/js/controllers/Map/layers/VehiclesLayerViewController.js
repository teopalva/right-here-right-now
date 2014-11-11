/**
 * @description
 * @constructor
 */
function VehiclesLayerViewController() {
    MapLayerController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    // To draw the icons on the map
    var _markersViewController;
    var _markersColor = "blue";

    ////////////////////////// PUBLIC METHODS /////////////////////////

    /**
     * Updates the potoles on the screen
     */
    this.vehiclesUpdated = function () {
        var vehicles = model.getVehiclesModel().getVehicles();
        var data = vehicles;
        if (model.getAreaOfInterestModel().getAreaOfInterest()) {
            // filter objects
            data = model.getAreaOfInterestModel().filterObjects(vehicles);
        }
        var canvas = self.getView().getSvg();
        var points = canvas.selectAll("circle").data(data);
        _markersViewController.draw(self, points, _markersColor);

    };

    /**
     * @overridden
     */
    var super_dispose = this.dispose;
    this.dispose = function() {
        // Call super dispose
        super_dispose.call(self);

        // Do cleaning stuff here
        model.getVehiclesModel().stopUpdates();
        notificationCenter.unsuscribeFromAll(self);
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////

    var init = function () {
        self.getView().addClass("potholes-layer-view-controller");

        _markersViewController = new MarkersViewController();

        notificationCenter.subscribe(self, self.vehiclesUpdated, Notifications.vehicles.LAYER_UPDATED);
        notificationCenter.subscribe(self, self.vehiclesUpdated, Notifications.areaOfInterest.PATH_UPDATED);

        model.getVehiclesModel().startUpdates();

    }();
}

Utils.extend(VehiclesLayerViewController, MapLayerController);