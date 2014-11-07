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
     * Adds the divvyBikes on the screen
     */
    this.divvyBikesAdded = function () {
        model.getDivvyBikesModel().startUpdates();
    };

    /**
     * Removes the divvyBikes from the screen
     */
    this.divvyBikesCleaned = function () {
        model.getDivvyBikesModel().stopUpdates();
        self.divvyBikesUpdated();
    };

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

    ////////////////////////// PRIVATE METHODS //////////////////////////

    var init = function () {
        self.getView().addClass("divvyBikes-layer-view-controller");

        _markersViewController = new MarkersViewController();

        notificationCenter.subscribe(self, self.divvyBikesAdded, Notifications.divvyBikes.LAYER_ADDED);
        notificationCenter.subscribe(self, self.divvyBikesCleaned, Notifications.divvyBikes.LAYER_CLEANED);
        notificationCenter.subscribe(self, self.divvyBikesUpdated, Notifications.divvyBikes.LAYER_UPDATED);
        notificationCenter.subscribe(self, self.divvyBikesUpdated, Notifications.areaOfInterest.PATH_UPDATED);

    }();
}

Utils.extend(DivvyBikesLayerViewController, MapLayerController);