/**
 * CrimesLayerViewController
 * @description Layer for crime data.
 * @constructor
 */
function CrimesLayerViewController() {
    MapLayerController.call(this);

    ////////////////////////// PRIVATE ATTRIBUTES //////////////////////////
    var self = this;

    // To draw the icons on the map
    var _markersViewController;
    var _markersColor = "red";

    ////////////////////////// PUBLIC METHODS /////////////////////////
    /**
     * Updates the crimes on the screen
     */
    this.crimesUpdated = function () {
        console.log("crimeUpdated")
        var crimes = model.getCrimesModel().getCrimes();

        var data = crimes;
        if (model.getAreaOfInterestModel().getAreaOfInterest()) {
            // filter objects
            data = model.getAreaOfInterestModel().filterObjects(crimes);
        }

        var canvas = self.getView().getSvg();
        var points = canvas.selectAll("circle").data(data);
        _markersViewController.draw(self,points,_markersColor);

    };

    this.pathChanged = function() {
        model.getCrimesModel().stopUpdates();
        model.getCrimesModel().updateCrimes();
    };

    /**
     * @overridden
     */
    var super_dispose = this.dispose;
    this.dispose = function() {
        // Call super dispose
        super_dispose.call(self);

        // Do cleaning stuff here
        model.getCrimesModel().stopUpdates();
        notificationCenter.unsuscribeFromAll(self);
    };

    ////////////////////////// PRIVATE METHODS //////////////////////////

    var init = function() {
        self.getView().addClass("crimes-layer-view-controller");

        _markersViewController = new MarkersViewController();

        notificationCenter.subscribe(self, self.crimesUpdated, Notifications.crimes.LAYER_UPDATED);
        notificationCenter.subscribe(self, self.pathChanged, Notifications.areaOfInterest.PATH_UPDATED);

        model.getCrimesModel().startUpdates();
    } ();
}

Utils.extend(CrimesLayerViewController, MapLayerController);
