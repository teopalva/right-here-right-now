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
     * Adds the crimes on the screen
     */
    this.crimesAdded = function () {
        model.getCrimesModel().startUpdates();
    };

    /**
     * Removes the crimes from the screen
     */
    this.crimesCleaned = function () {
        model.getCrimesModel().stopUpdates();
        self.crimesUpdated();
    };

    /**
     * Updates the crimes on the screen
     */
    this.crimesUpdated = function () {
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

    ////////////////////////// PRIVATE METHODS //////////////////////////

    var init = function() {
        self.getView().addClass("crimes-layer-view-controller");

        _markersViewController = new MarkersViewController();

        notificationCenter.subscribe(self, self.crimesAdded, Notifications.crimes.LAYER_ADDED);
        notificationCenter.subscribe(self, self.crimesCleaned, Notifications.crimes.LAYER_CLEANED);
        notificationCenter.subscribe(self, self.crimesUpdated, Notifications.crimes.LAYER_UPDATED);
        notificationCenter.subscribe(self, self.crimesUpdated, Notifications.areaOfInterest.PATH_UPDATED);


    } ();
}

Utils.extend(CrimesLayerViewController, MapLayerController);
