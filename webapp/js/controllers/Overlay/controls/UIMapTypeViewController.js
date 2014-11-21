/**
 * @class UIMapTypeViewController
 * @description ..
 *
 * @constructor
 */
function UIMapTypeViewController() {

    UIViewController.call(this);

    /////////////////////  PRIVATE ATTRIBUTES /////////////////////
    var self = this;

    var _mapButton;

    var _mapTypes = {
        "STREET": "street",
        "SATELLITE": "satellite"
    };

    var _map = _mapTypes.STREET;

    /////////////////////  PUBLIC METHODS /////////////////////
    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function () {

        _mapButton.getView().setFrame(5, 5, 80, 95);
        _mapButton.getView().setViewBox(0, 0, 80, 95);
        _mapButton.setImage("assets/icon/satellite.png");
        _mapButton.onClick(changeMap);
        self.add(_mapButton);

        // Call super
        super_viewDidAppear.call(self);
    };


    /////////////////////  PRIVATE METHODS /////////////////////

    var init = function () {
        self.getView().addClass("ui-map-type-view-controller");
        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());

        // Setup UI
        _mapButton = new UIButtonViewController;

    }();

    var changeMap = function () {
        // change map
        _map = _map === _mapTypes.STREET ? _mapTypes.SATELLITE : _mapTypes.STREET;
        model.getMapModel().changeLayer(_map);
        // change button
        var path = _map === _mapTypes.STREET ? "assets/icon/satellite.png" : "assets/icon/street.png"
        _mapButton.setImage(path);
    }
}

Utils.extend(UIMapTypeViewController, UIViewController);