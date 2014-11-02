/**
 *
 * @constructor
 */
function MapOverlayViewController() {
    UIViewController.call(this);
    /////////////////////////////// PRIVATE ATTRIBUTES ///////////////////////////////
    var self = this;

    /////////////////////////////// PUBLIC METHODS ///////////////////////////////

    /////////////////////////////// PRIVATE METHODS ///////////////////////////////
    var init = function() {
        self.getView().addClass("map-overlay-view-controller");
    } ();
}

Utils.extend(MapOverlayViewController, UIViewController);