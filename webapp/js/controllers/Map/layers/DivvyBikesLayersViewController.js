/**
 * @description
 * @constructor
 */
function DivvyBikesLayerViewController() {
    MapLayerController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    // To draw the icons on the map
    var _markersViewController;
    var _markersColor = "orange";

    ////////////////////////// PUBLIC METHODS /////////////////////////

    /**
     * Updates the potoles on the screen
     */
    this.divvyBikesUpdated = function () {
        var divvyBikes = model.getDivvyBikesModel().getDivvyBikes();
        var data = divvyBikes;
        if (model.getAreaOfInterestModel().getAreaOfInterest()) {
            // filter objects
            data = model.getAreaOfInterestModel().filterObjects(divvyBikes);
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
        model.getDivvyBikesModel().stopUpdates();
        notificationCenter.unsuscribeFromAll(self);
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////

    var init = function () {
        self.getView().addClass("divvyBikes-layer-view-controller");

        _markersViewController = new MarkersViewController();

        notificationCenter.subscribe(self, self.divvyBikesUpdated, Notifications.divvyBikes.LAYER_UPDATED);
        notificationCenter.subscribe(self, self.divvyBikesUpdated, Notifications.areaOfInterest.PATH_UPDATED);

        model.getDivvyBikesModel().startUpdates();
    }();
}

Utils.extend(DivvyBikesLayerViewController, MapLayerController);