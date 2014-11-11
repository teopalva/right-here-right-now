/***
 * @class CtaStopsLayerViewController
 * @description Layer of CTA buses stops.
 *
 * @constructor
 */
function CtaStopsLayerViewController() {
    MapLayerController.call(this);

    //////////////////////// PRIVATE ATTRIBUTES ////////////////////////
    var self = this;

    // To draw the icons on the map
    var _markersViewController;
    var _stopsColor = "#f67a43";

    //////////////////////// PUBLIC METHODS ////////////////////////

    /**
     * Draw stops when new ones are retrieved
     */
    this.stopsChanged = function() {
        var stops = model.getCtaModel().getStops();
        console.log("Stops");
        console.log(stops);

        var data = stops;
        if (model.getAreaOfInterestModel().getAreaOfInterest()) {
            // filter objects
            data = model.getAreaOfInterestModel().filterObjects(stops);
        }

        var canvas = self.getView().getSvg();
        var points = canvas.selectAll("circle").data(data);
        _markersViewController.draw(self,points,_stopsColor);
    };

    /**
     *
     */
    this.pathChanged = function() {
        model.getCtaModel().stopUpdates();
        model.getCtaModel().retrieveData();

        //self.stopsChanged();
    };

    /**
     * @overridden
     */
    var super_dispose = this.dispose;
    this.dispose = function() {
        console.log("CTA Stops Dispose")

        // Call super dispose
        super_dispose.call(self);

        // Do cleaning stuff here
        model.getCtaModel().stopUpdates();
        notificationCenter.unsuscribeFromAll(self);
    };

    //////////////////////// PRIVATE METHODS ////////////////////////
    var init = function() {
        self.getView().addClass("cta-stops-layer-view-controller");

        _markersViewController = new MarkersViewController();

        // Subscribe to notifications
        // TODO: restore to draw stops
        //notificationCenter.subscribe(self, self.stopsChanged, Notifications.cta.STOPS);

        notificationCenter.subscribe(self, self.pathChanged, Notifications.areaOfInterest.PATH_UPDATED);

        // Start all the queries
        model.getCtaModel().retrieveData();

    } ();

}

Utils.extend(CtaLayerViewController, MapLayerController);
