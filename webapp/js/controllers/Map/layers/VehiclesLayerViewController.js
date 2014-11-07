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
     * Adds the potholes on the screen
     */
    this.vehiclesAdded = function () {
        model.getVehiclesModel().startUpdates();
    };

    /**
     * Removes the potholes from the screen
     */
    this.vehiclesCleaned = function () {
        model.getVehiclesModel().stopUpdates();
        self.vehiclesUpdated();
    };

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

    ////////////////////////// PRIVATE METHODS //////////////////////////

    var init = function () {
        self.getView().addClass("potholes-layer-view-controller");

        _markersViewController = new MarkersViewController();

        notificationCenter.subscribe(self, self.vehiclesAdded, Notifications.vehicles.LAYER_ADDED);
        notificationCenter.subscribe(self, self.vehiclesCleaned, Notifications.vehicles.LAYER_CLEANED);
        notificationCenter.subscribe(self, self.vehiclesUpdated, Notifications.vehicles.LAYER_UPDATED);
        notificationCenter.subscribe(self, self.vehiclesUpdated, Notifications.areaOfInterest.PATH_UPDATED);

    }();
}

Utils.extend(VehiclesLayerViewController, MapLayerController);