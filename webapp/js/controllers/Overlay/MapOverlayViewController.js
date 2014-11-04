/**
 * @class MapOverlayViewController
 * @description
 *
 *
 * @constructor
 */
function MapOverlayViewController() {
    UIViewController.call(this);
    /////////////////////////////// PRIVATE ATTRIBUTES ///////////////////////////////
    var self = this;

    var _padding = {top: 12.5, left: 12.5};


    // Tools
    var _dayViewController;
    var _dayViewSize = {width: 316.5, height: 283.5};

    /////////////////////////////// PUBLIC METHODS ///////////////////////////////
    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function() {

        _dayViewController.getView().setFrame(_padding.left, _padding.top, _dayViewSize.width, _dayViewSize.height);
        _dayViewController.getView().setViewBox(0, 0, _dayViewSize.width, _dayViewSize.height);
        self.add(_dayViewController);

        addBehaviours();

        // Call super
        super_viewDidAppear.call(self);
    };

    /////////////////////////////// PRIVATE METHODS ///////////////////////////////
    var addBehaviours = function() {

    };

    var init = function() {
        self.getView().addClass("map-overlay-view-controller");

        _dayViewController = new UIDayViewController();

    } ();
}

Utils.extend(MapOverlayViewController, UIViewController);