/**
 * @description
 * @constructor
 */
function LightsLayerViewController() {
    MapLayerController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    // To draw the icons on the map
    var _markersViewController;
    var _markersColor = "green";

    ////////////////////////// PUBLIC METHODS /////////////////////////

    /**
     * Updates the potoles on the screen
     */
    this.lightsUpdated = function () {
        var lights = model.getLightsModel().getLights();
        var data = lights;
        if (model.getAreaOfInterestModel().getAreaOfInterest()) {
            // filter objects
            data = model.getAreaOfInterestModel().filterObjects(lights);
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
        model.getLightsModel().stopUpdates();
        notificationCenter.unsuscribeFromAll(self);
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////

    var init = function () {
        self.getView().addClass("lights-layer-view-controller");

        _markersViewController = new MarkersViewController();

        notificationCenter.subscribe(self, self.lightsUpdated, Notifications.lights.LAYER_UPDATED);
        notificationCenter.subscribe(self, self.lightsUpdated, Notifications.areaOfInterest.PATH_UPDATED);

        model.getLightsModel().startUpdates();
    }();
}

Utils.extend(LightsLayerViewController, MapLayerController);