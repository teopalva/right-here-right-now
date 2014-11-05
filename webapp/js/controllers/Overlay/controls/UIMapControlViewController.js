/**
 * @class UITripInfoViewController
 * @description ..
 *
 * @constructor
 */
function UIMapControlViewController() {

    UIViewController.call(this);

    /////////////////////  PRIVATE ATTRIBUTES /////////////////////
    var self = this;

    /////////////////////  PUBLIC METHODS /////////////////////
    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function () {
        var toolViewBox = self.getView().getViewBox();
        
        // satellite map button
        _satelliteButton.getView().setFrame(0, 27, 187, 40);
        _satelliteButton.getView().setViewBox(0, 0, 187, 40);
        _satelliteButton.setTitle("satellite map");
        self.add(_satelliteButton);
        
        // street map button
        _streetButton.getView().setFrame(0, 80, 187, 40);
        _streetButton.getView().setViewBox(0, 0, 187, 40);
        _streetButton.setTitle("street map");
        self.add(_streetButton);
        
        // zoom +
        _zoomPlusButton.getView().setFrame(188, 27.5, 83, 48);
        _zoomPlusButton.getView().setViewBox(0, 0, 83, 48);
        _zoomPlusButton.setImage("/webapp/assets/icon/zoom_plus.svg");
        self.add(_zoomPlusButton);
        
        // zoom -
        _zoomMinusButton.getView().setFrame(188, 81.5, 83, 35.5);
        _zoomMinusButton.getView().setViewBox(0, 0, 83, 35.5);
        _zoomMinusButton.setImage("/webapp/assets/icon/zoom_minus.svg");
        self.add(_zoomMinusButton);
        
        // zoom box
        _zoomButton.getView().setFrame(188, 13.5, 83, 118);
        _zoomButton.getView().setViewBox(0, 0, 83, 118);
        _zoomButton.setImage("/webapp/assets/icon/zoom_box.svg");
        self.add(_zoomButton);

        // Call super
        super_viewDidAppear.call(self);
    };


    /////////////////////  PRIVATE METHODS /////////////////////

    var init = function () {
        self.getView().addClass("ui-map-control-view-controller");

        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());
        
        _satelliteButton = new UIButtonViewController;
        _streetButton = new UIButtonViewController;
        _zoomPlusButton = new UIButtonViewController;
        _zoomMinusButton = new UIButtonViewController;
        _zoomButton = new UIButtonViewController;

    }();
}

Utils.extend(UIMapControlViewController, UIViewController);

