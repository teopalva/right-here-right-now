/**
 * @class PotholesLayerViewController
 * @description
 *
 * @constructor
 */
function PotholesLayerViewController() {
    MapLayerController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    // To draw the icons on the map
    var _markersViewController;
    var _markersColor = "brown";

    ////////////////////////// PUBLIC METHODS /////////////////////////
    /**
     * Updates the potholes on the screen
     */
    this.potholesUpdated = function () {
        var potholes = model.getPotholesModel().getPotholes();
        var data = potholes;
        if (model.getAreaOfInterestModel().getAreaOfInterest()) {
            // filter objects
            data = model.getAreaOfInterestModel().filterObjects(potholes);
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
        model.getPotholesModel().stopUpdates();
        notificationCenter.unsuscribeFromAll(self);
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////

    var init = function () {
        self.getView().addClass("potholes-layer-view-controller");

        _markersViewController = new MarkersViewController();

        notificationCenter.subscribe(self, self.potholesUpdated, Notifications.potholes.LAYER_UPDATED);
        notificationCenter.subscribe(self, self.potholesUpdated, Notifications.areaOfInterest.PATH_UPDATED);

        model.getPotholesModel().startUpdates();
    }();
}

Utils.extend(PotholesLayerViewController, MapLayerController);