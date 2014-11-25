/**
 * @class UIZoomViewController
 * @description ..
 *
 * @constructor
 */
function UIZoomViewController() {

    UIViewController.call(this);

    /////////////////////  PRIVATE ATTRIBUTES /////////////////////
    var self = this;

    var _titleLabel;
    var _weekButton;
    var _monthButton;

    /////////////////////  PUBLIC METHODS /////////////////////
    /**
     * @override
     */
    var super_viewDidAppear = this.viewDidAppear;
    this.viewDidAppear = function () {

        // zoom +
        _zoomPlusButton.getView().setFrame(21, 14.5, 24.6, 24.6);
        _zoomPlusButton.getView().setViewBox(0, 0, 24.6, 24.6);
        _zoomPlusButton.setImage("assets/icon/plus.svg");
        _zoomPlusButton.onClick(model.getMapModel().zoomIn);
        self.add(_zoomPlusButton);

        // zoom -
        _zoomMinusButton.getView().setFrame(21, 65, 24.6, 24.6);
        _zoomMinusButton.getView().setViewBox(0, 0, 24.6, 24.6);
        _zoomMinusButton.setImage("assets/icon/minus.svg");
        _zoomMinusButton.onClick(model.getMapModel().zoomOut);
        self.add(_zoomMinusButton);

        // separator
        _zoomSeparator.setImagePath("assets/icon/zoom_separator.svg");
        _zoomSeparator.getView().setFrame(12.5, 52, 51, 11);
        _zoomSeparator.getView().setViewBox(0, 0, 51, 11);
        self.add(_zoomSeparator);


        // Call super
        super_viewDidAppear.call(self);
    };


    /////////////////////  PRIVATE METHODS /////////////////////

    var init = function () {
        self.getView().addClass("ui-time-interval-view-controller");
        self.getView().setBackgroundColor(model.getThemeModel().toolBackgroundColor());
        self.getView().setCornerRadius(8);

        // Setup UI
        _zoomPlusButton = new UIButtonViewController;
        _zoomMinusButton = new UIButtonViewController;
        _zoomSeparator = new UIImageViewController;

    }();
}

Utils.extend(UIZoomViewController, UIViewController);