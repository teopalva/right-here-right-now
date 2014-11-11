/**
 * @class UIMapMarkerViewController
 * @description
 *
 * @constructor
 */
function UIMapMarkerViewController() {
    UIViewController.call(this);
    ///////////////////////////// PRIVATE ATTRIBUTES /////////////////////////////
    var self = this;

    ///////////////////////////// PUBLIC METHODS ////////////////////////////////
    /**
     * Handler method for ZOOM_CHANGED notifications
     */
    this.zoomChanged = function() {
        console.log(model.getMapModel().getZoomLevel());
    };

    this.setSizeAtDefaultZoomLevel = function(width, height) {
        self.getView().setFrameSize(width, height);
    };

    ///////////////////////////// PRIVATE METHODS ///////////////////////////////
    var init = function() {
        self.getView().addClass("ui-map-marker-view-controller");

        // TODO debug
        self.setSizeAtDefaultZoomLevel(2,2);
        self.getView().setBackgroundColor("#000");

        notificationCenter.subscribe(self, self.zoomChanged, Notifications.mapController.ZOOM_CHANGED);
    } ();
}

Utils.extend(UIMapMarkerViewController, UIViewController);