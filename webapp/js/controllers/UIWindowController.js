/**
 * @class UIWindowController
 * @description
 *
 * @param windowContainer the d3 selection of the element that the window controller has to use to render its subview
 * hierarchy
 * @constructor
 */
function UIWindowController(windowContainer) {
    /////////////////////////////// PRIVATE ATTRIBUTES ///////////////////////////////
    var self = this;

    var _mapOverlayViewController;
    var _mapViewController;

    var windowElement;
    /////////////////////////////// PUBLIC METHODS ///////////////////////////////

    /////////////////////////////// PRIVATE METHODS ///////////////////////////////
    var init = function() {
        windowElement = windowContainer.append("div");
        windowElement.classed("ui-window-controller", true);

        // Initialize map
        var mapContainer = windowElement.append("div");
        _mapViewController = new MapViewController(mapContainer);

        // Initialize overlay
        _mapOverlayViewController = new MapOverlayViewController();
        _mapOverlayViewController.getView().setFrame(0, 0, "100%", "100%");
        _mapOverlayViewController.getView().setViewBox(0, 0, 3750, 1000);
        _mapOverlayViewController.getView().appendTo(windowElement);
        _mapOverlayViewController.viewDidAppear();
    } ();
}
