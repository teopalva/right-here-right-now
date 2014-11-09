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
     * Start all the query related on the selected area
     */
    this.layerAdded = function() {
        //model.getCtaModel().setArea();
        // TODO: in the following method
        model.getCtaModel().retrieveData();
    };

    /**
     * Clear Data
     */
    this.layerCleaned = function() {
        console.log("layer removed");
        model.getCtaModel().clearData();
        self.stopsChanged();
    };

    //////////////////////// PRIVATE METHODS ////////////////////////
    var init = function() {
        self.getView().addClass("cta-stops-layer-view-controller");

        _markersViewController = new MarkersViewController();

        // Subscribe to notifications
        //notificationCenter.subscribe(self, self.stopsChanged, Notifications.cta.STOPS);

        notificationCenter.subscribe(self, self.layerAdded, Notifications.cta.LAYER_ADDED);
        notificationCenter.subscribe(self, self.layerCleaned, Notifications.cta.LAYER_CLEANED);
        //notificationCenter.subscribe(self, self.ctaUpdated, Notifications.cta.LAYER_UPDATED);
        //notificationCenter.subscribe(self, self.stopsChanged, Notifications.areaOfInterest.PATH_UPDATED);

    } ();

}

Utils.extend(CtaLayerViewController, MapLayerController);
