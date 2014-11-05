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
     * Adds the lights on the screen
     */
    this.lightsAdded = function () {
        model.getLightsModel().startUpdates();
    };

    /**
     * Removes the lights from the screen
     */
    this.lightsCleaned = function () {
        model.getLightsModel().stopUpdates();
        self.lightsUpdated();
    };

    /**
     * Updates the potoles on the screen
     */
    this.lightsUpdated = function () {
        var lights = model.getLightsModel().getLights();
        var canvas = self.getView().getSvg();
        var points = canvas.selectAll("circle").data(lights);
        _markersViewController.draw(self,points,_markersColor);

    };

    ////////////////////////// PRIVATE METHODS //////////////////////////

    var init = function() {
        self.getView().addClass("lights-layer-view-controller");

        _markersViewController = new MarkersViewController();

        notificationCenter.subscribe(self, self.lightsAdded, Notifications.lights.LAYER_ADDED);
        notificationCenter.subscribe(self, self.lightsCleaned, Notifications.lights.LAYER_CLEANED);
        notificationCenter.subscribe(self, self.lightsUpdated, Notifications.lights.LAYER_UPDATED);

    } ();
}

Utils.extend(LightsLayerViewController, MapLayerController);
