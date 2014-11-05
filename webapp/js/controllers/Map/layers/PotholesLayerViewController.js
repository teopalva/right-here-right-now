/**
 * @description
 * @constructor
 */
function PotholesLayerViewController() {
    MapLayerController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    // To draw the icons on the map
    var _markersViewController;

    ////////////////////////// PUBLIC METHODS /////////////////////////
    /**
     * Adds the potholes on the screen
     */
    this.potholesAdded = function () {
        model.getPotholesModel().startUpdates();
    };

    /**
     * Removes the potholes from the screen
     */
    this.potholesCleaned = function () {
        model.getPotholesModel().stopUpdates();
        self.potholesUpdated();
    };

    /**
     * Updates the potoles on the screen
     */
    this.potholesUpdated = function () {
        var potholes = model.getPotholesModel().getPotholes();
        var canvas = self.getView().getSvg();
        var points = canvas.selectAll("circle").data(potholes);
        _markersViewController.draw(self,points);

    };

    ////////////////////////// PRIVATE METHODS //////////////////////////

    var init = function() {
        self.getView().addClass("potholes-layer-view-controller");

        _markersViewController = new MarkersViewController();

        notificationCenter.subscribe(self, self.potholesAdded, Notifications.potholes.LAYER_ADDED);
        notificationCenter.subscribe(self, self.potholesCleaned, Notifications.potholes.LAYER_CLEANED);
        notificationCenter.subscribe(self, self.potholesUpdated, Notifications.potholes.LAYER_UPDATED);

    } ();
}

Utils.extend(PotholesLayerViewController, MapLayerController);
